/** Forma de un lead y su presentación, compartidas por la lista y el detalle. */
export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "CONTACTED" | "ARCHIVED";
  createdAt: string;
}

export const STATUS_LABEL: Record<Lead["status"], string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  ARCHIVED: "Archivado",
};

export const STATUS_VARIANT: Record<Lead["status"], "default" | "secondary" | "outline"> = {
  NEW: "default",
  CONTACTED: "secondary",
  ARCHIVED: "outline",
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" });

/** La fecha partida para la tabla: día y hora en dos líneas, cada una sin
 *  cortarse. Dejarla como una sola cadena hacía que la columna se partiera en
 *  cinco renglones ("22 / ago / 2026, / 8:37 a. / m.") al angostar la ventana. */
export const formatDateParts = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("es-DO", { dateStyle: "medium" }),
    time: d.toLocaleTimeString("es-DO", { timeStyle: "short" }),
  };
};
