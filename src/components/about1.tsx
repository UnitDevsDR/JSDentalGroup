import { HandHeart, HeartHandshake, Users, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface About1Props {
  className?: string;
  historyImageSrc: string;
  missionImageSrc: string;
}

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Users,
    title: "Trabajo multidisciplinario",
    text: "Cada especialista aporta su granito de arena, garantizando tratamientos más completos, personalizados y exitosos.",
  },
  {
    icon: HeartHandshake,
    title: "Relaciones de confianza",
    text: "Nuestro objetivo no es solo cuidar sonrisas, sino construir relaciones de confianza con cada paciente.",
  },
  {
    icon: HandHeart,
    title: "Ética, respeto y amor",
    text: "Guiados siempre por la ética, el respeto y el amor por lo que hacemos, en cada consulta y cada tratamiento.",
  },
];

const About1 = ({ className, historyImageSrc, missionImageSrc }: About1Props) => {
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container flex flex-col gap-16 lg:gap-28">
        <div className="flex flex-col gap-4 lg:gap-8" data-animate="up">
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-navy lg:text-7xl">
            Historia de la clínica
          </h1>
          <p className="max-w-xl text-xl">
            En el año {SITE.founded} nace {SITE.legalName}, un sueño hecho
            realidad que surge del deseo de ofrecer una atención odontológica
            integral, moderna y basada en el trabajo en equipo.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2" data-stagger>
          <img
            src={historyImageSrc}
            alt="Dra. Julissa Saint-Hilaire Espinal, fundadora de JS Dental Group"
            loading="lazy"
            className="size-full max-h-96 rounded-2xl bg-accent object-cover object-top"
          />
          <div
            className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-2xl bg-navy bg-cover bg-center p-10"
            style={{ backgroundImage: `url('${missionImageSrc}')` }}
          >
            <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />
            <p className="relative text-sm font-semibold tracking-widest text-teal">
              NUESTRA MISIÓN
            </p>
            <p className="relative text-lg font-medium text-white">
              Más que una clínica, somos un grupo de expertos comprometidos con
              brindar soluciones funcionales y estéticas, trabajando de forma
              multidisciplinaria para abordar cada caso con la máxima
              excelencia.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl" data-animate="up">
            <h2 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-navy md:text-5xl">
              Lo que nos guía
            </h2>
            <p className="text-lg text-muted-foreground">
              Tres principios que están presentes en cada tratamiento y en cada
              visita.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3" data-stagger>
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <v.icon className="size-5 text-teal" aria-hidden="true" />
                </div>
                <h3 className="mt-2 mb-3 text-lg font-semibold">{v.title}</h3>
                <p className="text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { About1 };
