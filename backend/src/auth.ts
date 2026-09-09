// Sesión del panel admin: JWT firmado (HS256) en una cookie httpOnly,
// secure, sameSite=strict. No hay localStorage ni Authorization header
// manual — así un XSS no puede robar el token leyéndolo por JS, y
// sameSite=strict ya bloquea que la cookie viaje en requests cross-site
// (primera línea de defensa contra CSRF).
import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";
import { env } from "./env.js";
import { prisma } from "./prisma.js";

const SECRET = new TextEncoder().encode(env.SESSION_SECRET);
const COOKIE_NAME = "jsd_session";
const SESSION_TTL = "8h";

export const hashPassword = (plain: string) => argon2.hash(plain, { type: argon2.argon2id });
export const verifyPassword = (hash: string, plain: string) => argon2.verify(hash, plain).catch(() => false);

export async function issueSession(res: Response, adminId: string) {
  const token = await new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(SECRET);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "strict", path: "/" });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminId?: string;
      /** el usuario de la sesión, ya comprobado contra la base */
      admin?: { id: string; email: string; role: "ADMIN" | "STAFF" };
    }
  }
}

/** Exige sesión válida; además, para métodos que cambian estado, exige un
 * header que solo JavaScript del mismo origen puede fijar (un <form> HTML
 * de un sitio ajeno no puede añadir headers custom) — segunda barrera
 * contra CSRF además de sameSite=strict. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "No autenticado" });

  if (req.method !== "GET" && req.header("X-Requested-With") !== "fetch") {
    return res.status(403).json({ error: "Falta encabezado requerido" });
  }

  let adminId: string;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    adminId = String(payload.sub);
  } catch {
    clearSession(res);
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }

  // La cuenta se comprueba contra la base en cada request, no solo se
  // confía en el token: la sesión dura 8 horas, así que si no, a quien se
  // le quita el acceso hoy le seguiría sirviendo la cookie hasta mañana.
  // Es una consulta más en un panel que usan tres personas.
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, role: true },
  });

  if (!admin) {
    clearSession(res);
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }

  req.adminId = admin.id;
  req.admin = admin;
  next();
}

/** Exige además que sea administrador. Va siempre después de `requireAuth`,
 * que es quien ya trajo el usuario de la base. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.admin) return res.status(401).json({ error: "No autenticado" });
  if (req.admin.role !== "ADMIN") {
    return res.status(403).json({ error: "Hace falta ser administrador" });
  }
  next();
}
