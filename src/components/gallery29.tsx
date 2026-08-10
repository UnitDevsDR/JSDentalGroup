import { InstagramIcon } from "@/components/ui/instagram-icon";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

interface Gallery29Props {
  className?: string;
  heading: string;
  description: string;
  images: { src: string; alt: string }[];
  /** Imagen destacada al centro (enlaza a Instagram) */
  featured: { src: string; alt: string };
  instagramUrl: string;
}

const Gallery29 = ({
  className,
  heading,
  description,
  images,
  featured,
  instagramUrl,
}: Gallery29Props) => {
  return (
    <section className={cn("relative overflow-hidden bg-navy py-24 md:py-32", className)}>
      <div>
        <div className="container mb-12 flex flex-col gap-4 text-center" data-animate="up">
          <h2 className="font-heading text-4xl font-medium text-white md:text-5xl">{heading}</h2>
          <p className="text-lg text-white/60">{description}</p>
        </div>
        <div className="relative">
          <Marquee repeat={3} className="p-0 opacity-50 [--duration:50s]">
            {images.map((image, idx) => (
              <img
                key={idx}
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-square max-w-80 rounded-lg object-cover"
              />
            ))}
          </Marquee>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute inset-0 z-10 container mx-auto flex w-fit scale-105 items-center justify-center overflow-hidden rounded-lg transition-transform duration-500 hover:scale-100"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={featured.src}
                alt={featured.alt}
                loading="lazy"
                className="aspect-square w-full max-w-80 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy/60 opacity-0 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-100">
                <p className="flex -translate-y-6 items-center gap-2 border-b border-white/50 pb-1 text-xl font-medium text-white transition-transform duration-500 group-hover:translate-y-0">
                  <InstagramIcon className="size-5" />
                  @jsdentalgrouprd
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export { Gallery29 };
