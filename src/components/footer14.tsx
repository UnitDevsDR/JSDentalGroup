import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { InstagramIcon } from "@/components/ui/instagram-icon";
import { SITE, SERVICES } from "@/data/site";

interface Footer14Props {
  logoSrc: string;
}

const navigation = [
  {
    title: "Servicios",
    links: SERVICES.slice(0, 4).map((s) => ({ name: s.name, href: `/${s.slug}` })),
  },
  {
    title: "Más servicios",
    links: SERVICES.slice(4).map((s) => ({ name: s.name, href: `/${s.slug}` })),
  },
  {
    title: "Clínica",
    links: [
      { name: "Inicio", href: "/" },
      { name: "Sobre nosotros", href: "/about-us" },
      { name: "Contáctanos", href: "/contactus" },
      { name: "Términos y condiciones", href: "/terms" },
    ],
  },
];

export const Footer14 = ({ logoSrc }: Footer14Props) => {
  return (
    <footer className="bg-navy py-12 text-white sm:py-16 md:py-24">
      <div className="container mx-auto px-5 md:px-6">
        {/* Franja de contacto (réplica de la del sitio original) */}
        <div className="mb-12 grid gap-8 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Mail className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">Correo</p>
              <a href={`mailto:${SITE.email}`} className="font-semibold break-all hover:underline">
                {SITE.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <MapPin className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">Dirección</p>
              <p className="font-semibold">{SITE.address.street}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Clock className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">Horario de la Clínica</p>
              <p className="font-semibold">
                {SITE.hours.weekdays} y {SITE.hours.saturday}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-10 flex flex-col items-start justify-between gap-10 border-b border-white/15 pb-10 sm:mb-16 sm:pb-12 lg:flex-row">
          <div className="w-full max-w-full sm:max-w-sm">
            <a href="/" aria-label="JS Dental Group — Inicio">
              <img
                src={logoSrc}
                alt="JS Dental Group"
                className="mb-6 h-16 w-auto"
                width={130}
                height={64}
                loading="lazy"
              />
            </a>
            <p className="mb-8 text-base text-white/70">
              {SITE.legalName}. Atención odontológica integral, moderna y en
              equipo, en Santiago de los Caballeros desde {SITE.founded}.
            </p>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  {SITE.address.street}, {SITE.address.city}, R.D.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-teal" aria-hidden="true" />
                <a href={`tel:${SITE.phone}`} className="hover:text-white">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-terracotta" aria-hidden="true" />
                <a href={`tel:${SITE.emergencyPhone}`} className="hover:text-white">
                  Emergencias: {SITE.emergencyPhoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-teal" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  {SITE.hours.weekdays}
                  <br />
                  {SITE.hours.saturday}
                </span>
              </li>
            </ul>
          </div>

          <div className="w-full border-t border-white/15 pt-8 lg:border-t-0 lg:pt-0">
            <nav
              className="grid w-full grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 md:w-auto md:grid-cols-3"
              aria-label="Enlaces del pie de página"
            >
              {navigation.map((section) => (
                <div key={section.title} className="min-w-[140px]">
                  <h2 className="mb-4 text-lg font-semibold">{section.title}</h2>
                  <ul className="space-y-3.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="inline-block py-1 text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="order-1 mb-6 flex w-full items-center justify-center gap-6 sm:justify-start md:order-2 md:mb-0 md:w-auto">
            <a
              href={SITE.instagram}
              aria-label="Síguenos en Instagram"
              className="rounded-full p-3 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon className="h-6 w-6 sm:h-5 sm:w-5" />
            </a>
          </div>

          <p className="order-2 text-center text-sm text-white/60 sm:text-left md:order-1">
            © {new Date().getFullYear()} {SITE.name} · {SITE.legalName}. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
