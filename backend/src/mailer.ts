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
}

/** Envía el aviso de un lead nuevo. Si SMTP no está configurado, no hace
 * nada (el lead ya quedó guardado en la base de datos de todos modos) —
 * nunca lanza, para no romper la respuesta del endpoint por un problema
 * de correo. */
export async function notifyNewLead(lead: LeadNotification) {
  if (!transporter) return;

  const html = `
    <h2>Nuevo mensaje desde jsdentalgroup.com</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(lead.phone ?? "—")}</p>
    <p><strong>Correo:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(lead.subject)}</p>
    <p><strong>Mensaje:</strong><br>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>
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
