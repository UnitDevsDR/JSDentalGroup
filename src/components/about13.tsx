import { cn } from "@/lib/utils";

interface Founder {
  name: string;
  role: string;
  imageSrc: string;
}

interface About13Props {
  title: string;
  /** titular y texto del panel inferior (antes horneados en la imagen) */
  imageHeading: string;
  imageBody: string;
  sideLabel: string;
  intro: string;
  founder: Founder;
  statement: string;
  support: string;
  image: { src: string; alt: string };
  className?: string;
}

const About13 = ({
  title,
  imageHeading,
  imageBody,
  sideLabel,
  intro,
  founder,
  statement,
  support,
  image,
  className,
}: About13Props) => {
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container space-y-10 lg:space-y-20">
        <div className="w-full grid-cols-6 gap-10 lg:grid" data-animate="up">
          <div />
          <h1 className="col-span-4 font-heading text-5xl font-semibold tracking-tighter text-navy lg:pr-24 lg:pl-10 lg:text-7xl">
            {title}
          </h1>
        </div>
        <div className="grid-cols-6 space-y-12 lg:grid lg:space-y-0 xl:gap-10">
          <p className="hidden text-muted-foreground lg:block" data-animate="up">
            {sideLabel}
          </p>
          <div className="col-span-2 lg:pr-24 lg:pl-10" data-animate="up" data-delay="0.1">
            <p className="text-muted-foreground">{intro}</p>
            <div className="mt-5 flex items-center gap-5 lg:mt-20">
              <img
                src={founder.imageSrc}
                className="size-14 rounded-full border-2 border-white object-cover object-top shadow"
                alt={founder.name}
                width={56}
                height={56}
                loading="lazy"
              />
              <div>
                <h3 className="font-heading text-lg font-medium tracking-tight text-navy">{founder.name}</h3>
                <p className="text-sm text-muted-foreground">{founder.role}</p>
              </div>
            </div>
          </div>
          <div className="col-span-3 mt-16 lg:mt-0 lg:pl-10" data-animate="up" data-delay="0.2">
            <h2 className="font-heading text-2xl font-medium tracking-tight text-navy lg:text-3xl">
              {statement}
            </h2>
            <p className="mt-6 text-base text-muted-foreground lg:mt-16 lg:text-lg">{support}</p>
          </div>
        </div>
        <div data-animate="up" className="grid overflow-hidden rounded-2xl bg-accent/60 lg:grid-cols-2">
          <div className="flex items-end justify-center px-8 pt-8">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-auto max-h-[440px] w-auto"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 p-8 text-center lg:p-14 lg:text-left">
            <p className="font-heading text-3xl font-bold text-teal-text lg:text-4xl">{imageHeading}</p>
            <p className="text-2xl leading-snug text-teal-text/90 lg:text-3xl">{imageBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About13 };
