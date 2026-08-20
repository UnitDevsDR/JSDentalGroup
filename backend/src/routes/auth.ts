import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { issueSession, clearSession, requireAuth, verifyPassword } from "../auth.js";

export const authRouter = Router();

// Frena fuerza bruta: 10 intentos por IP cada 15 minutos. argon2 ya hace
// cada intento individual lento; esto además limita el volumen total.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { email } });

  // mismo mensaje exista o no la cuenta: no revela qué correos están
  // registrados (evita enumeración de usuarios)
  const invalid = () => res.status(401).json({ error: "Credenciales inválidas" });
  if (!user) return invalid();

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return invalid();

  await issueSession(res, user.id);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  res.json({ ok: true });
});

authRouter.post("/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.adminUser.findUnique({ where: { id: req.adminId }, select: { id: true, email: true } });
  if (!user) return res.status(401).json({ error: "No autenticado" });
  res.json(user);
});
