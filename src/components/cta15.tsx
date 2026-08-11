import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Image {
  src: string;
  alt: string;
}
interface ButtonProps {
  text: string;
  url: string;
}
interface Buttons {
  primary?: ButtonProps;
  secondary?: ButtonProps;
}

interface Cta15Props {
  byline: string;
  /** la última palabra del heading lleva el arco de sonrisa */
  heading: string;
  description: string;
  highlights?: string[];
  image: Image;
  buttons?: Buttons;
  className?: string;
}

const Cta15 = ({ byline, heading, description, highlights = [], image, buttons, className }: Cta15Props) => {
  const words = heading.split(" ");
  const lastWord = words.pop();

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid overflow-hidden rounded-3xl bg-accent/50 lg:grid-cols-2">
          {/* Contenido */}
          <div className="flex flex-col justify-center gap-6 p-8 md:p-12 lg:gap-7 lg:p-16">
            <p className="text-sm font-semibold tracking-[0.2em] text-teal-text uppercase" data-animate="up">
              {byline}
            </p>
            <h2
              data-animate="up"
              data-delay="0.1"
              className="font-heading text-4xl leading-[1.08] font-bold text-navy md:text-5xl xl:text-6xl"
            >
              {words.join(" ")}{" "}
              <span className="relative inline-block whitespace-nowrap">
                {lastWord}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 26"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 3 1 C 44 17, 156 17, 197 1 C 181 24, 19 24, 3 1 Z"
                    fill="oklch(0.71 0.09 187)"
                  />
                </svg>
              </span>
            </h2>
            <p data-animate="up" data-delay="0.2" className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>

            {highlights.length > 0 && (
              <ul data-animate="up" data-delay="0.3" className="flex flex-col gap-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-base font-medium text-navy">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div data-animate="up" data-delay="0.4" className="mt-2 flex flex-col gap-3 sm:flex-row">
              {buttons?.primary && (
                <Button
                  asChild
                  className="h-auto rounded-full bg-teal-strong px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-teal-strong/90"
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
                  className="h-auto rounded-full border-2 border-navy/15 bg-transparent px-8 py-4 text-base font-semibold text-navy hover:border-teal hover:bg-transparent hover:text-teal"
                >
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>

          {/* Ilustración a sangre en toda la mitad derecha */}
          <div className="relative min-h-[340px] lg:min-h-[560px]">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta15 };
