/** La persona y su ficha, tal como las devuelve el backend. */

export type ContactStage =
  | "NEW"
  | "CONTACTED"
  | "APPOINTMENT_SET"
  | "ATTENDED"
  | "TREATMENT_ACCEPTED"
  | "LOST"
  | "ARCHIVED";

export type LossReason = "PRICE" | "SCHEDULE" | "LOCATION" | "NO_ANSWER" | "OTHER";

export type InteractionChannel = "CALL" | "WHATSAPP" | "EMAIL" | "IN_PERSON" | "NOTE";

export interface Colega {
  id: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  phoneNormalized: string | null;
  locale: string;
  stage: ContactStage;
  lossReason: LossReason | null;
  lossNote: string | null;
  ownerId: string | null;
  owner: Colega | null;
  nextFollowUpAt: string | null;
  firstSeenAt: string;
  lastActivityAt: string;
}

/** Fila de la lista: la persona más lo justo para decidir si abrirla. */
export interface ContactRow extends Contact {
  _count: { leads: number; interactions: number };
  leads: { subject: string; createdAt: string }[];
}

export interface Interaction {
  id: string;
  channel: InteractionChannel;
  body: string;
  occurredAt: string;
  createdAt: string;
  authorId: string | null;
  author: Colega | null;
}

/** El orden de las etapas es el del embudo: sirve para el desplegable y
 *  para pintar el avance. LOST y ARCHIVED van al final porque son salidas,
 *  no pasos. */
export const STAGES: ContactStage[] = [
  "NEW",
  "CONTACTED",
  "APPOINTMENT_SET",
  "ATTENDED",
  "TREATMENT_ACCEPTED",
  "LOST",
  "ARCHIVED",
];

export const STAGE_LABEL: Record<ContactStage, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  APPOINTMENT_SET: "Cita agendada",
  ATTENDED: "Asistió",
  TREATMENT_ACCEPTED: "Tratamiento aceptado",
  LOST: "Perdido",
  ARCHIVED: "Archivado",
};

/** Un color por etapa, no uno por variante genérica: en una lista larga el
 *  color es lo que deja ver de un vistazo dónde está cada quien. */
export const STAGE_CLASS: Record<ContactStage, string> = {
  NEW: "bg-teal/15 text-teal-text",
  CONTACTED: "bg-navy/10 text-navy",
  APPOINTMENT_SET: "bg-amber-100 text-amber-900",
  ATTENDED: "bg-sky-100 text-sky-900",
  TREATMENT_ACCEPTED: "bg-emerald-100 text-emerald-900",
  LOST: "bg-destructive/10 text-destructive",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export const LOSS_REASONS: LossReason[] = ["PRICE", "SCHEDULE", "LOCATION", "NO_ANSWER", "OTHER"];

export const LOSS_LABEL: Record<LossReason, string> = {
  PRICE: "Precio",
  SCHEDULE: "Horario",
  LOCATION: "Ubicación",
  NO_ANSWER: "No contesta",
  OTHER: "Otro",
};

export const CHANNELS: InteractionChannel[] = ["CALL", "WHATSAPP", "EMAIL", "IN_PERSON", "NOTE"];

export const CHANNEL_LABEL: Record<InteractionChannel, string> = {
  CALL: "Llamada",
  WHATSAPP: "WhatsApp",
  EMAIL: "Correo",
  IN_PERSON: "En persona",
  NOTE: "Nota",
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" });

export const formatDay = (iso: string) => new Date(iso).toLocaleDateString("es-DO", { dateStyle: "medium" });

/** «hace 3 días», que es como se lee una bandeja: lo que importa no es la
 *  fecha exacta sino cuánto lleva esperando. */
export function hace(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const dias = Math.floor(ms / 86_400_000);
  if (dias > 30) return formatDay(iso);
  if (dias >= 1) return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
  const horas = Math.floor(ms / 3_600_000);
  if (horas >= 1) return `hace ${horas} h`;
  const min = Math.floor(ms / 60_000);
  return min >= 1 ? `hace ${min} min` : "ahora mismo";
}

/** Un seguimiento con fecha pasada es el que hay que atender hoy. */
export const estaVencido = (contact: { nextFollowUpAt: string | null }) =>
  contact.nextFollowUpAt !== null && new Date(contact.nextFollowUpAt) <= new Date();

/** `<input type="date">` habla en YYYY-MM-DD y el backend en ISO. */
export const aValorDeInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
export const aISODesdeInput = (valor: string) => (valor ? new Date(`${valor}T12:00:00`).toISOString() : null);
