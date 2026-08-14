import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { InstagramIcon } from "@/components/ui/instagram-icon";

interface LinkItem {
  name: string;
  href: string;
}

interface Footer14Props {
  logoSrc: string;
  homeHref: string;
  tagline: string;
  /** columnas de enlaces, ya traducidas y con las rutas del idioma */
  navigation: { title: string; links: LinkItem[] }[];
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
  };
  copy: {
    labelEmail: string;
    labelAddress: string;
    hoursLabel: string;
    labelEmergency: string;
    instagramAria: string;
    linksAria: string;
    homeAria: string;
    rights: string;
    madeBy: string;
  };
  year: number;
  siteName: string;
  legalName: string;
}

export const Footer14 = ({
  logoSrc,
  homeHref,
  tagline,
  navigation,
  info,
  copy,
  year,
  siteName,
  legalName,
}: Footer14Props) => {
  return (
    <footer className="bg-navy pt-12 pb-6 text-white sm:pt-14 md:pt-16 md:pb-7">
      <div className="container mx-auto px-5 md:px-6">
        {/* Franja de contacto (réplica de la del sitio original) */}
        <div className="mb-8 grid gap-6 border-b border-white/15 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Mail className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">{copy.labelEmail}</p>
              <a href={`mailto:${info.email}`} className="font-semibold break-all hover:underline">
                {info.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <MapPin className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">{copy.labelAddress}</p>
              <p className="font-semibold">{info.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Clock className="size-5 text-navy" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/70">{copy.hoursLabel}</p>
              <p className="font-semibold">
                {info.hoursWeekdays} · {info.hoursSaturday}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-8 border-b border-white/15 pb-8 lg:flex-row">
          <div className="w-full max-w-full sm:max-w-sm">
            <a href={homeHref} aria-label={copy.homeAria}>
              <img
                src={logoSrc}
                alt={siteName}
                className="mb-6 h-16 w-auto"
                width={130}
                height={64}
                loading="lazy"
              />
            </a>
            <p className="mb-8 text-base text-white/70">{tagline}</p>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <span>{info.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-teal" aria-hidden="true" />
                <a href={`tel:${info.phone}`} className="hover:text-white">
                  {info.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-terracotta" aria-hidden="true" />
                <a href={`tel:${info.emergencyPhone}`} className="hover:text-white">
                  {copy.labelEmergency}: {info.emergencyPhoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-teal" aria-hidden="true" />
                <a href={`mailto:${info.email}`} className="hover:text-white">
                  {info.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  {info.hoursWeekdays}
                  <br />
                  {info.hoursSaturday}
                </span>
              </li>
            </ul>
          </div>

          <div className="w-full border-t border-white/15 pt-8 lg:border-t-0 lg:pt-0">
            <nav
              className="grid w-full grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 md:w-auto md:grid-cols-3"
              aria-label={copy.linksAria}
            >
              {navigation.map((section) => (
                <div key={section.title} className="min-w-[140px]">
                  <h2 className="mb-4 text-lg font-semibold">{section.title}</h2>
                  <ul className="space-y-3.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
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

        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="order-1 flex w-full items-center justify-center gap-6 sm:justify-start md:order-2 md:w-auto">
            <a
              href={info.instagram}
              aria-label={copy.instagramAria}
              className="rounded-full p-2 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon className="h-6 w-6 sm:h-5 sm:w-5" />
            </a>
          </div>

          <p className="order-2 text-center text-sm text-white/60 sm:text-left md:order-1">
            © {year} {siteName} · {legalName}. {copy.rights}{' '}
            <span className="whitespace-nowrap">
              {copy.madeBy}{' '}
              <a
                href="http://thinkpixelrd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                Think Pixel
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
