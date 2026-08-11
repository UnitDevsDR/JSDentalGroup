"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface FaqItem {
  question: string;
  answer: string;
}

interface Faq11Props {
  heading: string;
  note: string;
  items: FaqItem[];
  /** ilustración 3D del sitio (flota con animación CSS) */
  imageSrc?: string;
  className?: string;
}

const Faq11 = ({ heading, note, items, imageSrc, className }: Faq11Props) => {
  return (
    <section className={cn("relative mx-2.5 mt-2.5 rounded-t-2xl rounded-b-[36px] bg-accent/40", className)} id="faq">
      <section className="py-24 md:py-32">
        <div className="container grid max-w-5xl gap-16 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-navy md:text-4xl lg:text-5xl">
              {heading}
            </h2>

            <p className="max-w-md leading-snug font-medium text-muted-foreground">
              {note}{" "}
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline underline-offset-4"
              >
                escríbenos por WhatsApp
              </a>
              .
            </p>

            {imageSrc && (
              <img
                src={imageSrc}
                alt="Agenda tu cita en JS Dental Group"
                width={280}
                height={280}
                loading="lazy"
                className="faq-float mx-auto mt-6 w-56 max-w-full lg:mx-0 lg:w-64"
              />
            )}
          </div>

          <div className="grid gap-6 text-start">
            <div>
              <h3 className="border-b py-4 font-medium text-muted-foreground">Sobre la clínica</h3>
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-start text-base font-medium text-navy hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export { Faq11 };
