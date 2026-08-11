import { MessageCircle, Phone } from "lucide-react";

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

interface Specialist {
  name: string;
  role: string;
  imageSrc: string;
}

interface SpecialistCardCopy {
  eyebrow: string;
  cta: string;
  ctaHref: string;
}

interface Hero86Props {
  /** parte del titular antes de la palabra enfatizada */
  headingBefore: string;
  /** palabra/frase enfatizada (subrayado teal) */
  headingEmphasis: string;
  headingAfter?: string;
  tagline: string;
  description: string;
  buttons?: Buttons;
  specialist: Specialist;
  card: SpecialistCardCopy;
  className?: string;
}

const Hero86 = ({
  headingBefore,
  headingEmphasis,
  headingAfter = "",
  tagline,
  description,
  buttons,
  specialist,
  card,
  className,
}: Hero86Props) => {
  return (
    <section className={cn("pb-16", className)}>
      <div className="bg-accent/60 pt-10 lg:pt-16">
        <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="relative flex flex-col items-center gap-6 pb-10 text-center lg:w-1/2 lg:items-start lg:pb-24 lg:text-left">
            <p data-animate="up" className="text-sm font-semibold tracking-widest text-teal-text uppercase">
              {tagline}
            </p>
            <h1
              data-animate="blur"
              className="font-heading text-4xl leading-tight font-bold tracking-tight text-pretty text-navy md:text-5xl lg:text-6xl"
            >
              {headingBefore}{" "}
              <span className="border-b-4 border-teal">{headingEmphasis}</span>
              {headingAfter}
            </h1>
            <p data-animate="up" data-delay="0.2" className="max-w-xl text-lg text-balance text-muted-foreground">
              {description}
            </p>
            <div data-animate="up" data-delay="0.3" className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-teal-strong px-8 py-6 text-base font-semibold text-white shadow-lg shadow-teal/25 hover:bg-teal-strong/90 sm:w-auto"
                >
                  <a href={buttons.primary.url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-5" aria-hidden="true" />
                    {buttons.primary.text}
                  </a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-2 border-navy/15 bg-transparent px-8 py-6 text-base font-semibold text-navy hover:border-teal hover:bg-transparent hover:text-teal sm:w-auto"
                >
                  <a href={buttons.secondary.url}>
                    <Phone className="size-4" aria-hidden="true" />
                    {buttons.secondary.text}
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="relative flex w-full justify-center pb-14 lg:w-1/2 lg:pb-10">
            <div className="relative z-10 h-auto w-4/5 max-w-sm lg:w-full lg:max-w-md" data-animate="scale">
              <img
                src={specialist.imageSrc}
                alt={`${specialist.name} — ${specialist.role}, JS Dental Group`}
                width={800}
                height={1000}
                fetchPriority="high"
                className="aspect-3/4 w-full rounded-3xl border-4 border-white object-cover object-top shadow-2xl shadow-navy/20"
              />
              <div className="absolute inset-x-5 -bottom-12 z-20 rounded-2xl border bg-white px-6 py-4 shadow-xl shadow-navy/10 lg:-bottom-8">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-teal uppercase">
                  {card.eyebrow}
                </p>
                <p className="mt-1.5 font-heading text-xl leading-tight font-semibold text-navy">
                  {specialist.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{specialist.role}</p>
                <a
                  href={card.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center gap-1.5 border-t py-3 text-sm font-semibold text-teal-text hover:underline"
                >
                  {card.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 w-full overflow-hidden" aria-hidden="true">
              <div className="relative aspect-2/1">
                <div className="absolute aspect-square w-full rounded-full bg-teal/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero86 };
