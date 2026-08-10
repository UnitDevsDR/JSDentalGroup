import {
  Activity,
  AlignHorizontalDistributeCenter,
  Anchor,
  Baby,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
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

interface Logos12Props {
  items: Item[];
  className?: string;
}

/** Marquee en cajas (logos12) adaptado a las especialidades de la clínica. */
const Logos12 = ({ items, className }: Logos12Props) => {
  return (
    <section className={cn("border-y border-border bg-accent/50 py-6", className)} aria-label="Nuestras especialidades">
      <div className="relative">
        <Marquee repeat={3} className="p-0 [--duration:45s] [--gap:0px]">
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <a
                key={item.name}
                href={item.href}
                className="relative flex h-16 w-52 items-center justify-center gap-2.5 border border-r-0 border-border bg-card/60 px-4 transition-colors hover:bg-card sm:w-56"
              >
                <Icon className="size-4 shrink-0 text-teal" strokeWidth={1.8} aria-hidden="true" />
                <span className="font-heading text-sm font-medium whitespace-nowrap text-navy/80">{item.name}</span>
              </a>
            );
          })}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent"></div>
      </div>
    </section>
  );
};

export { Logos12 };
