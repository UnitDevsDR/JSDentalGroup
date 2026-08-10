import {
  Activity,
  AlignHorizontalDistributeCenter,
  Anchor,
  ArrowRight,
  Baby,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Anchor,
  Activity,
  AlignHorizontalDistributeCenter,
  ShieldCheck,
  Scissors,
  Stethoscope,
  Baby,
};

interface ServiceTile {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  /** URL de imagen optimizada (solo los tiles grandes la muestran) */
  imageSrc?: string;
}

interface Feature101Props {
  className?: string;
  heading: string;
  description: string;
  services: ServiceTile[];
}

/**
 * Bento de servicios: el primer y el último servicio ocupan tiles grandes con foto;
 * el resto son tiles de icono. Todos enlazan a su página /:slug.
 */
const Feature101 = ({ className, heading, description, services }: Feature101Props) => {
  const renderIcon = (name: string) => {
    const Icon = ICONS[name] ?? Sparkles;
    return <Icon className="mb-6 h-auto w-11 text-teal" strokeWidth={1.5} aria-hidden="true" />;
  };

  const [first, ...rest] = services;
  const last = rest.pop();

  return (
    <section className={cn("py-24 md:py-32", className)} id="servicios">
      <div className="container">
        <div className="mx-auto flex max-w-xl flex-col justify-center gap-4 text-center" data-animate="up">
          <h2 className="font-heading text-4xl font-bold text-navy md:text-5xl">{heading}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3" data-stagger>
          {first && (
            <a
              href={`/${first.slug}`}
              className="group flex flex-col justify-between gap-6 rounded-2xl bg-muted/70 p-8 transition-colors hover:bg-accent md:col-span-2 lg:row-span-2"
            >
              <div>
                {renderIcon(first.icon)}
                <h3 className="mb-1 font-heading text-2xl font-medium text-navy">{first.name}</h3>
                <p className="text-muted-foreground">{first.tagline}</p>
              </div>
              {first.imageSrc && (
                <img
                  src={first.imageSrc}
                  alt={first.name}
                  loading="lazy"
                  className="ml-auto max-h-80 w-full rounded-lg object-cover transition-transform duration-300 group-hover:-translate-y-3 sm:w-11/12"
                />
              )}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
                Ver tratamiento
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          )}

          {rest.map((s) => (
            <a
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex h-72 flex-col justify-between gap-4 rounded-2xl bg-muted/70 p-8 transition-colors hover:bg-accent"
            >
              {renderIcon(s.icon)}
              <div>
                <h3 className="mb-1 font-heading text-2xl font-medium text-navy">{s.name}</h3>
                <p className="text-muted-foreground">{s.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                  Ver tratamiento
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}

          {last && (
            <a
              href={`/${last.slug}`}
              className="group flex flex-col justify-between gap-6 rounded-2xl bg-navy p-8 text-white transition-colors hover:bg-navy/90 md:col-span-2"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex-1">
                  {renderIcon(last.icon)}
                  <h3 className="mb-1 font-heading text-2xl font-medium">{last.name}</h3>
                  <p className="text-white/70">{last.tagline}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                    Ver tratamiento
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
                {last.imageSrc && (
                  <img
                    src={last.imageSrc}
                    alt={last.name}
                    loading="lazy"
                    className="max-h-56 w-full rounded-lg object-cover transition-transform duration-300 group-hover:-translate-y-2 sm:w-1/2"
                  />
                )}
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature101 };
