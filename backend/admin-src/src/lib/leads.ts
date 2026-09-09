/** Un mensaje del formulario, tal como aparece en la historia de una ficha.
 *  `status` sigue viniendo del backend pero el panel ya no lo usa: la etapa
 *  de la persona (Contact.stage) es la que manda. */
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

