import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { requireAuth } from "../auth.js";
import { notifyNewLead } from "../mailer.js";

export const leadsRouter = Router();

// Un visitante real envía el formulario una vez, tal vez dos si se
// equivoca. 8 por IP cada 15 minutos deja pasar eso sin fricción y frena
// un bot que intente inundar el endpoint.
const createLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(300),
  message: z.string().trim().min(1).max(5000),
  source: z.string().trim().max(100).optional(),
  locale: z.enum(["es", "en"]).optional(),
  // honeypot: el formulario real lo manda siempre vacío (un campo oculto
  // por CSS que ninguna persona ve ni llena). Se valida aquí también, no
  // solo en el navegador — un bot que le pegue directo a la API sin pasar
  // por el HTML se saltaría un honeypot que solo viviera en el frontend.
  company: z.string().max(200).optional(),
});

/** Público: crea un lead desde el formulario del sitio. Sin autenticación
 * (es el punto de entrada de cualquier visitante), protegido por
 * rate-limit + validación estricta de payload (Prisma parametriza todo,
 * cero SQL armado a mano). */
leadsRouter.post("/", createLeadLimiter, async (req, res) => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors });
  }
  const { name, phone, email, subject, message, source, locale, company } = parsed.data;

  // honeypot relleno: se responde éxito (para no delatarle al bot que
  // falló) pero no se guarda nada ni se notifica por correo
  if (company) return res.status(201).json({ id: "ok" });

  const lead = await prisma.lead.create({
    data: {
      name,
      phone: phone || null,
      email,
      subject,
      message,
      source: source || "contactus",
      locale: locale || "es",
      userAgent: req.header("user-agent")?.slice(0, 300),
    },
  });

  // no bloquea la respuesta al visitante por un SMTP lento
  void notifyNewLead({ name, phone: phone || null, email, subject, message });

  res.status(201).json({ id: lead.id });
});

/** Panel: lista paginada, la más reciente primero. */
leadsRouter.get("/", requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = 25;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;

  const where = status && ["NEW", "CONTACTED", "ARCHIVED"].includes(status) ? { status: status as never } : {};

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  res.json({ items, total, page, pageSize });
});

const updateLeadSchema = z.object({ status: z.enum(["NEW", "CONTACTED", "ARCHIVED"]) });

/** Panel: marcar un lead como contactado/archivado. */
leadsRouter.patch("/:id", requireAuth, async (req, res) => {
  const parsed = updateLeadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  try {
    const lead = await prisma.lead.update({ where: { id: String(req.params.id) }, data: { status: parsed.data.status } });
    res.json(lead);
  } catch {
    res.status(404).json({ error: "No encontrado" });
  }
});
