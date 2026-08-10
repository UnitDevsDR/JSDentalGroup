"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
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

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
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

interface Item {
  name: string;
  href: string;
  icon: string;
}

interface Integration6Props {
  heading: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  items: Item[];
  className?: string;
}

const Integration6 = ({ heading, description, ctaText, ctaHref, items, className }: Integration6Props) => {
  return (
    <section className={cn("py-16 md:py-24", className)} aria-label="Nuestras especialidades">
      <div className="container">
        <div className="flex flex-col gap-8 overflow-hidden rounded-xl bg-navy py-4 md:gap-10 md:py-10">
          <div className="flex w-full flex-col justify-between gap-5 px-6 py-5 md:px-10 lg:flex-row lg:items-end">
            <div className="flex-1">
              <div className="flex w-full max-w-[32rem] flex-col gap-5">
                <h2 className="font-heading text-[2rem] leading-none font-bold tracking-tight text-white md:text-[2.75rem] lg:text-5xl">
                  {heading}
                </h2>
                <p className="leading-[1.4] text-white/60">{description}</p>
              </div>
            </div>
            <div className="lg:self-end">
              <Button
                asChild
                className="h-fit w-full justify-between gap-4 rounded-full bg-white p-2.5 pr-5 text-navy shadow-[0_0_0_4px_oklch(0.71_0.09_187_/_0.35)] transition-shadow hover:bg-white hover:shadow-[0_0_0_4px_oklch(0.71_0.09_187_/_0.6)] sm:w-fit sm:gap-20"
              >
                <a href={ctaHref}>
                  <span className="flex items-center gap-2.5">
                    <Carousel
                      plugins={[Autoplay({ delay: 2000 })]}
                      className="size-8 shrink-0 overflow-hidden rounded-full bg-teal/15"
                    >
                      <CarouselContent className="ml-0 size-8">
                        {items.slice(0, 5).map((item) => {
                          const Icon = ICONS[item.icon] ?? Sparkles;
                          return (
                            <CarouselItem
                              key={item.name}
                              className="flex size-8 overflow-hidden rounded-full p-0"
                            >
                              <Icon className="m-auto block size-4 text-teal" aria-hidden="true" />
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                    </Carousel>
                    <span className="font-medium">{ctaText}</span>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
          <Separator className="bg-white/10" />
          <Carousel
            opts={{ loop: true, watchDrag: false }}
            plugins={[AutoScroll({ speed: 0.6 })]}
            className="w-full"
          >
            <CarouselContent>
              {items.map((item) => {
                const Icon = ICONS[item.icon] ?? Sparkles;
                return (
                  <CarouselItem key={item.name} className="basis-auto pl-10">
                    <a
                      href={item.href}
                      className="flex items-center gap-2.5 py-2.5 text-white/70 transition-colors hover:text-white"
                    >
                      <Icon className="size-4 shrink-0 text-teal" aria-hidden="true" />
                      <span className="font-heading text-sm font-medium whitespace-nowrap">{item.name}</span>
                    </a>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          <Separator className="bg-white/10" />
        </div>
      </div>
    </section>
  );
};

export { Integration6 };
