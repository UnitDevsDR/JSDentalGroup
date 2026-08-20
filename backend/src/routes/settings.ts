import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { requireAuth } from "../auth.js";

export const settingsRouter = Router();

// Whitelist explícita: nunca se acepta una key arbitraria del panel, solo
// estas — así el endpoint no se puede usar para guardar cualquier cosa.
const PUBLIC_KEYS = ["gtmId", "gscVerification"] as const;
type PublicKey = (typeof PUBLIC_KEYS)[number];

/** Público: el sitio estático llama esto en el navegador para saber qué
 * GTM ID / token de Search Console usar, sin tener que rehacer el build
 * cada vez que cambian. Cacheable un rato corto: no es información
 * sensible y cambia con muy poca frecuencia. */
settingsRouter.get("/public", async (_req, res) => {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: [...PUBLIC_KEYS] } } });
  const out: Partial<Record<PublicKey, string>> = {};
  for (const row of rows) out[row.key as PublicKey] = row.value;

  res.set("Cache-Control", "public, max-age=300");
  res.json(out);
});

const updateSchema = z.object({ value: z.string().trim().max(500) });

/** Panel: cambiar un valor. Solo las keys de la whitelist. */
settingsRouter.put("/:key", requireAuth, async (req, res) => {
  const key = String(req.params.key);
  if (!PUBLIC_KEYS.includes(key as PublicKey)) {
    return res.status(404).json({ error: "Ajuste desconocido" });
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  const row = await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: parsed.data.value },
    update: { value: parsed.data.value },
  });
  res.json(row);
});

/** Panel: leer el valor actual de todos los ajustes conocidos (incluye
 * los que aún no se han definido, como cadena vacía). */
settingsRouter.get("/", requireAuth, async (_req, res) => {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: [...PUBLIC_KEYS] } } });
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  res.json(PUBLIC_KEYS.map((key) => ({ key, value: byKey.get(key) ?? "" })));
});
