// Variables de entorno validadas al arrancar: si falta algo crítico, el
// proceso falla de inmediato con un mensaje claro, en vez de arrancar a
// medias y fallar en el primer request real.
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerido"),
  // firma de las cookies de sesión del panel admin — 32+ bytes aleatorios
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener al menos 32 caracteres"),
  // orígenes permitidos para CORS, separados por coma (el sitio estático y,
  // en desarrollo, el preview local)
  ALLOWED_ORIGINS: z.string().min(1),
  // SMTP para las notificaciones de nuevo lead (opcional: sin esto, el lead
  // igual se guarda en la base de datos, solo no se envía el correo)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  NOTIFY_EMAIL: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Variables de entorno inválidas:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
export const smtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.NOTIFY_EMAIL);
