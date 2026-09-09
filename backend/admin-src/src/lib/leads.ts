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
  /** ruta de la página desde la que se envió el formulario */
  source: string;
  locale: string;
  /** origen de la visita (null en los leads anteriores a que se midiera) */
  landingPath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
}

/** De dónde vino este lead, en filas de etiqueta y valor para el detalle.
 *  Vacío si no hay nada que mostrar — los leads guardados antes de que esto
 *  se midiera no tienen ningún dato de origen y no vale la pena enseñar una
 *  sección con guiones. */
export function originRows(lead: Lead): { label: string; value: string }[] {
  const campaign = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" · ");
  const extra = [lead.utmTerm, lead.utmContent].filter(Boolean).join(" · ");
  // el click id importa por su presencia, no por su valor: dice que el lead
  // vino de un anuncio aunque la URL no llevara utm
  const ads = lead.gclid ? "Google Ads" : lead.fbclid ? "Meta Ads" : null;

  return [
    { label: "Campaña", value: campaign },
    { label: "Detalle de campaña", value: extra },
    { label: "Anuncio", value: ads ?? "" },
    { label: "Entró por", value: lead.landingPath ?? "" },
    { label: "Referente", value: lead.referrer ?? "" },
    // solo cuando aporta algo: los leads viejos traen "contactus" en vez de
    // una ruta, y repetir la página de entrada no dice nada nuevo
    {
      label: "Escribió desde",
      value: lead.source.startsWith("/") && lead.source !== lead.landingPath ? lead.source : "",
    },
  ].filter((row) => row.value);
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
