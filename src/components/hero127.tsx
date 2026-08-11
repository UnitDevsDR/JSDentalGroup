import { ChevronRight, MapPin, MessageCircle, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps {
  text: string;
  url: string;
}
interface Buttons {
  primary?: ButtonProps;
  secondary?: ButtonProps;
}
interface BadgeProps {
  text: string;
  announcement?: string;
  /** versión corta del anuncio para pantallas pequeñas (evita el corte) */
  announcementShort?: string;
  url?: string;
}
interface AvatarItem {
  src: string;
  alt: string;
}
interface Stat {
  /** valor numérico para el contador GSAP (data-count) */
  count?: number;
  suffix?: string;
  /** texto fijo si no hay contador */
  value?: string;
  label: string;
}

interface Slide {
  src: string;
  /** etiqueta que aparece en el chip flotante mientras se muestra */
  name: string;
  role: string;
  alt: string;
  /** 'contain': recortes de figura completa (no se cortan los pies);
   *  'cover': retratos cuadrados que llenan el arco */
  fit?: 'contain' | 'cover';
}

interface Hero127Props {
  badge?: BadgeProps;
  /** palabras del titular; highlightWord se pinta en teal (.text-highlight) */
  headingWords: string[];
  highlightWord: string;
  description: string;
  buttons?: Buttons;
  avatars?: AvatarItem[];
  avatarsUrl?: string;
  /** texto del enlace de los avatares y contador del resto del equipo */
  avatarsLabel?: string;
  avatarsExtra?: string;
  stats?: Stat[];
  /** carrusel del arco: equipo + especialistas (rota solo, sin framework) */
  slides?: Slide[];
  className?: string;
}

function Avatars({ avatars, url, label, extra }: { avatars: AvatarItem[]; url?: string; label: string; extra: string }) {
  return (
    <a href={url ?? "#equipo"} className="group/avatars flex items-center gap-3" aria-label={label}>
      {avatars.map((item, i) => (
        <span
          key={`avatar-hero-${i}`}
          className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-accent shadow-sm sm:h-14 sm:w-14"
        >
          <img
            src={item.src}
            alt={item.alt}
            width={56}
            height={56}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </span>
      ))}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-navy text-sm font-semibold text-white shadow-sm sm:h-14 sm:w-14">
        {extra}
      </div>
      <span className="max-w-[130px] text-left text-sm leading-snug font-medium text-muted-foreground transition-colors group-hover/avatars:text-navy">
        {label}
      </span>
    </a>
  );
}

const Hero127 = ({
  badge,
  headingWords,
  highlightWord,
  description,
  buttons,
  avatars = [],
  avatarsUrl,
  avatarsLabel = '',
  avatarsExtra = '',
  stats = [],
  slides = [],
  className,
}: Hero127Props) => {
  return (
    <section className={cn("relative overflow-hidden py-12 md:py-20", className)} id="inicio">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-teal/8 blur-3xl"
          data-parallax="-0.15"
        />
        <div
          className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-terracotta/8 blur-3xl"
          data-parallax="0.1"
        />
        <div className="dot-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative container pt-16 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex w-full flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            {badge && (
              <Button
                asChild
                variant="ghost"
                className="flex h-auto w-fit gap-2 rounded-full border bg-card/70 p-1 pr-1 backdrop-blur hover:bg-transparent sm:gap-3 sm:pr-3"
                data-hero-in
              >
                <a href={badge.url ?? "#contacto"}>
                  <Badge className="flex items-center gap-[0.375rem] rounded-full bg-teal/10 px-3 py-1 text-navy hover:bg-teal/10">
                    <MapPin className="h-[0.875rem] w-[0.875rem] stroke-teal" aria-hidden="true" />
                    <span className="text-sm leading-normal font-medium">{badge.text}</span>
                  </Badge>
                  {badge.announcement && (
                    <span className="flex items-center gap-1.5 pr-1 text-xs leading-normal font-medium text-muted-foreground sm:gap-2 sm:pr-0 sm:text-sm">
                      <span className="sm:hidden">{badge.announcementShort ?? badge.announcement}</span>
                      <span className="hidden sm:inline">{badge.announcement}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 stroke-muted-foreground" aria-hidden="true" />
                    </span>
                  )}
                </a>
              </Button>
            )}

            <h1
              id="hero-headline"
              className="max-w-3xl font-heading text-5xl leading-[1.08] font-bold text-navy md:text-6xl lg:text-7xl lg:leading-[1.05]"
            >
              {headingWords.map((w) => (
                <span key={w} className="hero-word inline-block">
                  {w}&nbsp;
                </span>
              ))}
              <span className="hero-word text-highlight inline-block">{highlightWord}</span>
            </h1>

            <p data-hero-in style={{ "--hero-delay": "0.45s" } as React.CSSProperties} className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {description}
            </p>

            <div data-hero-in style={{ "--hero-delay": "0.6s" } as React.CSSProperties} className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-center lg:justify-start">
              {buttons?.primary && (
                <Button
                  asChild
                  className="flex h-fit w-full items-center justify-center gap-3 rounded-full bg-teal-strong px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-teal-strong/90 md:w-fit"
                >
                  <a href={buttons.primary.url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    <span>{buttons.primary.text}</span>
                  </a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  variant="outline"
                  className="flex h-fit w-full items-center justify-center gap-3 rounded-full border-2 border-navy/15 px-8 py-4 text-base font-semibold text-navy hover:border-teal hover:text-teal md:w-fit"
                >
                  <a href={buttons.secondary.url}>
                    <span>{buttons.secondary.text}</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>

            <div
              data-hero-in
              style={{ "--hero-delay": "0.75s" } as React.CSSProperties}
              className="flex flex-col items-center gap-8 md:flex-row md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-6 lg:justify-start"
            >
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:justify-start">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="font-heading text-3xl font-bold text-navy">
                      {stat.count != null ? (
                        <span data-count={stat.count} data-count-suffix={stat.suffix ?? ""}>
                          0
                        </span>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              {avatars.length > 0 && <Avatars avatars={avatars} url={avatarsUrl} label={avatarsLabel} extra={avatarsExtra} />}
            </div>
          </div>

          {slides.length > 0 && (
            <div className="order-first flex justify-center lg:order-none" data-hero-in="scale" style={{ "--hero-delay": "0.15s" } as React.CSSProperties}>
              <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[440px]">
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] border-8 border-white bg-accent shadow-2xl shadow-navy/15"
                  data-hero-carousel
                >
                  {slides.map((slide, i) => (
                    <img
                      key={slide.src}
                      // solo la primera carga de inmediato (LCP); el resto las
                      // pide el script tras cargar la página
                      src={i === 0 ? slide.src : undefined}
                      data-src={i === 0 ? undefined : slide.src}
                      alt={slide.alt}
                      width={560}
                      height={700}
                      fetchPriority={i === 0 ? "high" : undefined}
                      decoding={i === 0 ? "sync" : "async"}
                      data-hero-slide={i}
                      data-name={slide.name}
                      data-role={slide.role}
                      className={cn(
                        "absolute inset-0 h-full w-full transition-opacity duration-700 ease-out",
                        slide.fit === "contain"
                          ? "object-contain object-bottom pt-8"
                          : "object-cover object-top",
                        i === 0 ? "opacity-100" : "opacity-0",
                      )}
                    />
                  ))}
                </div>
                <svg
                  className="smile-arc pointer-events-none absolute -bottom-10 left-1/2 w-[116%] -translate-x-1/2"
                  viewBox="0 0 400 110"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Silueta de sonrisa: borde inferior profundo y superior
                      más plano, así el trazo engorda al centro y se afila en
                      los extremos (no un stroke de grosor constante). */}
                  <path
                    d="M 8 8 C 46 104, 354 104, 392 8 C 360 82, 300 92, 200 92 C 100 92, 40 82, 8 8 Z"
                    fill="oklch(0.71 0.09 187)"
                  />
                </svg>
                <div
                  className="absolute -left-6 top-10 hidden min-w-[190px] rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur sm:block"
                  data-parallax="-0.08"
                >
                  <p className="text-sm font-semibold text-navy" data-hero-name>
                    {slides[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-hero-role>
                    {slides[0].role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero127 };
