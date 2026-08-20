// Sesión del panel admin: JWT firmado (HS256) en una cookie httpOnly,
// secure, sameSite=strict. No hay localStorage ni Authorization header
// manual — así un XSS no puede robar el token leyéndolo por JS, y
// sameSite=strict ya bloquea que la cookie viaje en requests cross-site
// (primera línea de defensa contra CSRF).
import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";
import { env } from "./env.js";

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

  try {
    const { payload } = await jwtVerify(token, SECRET);
    req.adminId = String(payload.sub);
    next();
  } catch {
    clearSession(res);
    res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}
