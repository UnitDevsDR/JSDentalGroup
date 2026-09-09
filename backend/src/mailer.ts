import nodemailer from "nodemailer";
import { env, smtpConfigured } from "./env.js";

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

interface LeadNotification {
  name: string;
  phone: string | null;
  email: string;
  subject: string;
  message: string;
  /** ruta de la página desde la que escribió */
  source?: string;
  /** primera página de la sesión (la del anuncio, si llegó por uno) */
  landingPath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
}

/** Resumen legible del origen, para la línea final del correo: "Google Ads ·
 *  campaña verano-implantes · entró por /es/implantes". Quien contesta no
 *  abre el panel para responder un WhatsApp, así que el dato tiene que
 *  viajar con el aviso o no se usa. */
function originSummary(lead: LeadNotification): string | null {
  const campaign = [
    lead.utmSource && lead.utmMedium ? `${lead.utmSource} / ${lead.utmMedium}` : lead.utmSource,
    lead.utmCampaign && `campaña ${lead.utmCampaign}`,
    // sin utm pero con click id: el anuncio venía sin etiquetar
    !lead.utmSource && (lead.gclid ? "Google Ads" : lead.fbclid ? "Meta Ads" : null),
    !lead.utmSource && !lead.gclid && !lead.fbclid && lead.referrer,
  ].filter(Boolean);

  const pages = [
    lead.landingPath && `entró por ${lead.landingPath}`,
    lead.source && lead.source !== lead.landingPath && `escribió desde ${lead.source}`,
  ].filter(Boolean);

  const parts = [...campaign, ...pages];
  return parts.length ? parts.join(" · ") : null;
}

/** Envía el aviso de un lead nuevo. Si SMTP no está configurado, no hace
 * nada (el lead ya quedó guardado en la base de datos de todos modos) —
 * nunca lanza, para no romper la respuesta del endpoint por un problema
 * de correo. */
export async function notifyNewLead(lead: LeadNotification) {
  if (!transporter) return;

  const origin = originSummary(lead);

  const html = `
    <h2>Nuevo mensaje desde jsdentalgroup.com</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(lead.phone ?? "—")}</p>
    <p><strong>Correo:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(lead.subject)}</p>
    <p><strong>Mensaje:</strong><br>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>
    ${origin ? `<p style="color:#666"><strong>Origen:</strong> ${escapeHtml(origin)}</p>` : ""}
  `;

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM ?? env.SMTP_USER,
      to: env.NOTIFY_EMAIL,
      replyTo: lead.email,
      subject: `Nuevo mensaje de ${lead.name} — JS Dental Group`,
      html,
    });
  } catch (err) {
    // el correo es una conveniencia, no la fuente de verdad (esa es la BD):
    // se registra el error pero no se propaga
    console.error("No se pudo enviar la notificación por correo:", err);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
