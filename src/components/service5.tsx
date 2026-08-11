import { CalendarCheck, Clock, MessageCircle, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface Specialist {
  name: string;
  role: string;
  imageSrc: string;
}

interface RelatedService {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface Service5Props {
  heading: string;
  intro: string;
  body?: string;
  /** foto real del tratamiento (del sitio de la clínica) */
  photo?: { src: string; alt: string };
  specialist: Specialist;
  relatedServices: RelatedService[];
  className?: string;
}

const Service5 = ({
  heading,
  intro,
  body,
  photo,
  specialist,
  relatedServices,
  className,
}: Service5Props) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contenido principal */}
          <div className="lg:col-span-2" data-animate="up">
            <div className="mb-10 space-y-8">
              <div className="space-y-6">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-navy md:text-4xl">
                  {heading}
                </h2>
                <p className="text-xl leading-relaxed text-muted-foreground">{intro}</p>
              </div>
            </div>

            {photo && (
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={880}
                height={495}
                className="mb-8 aspect-video w-full rounded-2xl border object-cover"
              />
            )}

            <div className="max-w-none space-y-5 text-base leading-relaxed text-muted-foreground">
              {body && <p>{body}</p>}
              <p>
                Cada tratamiento comienza con una evaluación completa para entender tu caso y
                diseñar un plan personalizado. Trabajamos en equipo con las demás especialidades de
                la clínica, para que tu atención sea integral de principio a fin.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Agenda tu evaluación
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy/15 px-7 py-3.5 text-base font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                <Phone className="size-4" aria-hidden="true" />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-1" data-animate="up" data-delay="0.15">
            {/* Especialista a cargo */}
            <div className="rounded-lg bg-muted/50 p-6">
              <h3 className="mb-5 text-lg font-semibold text-navy">Especialista a cargo</h3>
              <div className="flex items-center gap-4">
                <img
                  src={specialist.imageSrc}
                  alt={specialist.name}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-16 w-16 rounded-full border-2 border-white object-cover object-top shadow"
                />
                <div>
                  <p className="font-heading font-semibold text-navy">{specialist.name}</p>
                  <p className="text-sm text-muted-foreground">{specialist.role}</p>
                </div>
              </div>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2 rounded-md bg-background p-3 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-white"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Agendar cita con el especialista
              </a>
            </div>

            {/* Horario */}
            <div className="rounded-lg bg-muted/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-navy">Horario de la clínica</h3>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <p>
                  {SITE.hours.weekdays}
                  <br />
                  {SITE.hours.saturday}
                </p>
              </div>
            </div>

            {/* Servicios relacionados */}
            <div className="rounded-lg bg-muted/50 p-6">
              <h3 className="mb-6 text-lg font-semibold text-navy">Servicios relacionados</h3>
              <div className="space-y-4">
                {relatedServices.map((service, index) => {
                  return (
                    <div key={index} className="group">
                      <a
                        href={service.link}
                        className="block space-y-1 rounded-md p-3 transition-colors hover:bg-background"
                      >
                        <div className="text-sm font-medium group-hover:text-teal">{service.title}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Service5 };
