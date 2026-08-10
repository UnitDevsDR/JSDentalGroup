"use client";

import { CheckCircle2, Clock, MailIcon, MapPin, PhoneIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface Contact2Props {
  title?: string;
  description?: string;
  formHeading?: string;
  formSubheading?: string;
  className?: string;
}

const Contact2 = ({
  title = "¿Tienes dudas? Agenda tu consulta",
  description = "Nuestro equipo de especialistas está listo para resolver tus dudas y ayudarte a conseguir la mejor versión de tu sonrisa.",
  formHeading = "Envíanos un mensaje",
  formSubheading = "Al enviar se abre WhatsApp con tu mensaje listo para nuestro equipo.",
  className,
}: Contact2Props) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const texto = [
      `Hola, soy ${data.get("nombre")}.`,
      data.get("telefono") ? `Mi teléfono: ${data.get("telefono")}.` : "",
      `Asunto: ${data.get("asunto")}.`,
      `${data.get("mensaje")}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/${SITE.phone.replace("+", "")}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className={cn("py-24 md:py-32", className)} id="contacto">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-animate="left">
            <h2 className="mb-4 font-heading text-4xl font-bold text-navy md:text-5xl">{title}</h2>
            <p className="mb-8 text-lg text-muted-foreground">{description}</p>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <PhoneIcon className="size-4 text-teal" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Teléfono</p>
                  <a href={`tel:${SITE.phone}`} className="text-lg hover:text-teal">
                    {SITE.phoneDisplay}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Emergencias:{" "}
                    <a href={`tel:${SITE.emergencyPhone}`} className="text-terracotta hover:underline">
                      {SITE.emergencyPhoneDisplay}
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <MailIcon className="size-4 text-teal" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Correo</p>
                  <a href={`mailto:${SITE.email}`} className="text-lg break-all hover:text-teal">
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <MapPin className="size-4 text-teal" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Dirección</p>
                  <p className="text-lg">
                    {SITE.address.street}, {SITE.address.city}, R.D.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <Clock className="size-4 text-teal" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Horario</p>
                  <p className="text-lg">
                    {SITE.hours.weekdays}
                    <br />
                    {SITE.hours.saturday}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
                  <InstagramIcon className="size-4 text-teal" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Instagram</p>
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-teal"
                  >
                    @jsdentalgrouprd
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div data-animate="right" className="rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="font-heading text-2xl font-semibold text-navy">{formHeading}</h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">{formSubheading}</p>

            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="cf-nombre">Nombre completo *</FieldLabel>
                  <Input id="cf-nombre" name="nombre" required autoComplete="name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-telefono">Número de teléfono</FieldLabel>
                  <Input id="cf-telefono" name="telefono" type="tel" autoComplete="tel" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-asunto">Asunto *</FieldLabel>
                  <Input id="cf-asunto" name="asunto" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-mensaje">Tu pregunta *</FieldLabel>
                  <Textarea id="cf-mensaje" name="mensaje" rows={4} required />
                </Field>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-teal py-6 text-base font-semibold text-white shadow-lg shadow-teal/25 hover:bg-teal/90"
                >
                  Enviar por WhatsApp
                </Button>
                {sent && (
                  <p className="flex items-center justify-center gap-2 text-sm font-medium text-teal" role="status">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Mensaje preparado en WhatsApp: revisa la pestaña que se abrió.
                  </p>
                )}
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact2 };
