import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ServiceTile {
  href: string;
  name: string;
  tagline: string;
  /** descripción corta: los tiles grandes del bento la muestran */
  copy?: string;
  /** icono 3D real de la especialidad */
  iconSrc?: string;
}

interface Feature101Props {
  className?: string;
  heading: string;
  description: string;
  services: ServiceTile[];
  /** texto del enlace de cada tarjeta */
  cta: string;
}

const Icon3d = ({ src, big = false }: { src?: string; big?: boolean }) => {
  if (!src) return null;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm",
        big ? "size-28 p-3" : "size-20 p-2.5",
      )}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={big ? 112 : 80}
        height={big ? 112 : 80}
        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
      />
    </span>
  );
};

/**
 * Bento de servicios con los iconos 3D reales de cada especialidad.
 * El primer y el último servicio ocupan tiles grandes con descripción.
 */
const Feature101 = ({ className, heading, description, services, cta }: Feature101Props) => {
  const [first, ...rest] = services;
  const last = rest.pop();

  return (
    <section className={cn("py-24 md:py-32", className)} id="servicios">
      <div className="container">
        <div className="mx-auto flex max-w-xl flex-col justify-center gap-4 text-center" data-animate="up">
          <h2 className="font-heading text-4xl font-bold text-navy md:text-5xl">{heading}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-stagger>
          {first && (
            <a
              href={first.href}
              className="group flex flex-col justify-between gap-8 rounded-2xl bg-muted/70 p-8 transition-colors hover:bg-accent md:col-span-2 lg:row-span-2"
            >
              <Icon3d src={first.iconSrc} big />
              <div>
                <p className="mb-3 text-sm font-semibold tracking-widest text-teal-text uppercase">{first.tagline}</p>
                <h3 className="mb-4 font-heading text-3xl font-semibold text-navy md:text-4xl">{first.name}</h3>
                {first.copy && <p className="max-w-md text-lg leading-relaxed text-muted-foreground">{first.copy}</p>}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-text">
                {cta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          )}

          {rest.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="group flex flex-col gap-6 rounded-2xl bg-muted/70 p-8 transition-colors hover:bg-accent md:h-80 md:justify-between md:gap-4"
            >
              <Icon3d src={s.iconSrc} />
              <div>
                <h3 className="mb-2 font-heading text-2xl font-medium text-navy">{s.name}</h3>
                <p className="text-muted-foreground">{s.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-text">
                  {cta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}

          {last && (
            <a
              href={last.href}
              className="group flex flex-col justify-between gap-6 rounded-2xl bg-navy p-8 text-white transition-colors hover:bg-navy/90 md:col-span-2"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Icon3d src={last.iconSrc} big />
                <div className="flex-1">
                  <p className="mb-3 text-sm font-semibold tracking-widest text-teal uppercase">{last.tagline}</p>
                  <h3 className="mb-2 font-heading text-3xl font-semibold">{last.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                    {cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
                {last.copy && <p className="max-w-sm leading-relaxed text-white/75 sm:w-2/5">{last.copy}</p>}
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature101 };
