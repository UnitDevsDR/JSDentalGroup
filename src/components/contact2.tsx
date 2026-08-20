"use client";

import { Clock, MailIcon, MapPin, PhoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { cn } from "@/lib/utils";

/** Datos de contacto y textos ya traducidos (serializable para la isla). */
interface Contact2Props {
  title: string;
  description: string;
  copy: {
    formHeading: string;
    formNote: string;
    fieldName: string;
    fieldPhone: string;
    fieldEmail: string;
    fieldSubject: string;
    fieldMessage: string;
    submit: string;
    sent: string;
    labelPhone: string;
    labelEmergency: string;
    labelEmail: string;
    labelAddress: string;
    labelHours: string;
    labelInstagram: string;
  };
  /** URL base del backend de leads (vacía = el envío solo abre WhatsApp, sin guardar nada) */
  apiUrl?: string;
  /** a dónde navegar tras enviar (misma URL que medía conversión en el sitio anterior) */
  successPath: string;
  info: {
    phone: string;
    phoneDisplay: string;
    emergencyPhone: string;
    emergencyPhoneDisplay: string;
    email: string;
    address: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    instagram: string;
    instagramUser: string;
    /** número de WhatsApp en formato wa.me */
    waNumber: string;
  };
  /** prefijos del mensaje de WhatsApp, ya en el idioma de la página */
  wa: { greeting: string; phone: string; subject: string };
  className?: string;
}

const Contact2 = ({ title, description, copy, info, wa, apiUrl, successPath, className }: Contact2Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: campo real pero oculto por CSS, ningún visitante humano lo
    // ve ni lo llena. Los bots de envío masivo suelen rellenar todo lo que
    // encuentran en el DOM — si esto viene con contenido, se descarta en
    // silencio (nunca se le dice al bot que falló, para no darle pistas).
    if (data.get("empresa")) return;

    const nombre = String(data.get("nombre") ?? "");
    const telefono = String(data.get("telefono") ?? "");
    const correo = String(data.get("correo") ?? "");
    const asunto = String(data.get("asunto") ?? "");
    const mensaje = String(data.get("mensaje") ?? "");

    // Guarda el lead en el backend (si está configurado). No bloquea nada:
    // si el backend está caído o tarda, el visitante igual llega a WhatsApp
    // y a la página de confirmación — nunca se pierde el contacto por eso.
    // keepalive:true es imprescindible aquí: justo abajo se navega a
    // successPath, y sin esa opción el navegador cancela cualquier fetch en
    // curso al abandonar la página — el lead se perdía en silencio incluso
    // con el backend funcionando perfecto (confirmado: un POST idéntico sin
    // navegar después sí llegaba, el mismo POST seguido de la navegación no).
    if (apiUrl) {
      fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nombre, phone: telefono, email: correo, subject: asunto, message: mensaje }),
        keepalive: true,
      }).catch(() => {
        // silencioso a propósito: el usuario no debe ver un error de red
        // ajeno a su envío real (WhatsApp + página de confirmación)
      });
    }

    const texto = [
      wa.greeting.replace("{name}", nombre),
      telefono ? wa.phone.replace("{phone}", telefono) : "",
      wa.subject.replace("{subject}", asunto),
      mensaje,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${info.waNumber}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    // misma URL de conversión que usaba el sitio anterior: sus campañas de
    // Google Ads siguen midiendo sin que nadie tenga que tocar la cuenta
    window.location.assign(successPath);
  };

  const words = title.split(" ");
  const lastWord = words.pop();

  const Item = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
    <li className="flex items-start gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        {children}
      </div>
    </li>
  );

  return (
    <section className={cn("py-24 md:py-32", className)} id="contacto">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-4 font-heading text-4xl font-bold text-navy md:text-5xl">
              {words.join(" ")}{" "}
              <span className="relative inline-block">
                {lastWord}
                {/* arco de sonrisa bajo la última palabra (firma visual) */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 26"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 11.6 2.0 C 59.6 15.3, 140.4 15.3, 188.4 2.0 A 2.8 1 0 0 1 192 3.3 C 144.8 21.1, 55.2 21.1, 8 3.3 A 2.8 1 0 0 1 11.6 2.0 Z"
                    fill="oklch(0.71 0.09 187)"
                  />
                </svg>
              </span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">{description}</p>

            <ul className="space-y-5">
              <Item icon={<PhoneIcon className="size-4 text-teal" aria-hidden="true" />} label={copy.labelPhone}>
                <a href={`tel:${info.phone}`} className="inline-block py-1.5 text-lg hover:text-teal">
                  {info.phoneDisplay}
                </a>
                <p className="text-sm text-muted-foreground">
                  {copy.labelEmergency}:{" "}
                  <a
                    href={`tel:${info.emergencyPhone}`}
                    className="inline-block py-2.5 font-medium text-terracotta hover:underline"
                  >
                    {info.emergencyPhoneDisplay}
                  </a>
                </p>
              </Item>
              <Item icon={<MailIcon className="size-4 text-teal" aria-hidden="true" />} label={copy.labelEmail}>
                <a href={`mailto:${info.email}`} className="inline-block py-1.5 text-lg break-all hover:text-teal">
                  {info.email}
                </a>
              </Item>
              <Item icon={<MapPin className="size-4 text-teal" aria-hidden="true" />} label={copy.labelAddress}>
                <p className="text-lg">{info.address}</p>
              </Item>
              <Item icon={<Clock className="size-4 text-teal" aria-hidden="true" />} label={copy.labelHours}>
                <p className="text-lg">
                  {info.hoursWeekdays}
                  <br />
                  {info.hoursSaturday}
                </p>
              </Item>
              <Item icon={<InstagramIcon className="size-4 text-teal" />} label={copy.labelInstagram}>
                <a
                  href={info.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 text-lg hover:text-teal"
                >
                  @{info.instagramUser}
                </a>
              </Item>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="font-heading text-2xl font-semibold text-navy">{copy.formHeading}</h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">{copy.formNote}</p>

            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-5">
                {/* Honeypot: invisible para personas (fuera de pantalla, sin
                    tabindex, sin autocomplete), visible en el DOM para bots */}
                <input
                  type="text"
                  name="empresa"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <Field>
                  <FieldLabel htmlFor="cf-nombre">{copy.fieldName} *</FieldLabel>
                  <Input id="cf-nombre" name="nombre" required autoComplete="name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-telefono">{copy.fieldPhone}</FieldLabel>
                  <Input id="cf-telefono" name="telefono" type="tel" autoComplete="tel" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-correo">{copy.fieldEmail} *</FieldLabel>
                  <Input id="cf-correo" name="correo" type="email" required autoComplete="email" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-asunto">{copy.fieldSubject} *</FieldLabel>
                  <Input id="cf-asunto" name="asunto" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-mensaje">{copy.fieldMessage} *</FieldLabel>
                  <Textarea id="cf-mensaje" name="mensaje" rows={4} required />
                </Field>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-teal-strong py-6 text-base font-semibold text-white shadow-lg shadow-teal/25 hover:bg-teal-strong/90"
                >
                  {copy.submit}
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact2 };
