"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  href: string;
}

interface Integration6Props {
  heading: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  items: Item[];
  /** fotos de los especialistas: rotan dentro del botón CTA (Autoplay) */
  avatars?: { src: string; alt: string }[];
  className?: string;
}

const Integration6 = ({
  heading,
  description,
  ctaText,
  ctaHref,
  items,
  avatars = [],
  className,
}: Integration6Props) => {
  return (
    <section className={cn("py-16 md:py-24", className)} aria-label="Nuestras especialidades">
      <div className="container">
        <div className="flex flex-col gap-8 overflow-hidden rounded-xl bg-accent/40 py-4 md:gap-10 md:py-10">
          <div className="flex w-full flex-col justify-between gap-5 px-6 py-5 md:px-10 lg:flex-row lg:items-end">
            <div className="flex-1">
              <div className="flex w-full max-w-[32rem] flex-col gap-5">
                <h2 className="font-heading text-[2rem] leading-none font-bold tracking-tight text-navy md:text-[2.75rem] lg:text-5xl">
                  {heading}
                </h2>
                <p className="leading-[1.4] text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="lg:self-end">
              <Button
                asChild
                className="h-fit w-full justify-between gap-4 rounded-full bg-navy p-2.5 pr-5 text-white shadow-[0_0_0_4px_oklch(0.71_0.09_187_/_0.3)] transition-shadow hover:bg-navy hover:shadow-[0_0_0_4px_oklch(0.71_0.09_187_/_0.55)] sm:w-fit sm:gap-24"
              >
                <a href={ctaHref}>
                  <span className="flex items-center gap-2.5">
                    {avatars.length > 0 && (
                      <Carousel
                        plugins={[Autoplay({ delay: 2000 })]}
                        className="size-9 shrink-0 overflow-hidden rounded-full border-2 border-white/30"
                      >
                        <CarouselContent className="ml-0 size-8.5">
                          {avatars.map((avatar) => (
                            <CarouselItem
                              key={avatar.alt}
                              className="flex size-8.5 overflow-hidden rounded-full p-0"
                            >
                              <img
                                src={avatar.src}
                                alt={avatar.alt}
                                width={40}
                                height={40}
                                loading="lazy"
                                className="m-auto block size-full rounded-full object-cover object-top"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    )}
                    <span className="font-medium">{ctaText}</span>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
          <Separator className="bg-border" />
          <Carousel
            opts={{ loop: true, watchDrag: false }}
            plugins={[
              AutoScroll({ speed: 1.4, startDelay: 0, stopOnInteraction: false }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {/* items x3: garantiza desborde (embla desactiva el loop si todos caben en pantalla) */}
              {[...items, ...items, ...items].map((item, idx) => (
                <CarouselItem key={`${item.name}-${idx}`} className="basis-auto pl-14">
                  <a
                    href={item.href}
                    className="flex items-center py-3 text-navy/70 transition-colors hover:text-teal"
                  >
                    <span className="font-heading text-2xl font-semibold whitespace-nowrap">{item.name}</span>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Separator className="bg-border" />
        </div>
      </div>
    </section>
  );
};

export { Integration6 };
