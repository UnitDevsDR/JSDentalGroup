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
  className,
}: Hero86Props) => {
  return (
    <section className={cn("pb-16", className)}>
      <div className="bg-accent/60 pt-10 lg:pt-16">
        <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="relative flex flex-col items-center gap-6 pb-10 text-center lg:w-1/2 lg:items-start lg:pb-24 lg:text-left">
            <p data-animate="up" className="text-sm font-semibold tracking-widest text-teal uppercase">
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
                  className="w-full rounded-full bg-teal px-8 py-6 text-base font-semibold text-white shadow-lg shadow-teal/25 hover:bg-teal/90 sm:w-auto"
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

          <div className="relative flex w-full justify-center lg:w-1/2">
            <div className="relative z-10 -mb-10 h-auto w-4/5 max-w-sm lg:mb-0 lg:w-full lg:max-w-md" data-animate="scale">
              <img
                src={specialist.imageSrc}
                alt={`${specialist.name} — ${specialist.role} en JS Dental Group`}
                width={800}
                height={1000}
                fetchPriority="high"
                className="aspect-3/4 w-full rounded-t-3xl object-cover object-top drop-shadow-xl"
              />
              <div className="absolute inset-x-6 -bottom-6 z-20 rounded-2xl border bg-white/95 px-5 py-3.5 text-center shadow-lg backdrop-blur lg:-bottom-2">
                <p className="font-heading text-lg font-semibold text-navy">{specialist.name}</p>
                <p className="text-sm text-muted-foreground">{specialist.role}</p>
              </div>
            </div>
            <div className="absolute bottom-0 w-full overflow-hidden" aria-hidden="true">
              <div className="relative aspect-2/1">
                <div className="absolute aspect-square w-full rounded-full bg-gradient-to-b from-teal/25 to-teal/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero86 };
