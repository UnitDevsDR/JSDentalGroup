import type { Prisma } from "./generated/prisma/index.js";
import { prisma } from "./prisma.js";

/**
 * Teléfono reducido a su forma comparable: solo dígitos y sin el 1 de país.
 * `809-555-0101`, `+1 809 555 0101` y `(809) 555 0101` son el mismo número,
 * y la gente los escribe de las tres maneras.
 *
 * Los números de otros países se guardan tal cual quedan tras quitar lo que
 * no es dígito: se comparan entre ellos sin problema y no vale la pena una
 * librería de E.164 para el puñado de pacientes de fuera.
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  // 1 + 10 dígitos: el 1 de Norteamérica, al que pertenece República
  // Dominicana (809, 829, 849)
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

/** El correo como llave de comparación. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

interface LeadIdentity {
  name: string;
  email: string;
  phone: string | null;
  locale: string;
}

/**
 * La persona detrás de un mensaje: la existente si ya escribió antes, una
 * nueva si es la primera vez.
 *
 * **Une solo por correo, nunca por teléfono.** El teléfono se guarda
 * normalizado y con índice, pero no une fichas por su cuenta: en una casa
 * se comparte el número, y unir a la mamá con el hijo dejaría el dolor de
 * muela de uno colgando de la ficha del otro. Separar a una persona en dos
 * fichas es molesto; mezclar a dos personas en una ficha con historial
 * clínico es un daño que después no se desenreda. El panel muestra los
 * contactos que comparten teléfono para que alguien decida a mano.
 *
 * A propósito tampoco hay índice único sobre el correo. Detectar duplicados
 * es una heurística —hay familias que comparten una cuenta— y un constraint
 * la convertiría en regla dura que tarde o temprano rechazaría un lead
 * legítimo. Perder un lead es lo peor que puede pasar en este sistema.
 */
export async function findOrCreateContact(
  tx: Prisma.TransactionClient,
  lead: LeadIdentity,
): Promise<string> {
  const email = normalizeEmail(lead.email);
  const phoneNormalized = normalizePhone(lead.phone);

  // la más vieja si por lo que sea hubiera dos: es la que ya tiene historial
  const existing = await tx.contact.findFirst({
    where: { email },
    orderBy: { createdAt: "asc" },
    select: { id: true, phone: true, phoneNormalized: true, email: true },
  });

  if (!existing) {
    const created = await tx.contact.create({
      data: { name: lead.name, email, phone: lead.phone, phoneNormalized, locale: lead.locale },
      select: { id: true },
    });
    return created.id;
  }

  // Completa lo que falte, sin pisar lo que ya está: si la ficha no tenía
  // teléfono y ahora lo dejó, se gana un dato; si tenía otro, el viejo se
  // respeta (cuál de los dos vale es criterio de la clínica, no del código).
  const faltantes: Prisma.ContactUpdateInput = {};
  if (!existing.phoneNormalized && phoneNormalized) {
    faltantes.phone = lead.phone;
    faltantes.phoneNormalized = phoneNormalized;
  }

  if (Object.keys(faltantes).length > 0) {
    await tx.contact.update({ where: { id: existing.id }, data: faltantes });
  }

  return existing.id;
}
