"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Member {
  name: string;
  role: string;
  imageSrc: string;
}

interface Team13Props {
  className?: string;
  members: Member[];
  whatsapp: string;
}

// Alturas alternadas para el efecto editorial escalonado del bloque original
const HEIGHTS = ["h-80", "h-96", "h-72", "h-88", "h-80"];

const Team13 = ({ className, members, whatsapp }: Team13Props) => {
  return (
    <section className={cn("py-24 md:py-32", className)} id="equipo">
      <div className="container">
        <div className="relative w-full">
          <div className="flex justify-between text-sm font-medium tracking-tight lg:text-xl">
            <p className="text-navy">[ CONOCE A NUESTROS ESPECIALISTAS ]</p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              [ AGENDA TU CITA
              <ArrowRight
                className="size-[1em] transition-transform duration-300 group-hover:rotate-45"
                aria-hidden="true"
              />
              ]
            </a>
          </div>

          {/* Carrusel móvil */}
          <div className="mt-12 lg:hidden">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {members.map((member, idx) => (
                  <CarouselItem className="basis-1/2" key={member.name}>
                    <div className="w-full">
                      <motion.div
                        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        className={cn(HEIGHTS[idx % HEIGHTS.length], "overflow-hidden rounded-xl bg-accent")}
                      >
                        <img
                          src={member.imageSrc}
                          alt={member.name}
                          loading="lazy"
                          className="pointer-events-none h-full w-full object-cover object-top"
                        />
                      </motion.div>
                    </div>
                    <div className="pt-4 pb-1">
                      <p className="text-lg font-medium tracking-tight text-foreground">{member.name}</p>
                      <p className="text-sm text-foreground/50">{member.role}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" aria-label="Anterior" />
              <CarouselNext className="right-2" aria-label="Siguiente" />
            </Carousel>
          </div>

          {/* Grid escalonado desktop */}
          <div className="mt-12 hidden grid-cols-5 gap-4 lg:grid">
            {members.map((member, idx) => (
              <div key={member.name} className={cn(idx % 2 === 1 && "lg:mt-10")}>
                <motion.div
                  initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, delay: (idx % 5) * 0.06 }}
                  className="h-72 overflow-hidden rounded-xl bg-accent"
                >
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    loading="lazy"
                    className="pointer-events-none h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
                <div className="pt-4 pb-1">
                  <p className="font-medium tracking-tight text-foreground">{member.name}</p>
                  <p className="text-sm text-foreground/50">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Team13 };
