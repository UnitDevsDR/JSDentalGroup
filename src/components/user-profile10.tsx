import { BadgeCheck, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Doctor {
  name: string;
  role: string;
  imageSrc: string;
  /** los perfiles clínicos llevan insignia; el personal administrativo no */
  verified?: boolean;
}

interface Copy {
  specialist: string;
  staff: string;
  book: string;
  certified: string;
}

const UserProfile10 = ({
  doctor,
  whatsapp,
  t,
  className,
}: {
  doctor: Doctor;
  whatsapp: string;
  t: Copy;
  className?: string;
}) => (
  <Card className={cn("w-full gap-0 overflow-hidden py-0 shadow-lg shadow-navy/5", className)}>
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-accent">
      <img
        src={doctor.imageSrc}
        alt={`${doctor.name} — ${doctor.role}, JS Dental Group`}
        loading="lazy"
        width={480}
        height={600}
        className="size-full object-cover object-top"
      />
    </div>

    <CardContent className="space-y-4 p-5">
      <div>
        <div className="flex items-center gap-1.5">
          <h3 className="font-heading text-lg leading-snug font-semibold text-navy">{doctor.name}</h3>
          {doctor.verified && (
            <BadgeCheck className="size-5 shrink-0 fill-teal text-card" aria-label={t.certified} />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{doctor.role}</p>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-xs font-semibold tracking-widest text-teal uppercase">
          {doctor.verified ? t.specialist : t.staff}
        </span>
        <Button asChild className="h-10 gap-1.5 bg-teal px-4 text-white hover:bg-teal/90">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            {t.book}
            <MessageCircle className="size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

/** Sección de equipo: una tarjeta de perfil (user-profile10) por doctor. */
const TeamProfiles = ({
  doctors,
  whatsapp,
  heading,
  description,
  t,
  className,
}: {
  doctors: Doctor[];
  whatsapp: string;
  heading: string;
  description: string;
  t: Copy;
  className?: string;
}) => (
  <section className={cn("py-24 md:py-32", className)} id="equipo">
    <div className="container">
      <div className="mx-auto mb-14 flex max-w-xl flex-col gap-4 text-center" data-animate="up">
        <h2 className="font-heading text-4xl font-bold text-navy md:text-5xl">{heading}</h2>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-stagger>
        {doctors.map((doctor) => (
          <UserProfile10 key={doctor.name} doctor={doctor} whatsapp={whatsapp} t={t} />
        ))}
      </div>
    </div>
  </section>
);

export { UserProfile10, TeamProfiles };
