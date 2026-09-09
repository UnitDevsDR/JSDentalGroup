import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { requireAuth } from "../auth.js";
import { normalizePhone } from "../contacts.js";

export const contactsRouter = Router();

const PAGE_SIZE = 25;

const STAGES = [
  "NEW",
  "CONTACTED",
  "APPOINTMENT_SET",
  "ATTENDED",
  "TREATMENT_ACCEPTED",
  "LOST",
  "ARCHIVED",
] as const;

const LOSS_REASONS = ["PRICE", "SCHEDULE", "LOCATION", "NO_ANSWER", "OTHER"] as const;

const CHANNELS = ["CALL", "WHATSAPP", "EMAIL", "IN_PERSON", "NOTE"] as const;

/**
 * Panel: la lista de personas.
 *
 * Por defecto ordena por último movimiento —quien acaba de escribir va
 * arriba—, que es como se trabaja una bandeja. `vencidos=1` cambia a los que
 * tienen el seguimiento pasado de fecha, del más viejo al más nuevo: esa es
 * la cola con la que se empieza el día.
 */
contactsRouter.get("/", requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const stage = typeof req.query.stage === "string" && STAGES.includes(req.query.stage as never)
    ? (req.query.stage as (typeof STAGES)[number])
    : undefined;
  const ownerId = typeof req.query.ownerId === "string" ? req.query.ownerId : undefined;
  const overdue = req.query.vencidos === "1";
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  const where = {
    ...(stage ? { stage } : {}),
    // "mios" evita que el panel tenga que saber el id de quien está adentro
    ...(ownerId ? { ownerId: ownerId === "mios" ? req.adminId : ownerId } : {}),
    ...(overdue ? { nextFollowUpAt: { lte: new Date() } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            // el teléfono se busca por su forma normalizada: da igual cómo
            // lo escriba quien busca
            ...(normalizePhone(q) ? [{ phoneNormalized: { contains: normalizePhone(q)! } }] : []),
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: overdue ? { nextFollowUpAt: "asc" } : { lastActivityAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        owner: { select: { id: true, email: true } },
        _count: { select: { leads: true, interactions: true } },
        // el último mensaje, para que la fila diga de qué se trata sin abrir
        leads: { orderBy: { createdAt: "desc" }, take: 1, select: { subject: true, createdAt: true } },
      },
    }),
    prisma.contact.count({ where }),
  ]);

  res.json({ items, total, page, pageSize: PAGE_SIZE });
});

/** Panel: la ficha completa — la persona, todos sus mensajes y todo lo que
 *  se ha hablado con ella. */
contactsRouter.get("/:id", requireAuth, async (req, res) => {
  const contact = await prisma.contact.findUnique({
    where: { id: String(req.params.id) },
    include: {
      owner: { select: { id: true, email: true } },
      leads: { orderBy: { createdAt: "desc" } },
      interactions: {
        orderBy: { occurredAt: "desc" },
        include: { author: { select: { id: true, email: true } } },
      },
    },
  });
  if (!contact) return res.status(404).json({ error: "No encontrado" });

  // Otras fichas con el mismo teléfono. La unión automática es solo por
  // correo (ver src/contacts.ts): en una casa se comparte el número, así
  // que juntarlas o no es decisión de quien conoce a los pacientes.
  const possibleDuplicates = contact.phoneNormalized
    ? await prisma.contact.findMany({
        where: { phoneNormalized: contact.phoneNormalized, id: { not: contact.id } },
        select: { id: true, name: true, email: true },
      })
    : [];

  res.json({ ...contact, possibleDuplicates });
});

const updateContactSchema = z
  .object({
    stage: z.enum(STAGES).optional(),
    lossReason: z.enum(LOSS_REASONS).nullable().optional(),
    lossNote: z.string().trim().max(500).nullable().optional(),
    ownerId: z.string().trim().min(1).nullable().optional(),
    nextFollowUpAt: z.iso.datetime().nullable().optional(),
    name: z.string().trim().min(1).max(200).optional(),
    phone: z.string().trim().max(40).nullable().optional(),
    email: z.string().trim().email().max(200).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Nada que cambiar" });

/** Panel: etapa, responsable, próximo seguimiento, motivo de pérdida y
 *  corrección de los datos de contacto. */
contactsRouter.patch("/:id", requireAuth, async (req, res) => {
  const parsed = updateContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors });
  }
  const data = parsed.data;

  // el responsable tiene que existir: un id inventado dejaría la ficha
  // asignada a nadie sin que se note
  if (data.ownerId) {
    const owner = await prisma.adminUser.findUnique({ where: { id: data.ownerId }, select: { id: true } });
    if (!owner) return res.status(400).json({ error: "Ese responsable no existe" });
  }

  const update: Record<string, unknown> = { ...data };
  if (data.nextFollowUpAt !== undefined) {
    update.nextFollowUpAt = data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null;
  }
  if (data.phone !== undefined) update.phoneNormalized = normalizePhone(data.phone);
  if (data.email !== undefined && data.email) update.email = data.email.toLowerCase();
  // el motivo solo tiene sentido en una ficha perdida: al sacarla de LOST se
  // limpia, para que no quede un "no contesta" viejo colgando de alguien que
  // sí volvió
  if (data.stage !== undefined && data.stage !== "LOST") {
    update.lossReason = null;
    update.lossNote = null;
  }

  try {
    const contact = await prisma.contact.update({ where: { id: String(req.params.id) }, data: update });
    res.json(contact);
  } catch {
    res.status(404).json({ error: "No encontrado" });
  }
});

const createInteractionSchema = z.object({
  channel: z.enum(CHANNELS),
  body: z.string().trim().min(1).max(5000),
  /** cuándo ocurrió de verdad; por defecto, ahora */
  occurredAt: z.iso.datetime().optional(),
});

/** Panel: anotar qué se habló. Es lo que el equipo hace todos los días. */
contactsRouter.post("/:id/interactions", requireAuth, async (req, res) => {
  const parsed = createInteractionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors });
  }
  const contactId = String(req.params.id);
  const occurredAt = parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : new Date();

  const contact = await prisma.contact.findUnique({ where: { id: contactId }, select: { id: true, lastActivityAt: true } });
  if (!contact) return res.status(404).json({ error: "No encontrado" });

  const [interaction] = await prisma.$transaction([
    prisma.interaction.create({
      data: { contactId, authorId: req.adminId, channel: parsed.data.channel, body: parsed.data.body, occurredAt },
      include: { author: { select: { id: true, email: true } } },
    }),
    // anotar una llamada de la semana pasada no debe hacer saltar la ficha
    // al tope de la lista: solo cuenta si es más reciente que lo que había
    prisma.contact.update({
      where: { id: contactId },
      data: { lastActivityAt: occurredAt > contact.lastActivityAt ? occurredAt : contact.lastActivityAt },
    }),
  ]);

  res.status(201).json(interaction);
});

/** Panel: borrar una anotación. Solo quien la escribió, y solo mientras esté
 *  fresca — un historial que se puede reescribir a voluntad no es historial;
 *  esto es para el que se equivocó de ficha, no para borrar el pasado. */
const VENTANA_BORRADO_MS = 15 * 60 * 1000;

contactsRouter.delete("/:id/interactions/:interactionId", requireAuth, async (req, res) => {
  const interaction = await prisma.interaction.findUnique({
    where: { id: String(req.params.interactionId) },
    select: { id: true, authorId: true, createdAt: true, contactId: true },
  });

  if (!interaction || interaction.contactId !== String(req.params.id)) {
    return res.status(404).json({ error: "No encontrado" });
  }
  if (interaction.authorId !== req.adminId) {
    return res.status(403).json({ error: "Solo quien la escribió puede borrarla" });
  }
  if (Date.now() - interaction.createdAt.getTime() > VENTANA_BORRADO_MS) {
    return res.status(403).json({ error: "Ya pasó el tiempo para borrarla" });
  }

  await prisma.interaction.delete({ where: { id: interaction.id } });
  res.json({ ok: true });
});
