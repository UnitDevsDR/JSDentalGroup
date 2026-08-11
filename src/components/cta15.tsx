import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}
interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}

interface CtaSideImageProps {
  heading: string;
  description: string;
  image: Image;
  buttons?: Buttons;
  byline?: string;
  className?: string;
}

interface Cta15Props extends CtaSideImageProps {}
type Props = Partial<Cta15Props>;

const defaultProps: Cta15Props = {
  heading: "Call to Action",
  description:
    "Get access to our collection of pre-built blocks and components today.",
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/1-16x9.jpg",
    alt: "Call to Action",
  },
  buttons: {
    primary: {
      text: "Get Access",
      url: "https://shadcnblocks.com",
    },
    secondary: {
      text: "Schedule a Demo",
      url: "https://shadcnblocks.com",
    },
  },
  byline: "Ready to get started?",
};

const Cta15 = (props: Props) => {
  const { heading, description, image, buttons, byline, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col justify-between gap-20 overflow-hidden rounded-2xl border bg-accent/50 pt-20 sm:pl-16 lg:flex-row lg:pl-20">
          <div className="mx-auto max-w-md px-4 text-center md:px-0 lg:mx-0 lg:pb-20 lg:text-left">
            {byline && <p className="mb-6 font-medium">{byline}</p>}
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">{heading}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button variant="outline" asChild>
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>
          <div className="relative w-full pl-4 sm:pl-0">
            <img
              src={image.src}
              alt={image.alt}
              className="relative z-10 h-full max-h-[420px] w-full rounded-2xl object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta15 };
