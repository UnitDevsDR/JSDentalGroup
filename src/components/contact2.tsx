"use client";

import { CheckCircle2, Clock, MailIcon, MapPin, PhoneIcon } from "lucide-react";
import { useState } from "react";

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

const Contact2 = ({ title, description, copy, info, wa, className }: Contact2Props) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const texto = [
      wa.greeting.replace("{name}", String(data.get("nombre") ?? "")),
      data.get("telefono") ? wa.phone.replace("{phone}", String(data.get("telefono"))) : "",
      wa.subject.replace("{subject}", String(data.get("asunto") ?? "")),
      String(data.get("mensaje") ?? ""),
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${info.waNumber}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
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
                    d="M 3 1 C 42 9, 158 9, 197 1 C 179 25, 21 25, 3 1 Z"
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
                <Field>
                  <FieldLabel htmlFor="cf-nombre">{copy.fieldName} *</FieldLabel>
                  <Input id="cf-nombre" name="nombre" required autoComplete="name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cf-telefono">{copy.fieldPhone}</FieldLabel>
                  <Input id="cf-telefono" name="telefono" type="tel" autoComplete="tel" />
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
                {sent && (
                  <p className="flex items-center justify-center gap-2 text-sm font-medium text-teal-text" role="status">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {copy.sent}
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
