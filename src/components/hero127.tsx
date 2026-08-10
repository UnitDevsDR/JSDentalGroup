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

interface Hero127Props {
  badge?: BadgeProps;
  /** palabras del titular; highlightWord se pinta con .text-gradient */
  headingWords: string[];
  highlightWord: string;
  description: string;
  buttons?: Buttons;
  avatars?: AvatarItem[];
  avatarsUrl?: string;
  stats?: Stat[];
  /** foto principal (arco firma) */
  image?: { src: string; alt: string };
  className?: string;
}

function Avatars({ avatars, url }: { avatars: AvatarItem[]; url?: string }) {
  return (
    <a href={url ?? "#equipo"} className="flex items-center gap-2" aria-label="Conoce a nuestros especialistas">
      {avatars.map((item, i) => (
        <span
          key={`avatar-hero-${i}`}
          className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full border bg-accent before:absolute before:top-1/2 before:left-1/2 before:z-10 before:block before:h-[85%] before:w-[85%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border-2 before:border-white before:bg-transparent before:content-['']"
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
      <div className="relative flex h-14 w-14 overflow-hidden rounded-full bg-navy before:absolute before:top-1/2 before:left-1/2 before:block before:h-[85%] before:w-[85%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border-2 before:border-white before:bg-transparent before:content-['']">
        <Plus className="m-auto h-4 w-4 stroke-white" aria-hidden="true" />
      </div>
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
  stats = [],
  image,
  className,
}: Hero127Props) => {
  return (
    <section className={cn("relative overflow-hidden py-12 md:py-20", className)} id="inicio">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal/10 to-navy/5 blur-3xl"
          data-parallax="-0.15"
        />
        <div
          className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-terracotta/10 to-teal/5 blur-3xl"
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
                className="flex w-fit gap-3 rounded-full border bg-card/70 p-1 pr-3 backdrop-blur hover:bg-transparent"
                data-animate="up"
              >
                <a href={badge.url ?? "#contacto"}>
                  <Badge className="flex items-center gap-[0.375rem] rounded-full bg-teal/10 px-3 py-1 text-navy hover:bg-teal/10">
                    <MapPin className="h-[0.875rem] w-[0.875rem] stroke-teal" aria-hidden="true" />
                    <span className="text-sm leading-normal font-medium">{badge.text}</span>
                  </Badge>
                  {badge.announcement && (
                    <span className="hidden items-center gap-2 text-sm leading-normal font-medium text-muted-foreground sm:flex">
                      {badge.announcement}
                      <ChevronRight className="h-4 w-4 stroke-muted-foreground" aria-hidden="true" />
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
              <span className="hero-word text-gradient inline-block">{highlightWord}</span>
            </h1>

            <p data-animate="up" data-delay="0.45" className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {description}
            </p>

            <div data-animate="up" data-delay="0.6" className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-center lg:justify-start">
              {buttons?.primary && (
                <Button
                  asChild
                  className="flex h-fit w-full items-center justify-center gap-3 rounded-full bg-teal px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-teal/90 md:w-fit"
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
              data-animate="up"
              data-delay="0.75"
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
              {avatars.length > 0 && <Avatars avatars={avatars} url={avatarsUrl} />}
            </div>
          </div>

          {image && (
            <div className="order-first flex justify-center lg:order-none" data-animate="scale" data-delay="0.3">
              <div className="relative w-[300px] sm:w-[380px] lg:w-[440px]">
                <div className="overflow-hidden rounded-t-full rounded-b-[2.5rem] border-8 border-white shadow-2xl shadow-navy/15">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={880}
                    height={1100}
                    fetchPriority="high"
                    className="aspect-[4/5] h-auto w-full object-cover"
                  />
                </div>
                <svg
                  className="smile-arc pointer-events-none absolute -bottom-10 left-1/2 w-[120%] -translate-x-1/2"
                  viewBox="0 0 400 120"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 20 C 110 130, 290 130, 380 20"
                    stroke="oklch(0.71 0.09 187)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={1}
                  />
                </svg>
                <div
                  className="absolute -left-6 top-10 hidden rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur sm:block"
                  data-parallax="-0.08"
                >
                  <p className="text-sm font-semibold text-navy">Sonríe con confianza</p>
                  <p className="text-xs text-muted-foreground">Atención para toda la familia</p>
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
