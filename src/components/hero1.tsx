import { ArrowRight, MessageCircle, Phone, Stethoscope } from "lucide-react";

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

interface Specialist {
  name: string;
  role: string;
  imageSrc: string;
}

interface Hero1Props {
  badge?: string;
  heading: string;
  tagline: string;
  description: string;
  buttons?: Buttons;
  specialist: Specialist;
  className?: string;
}

const Hero1 = ({ badge, heading, tagline, description, buttons, specialist, className }: Hero1Props) => {
  return (
    <section className={cn("relative overflow-hidden py-20 md:py-28", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-teal/10 to-navy/5 blur-3xl"
          data-parallax="-0.12"
        />
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline" className="gap-1.5 rounded-full border-teal/40 px-3 py-1.5 text-navy" data-animate="up">
                <Stethoscope className="size-3.5 text-teal" aria-hidden="true" />
                {badge}
              </Badge>
            )}
            <h1
              data-animate="blur"
              className="max-w-xl font-heading text-4xl leading-[1.08] font-bold tracking-tight text-pretty text-navy md:text-5xl lg:text-6xl"
            >
              {heading}
            </h1>
            <p data-animate="up" data-delay="0.15" className="text-xl font-medium text-teal">
              {tagline}
            </p>
            <p data-animate="up" data-delay="0.25" className="max-w-xl text-balance text-muted-foreground lg:text-lg">
              {description}
            </p>
            <div data-animate="up" data-delay="0.35" className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-teal px-8 py-6 text-base font-semibold text-white shadow-lg shadow-teal/25 hover:bg-teal/90 sm:w-auto"
                >
                  <a href={buttons.primary.url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-5" aria-hidden="true" />
                    {buttons.primary.text}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-2 border-navy/15 px-8 py-6 text-base font-semibold text-navy hover:border-teal hover:bg-transparent hover:text-teal sm:w-auto"
                >
                  <a href={buttons.secondary.url}>
                    <Phone className="size-4" aria-hidden="true" />
                    {buttons.secondary.text}
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end" data-animate="scale" data-delay="0.2">
            <figure className="relative w-[300px] sm:w-[360px] lg:w-[400px]">
              <div className="overflow-hidden rounded-t-full rounded-b-[2rem] border-8 border-white bg-accent shadow-2xl shadow-navy/15">
                <img
                  src={specialist.imageSrc}
                  alt={`${specialist.name} — ${specialist.role} en JS Dental Group`}
                  width={800}
                  height={1000}
                  fetchPriority="high"
                  className="aspect-[4/5] h-auto w-full object-cover object-top"
                />
              </div>
              <figcaption className="absolute inset-x-4 -bottom-8 rounded-2xl border bg-white/95 px-5 py-4 text-center shadow-lg backdrop-blur">
                <p className="font-heading text-lg font-semibold text-navy">{specialist.name}</p>
                <p className="text-sm text-muted-foreground">{specialist.role}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero1 };
