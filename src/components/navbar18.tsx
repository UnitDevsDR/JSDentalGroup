"use client";

import { Menu, MessageCircle } from "lucide-react";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NavSubItem {
  title: string;
  href: string;
  description: string;
}

interface NavItem {
  name: string;
  link: string;
  hasSubmenu?: boolean;
  submenu?: NavSubItem[];
}

interface Navbar18Props {
  className?: string;
  logoSrc: string;
  whatsapp: string;
  items: NavItem[];
}

const Navbar18 = ({ className, logoSrc, whatsapp, items }: Navbar18Props) => {
  return (
    <section
      className={cn(
        "relative mx-auto flex max-w-full items-center justify-between gap-3 border border-t-0 bg-card/90 px-5 py-2.5 shadow-lg shadow-navy/5 backdrop-blur-md md:w-fit md:rounded-b-2xl lg:gap-5",
        className,
      )}
    >
      <a href="/" className="flex items-center gap-1" aria-label="JS Dental Group — Inicio">
        <img src={logoSrc} className="h-9 w-auto" alt="JS Dental Group" width={144} height={36} />
      </a>

      <MobileNav items={items} whatsapp={whatsapp} />

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="h-full w-full">
          {items.map((item, index) =>
            item.hasSubmenu ? (
              <NavigationMenuItem key={index} className="rounded-2xl">
                <NavigationMenuTrigger className="bg-transparent px-2.5 py-1 text-sm">
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl">
                  <ul className="grid w-[320px] gap-1 p-2 md:w-[480px] md:grid-cols-2">
                    {item.submenu?.map((sub, i) => (
                      <ListItem key={sub.title || i} title={sub.title} href={sub.href}>
                        {sub.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  href={item.link}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent px-3 py-1.5 text-sm",
                  )}
                >
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden md:block">
        <Button asChild className="h-auto rounded-full px-4 py-2 text-sm font-semibold">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden="true" />
            Agenda tu cita
          </a>
        </Button>
      </div>
    </section>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex flex-col items-start space-y-1 rounded-md p-2.5 text-sm leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const MobileNav = ({ items, whatsapp }: { items: NavItem[]; whatsapp: string }) => {
  return (
    <div className="mr-2 flex items-center justify-center md:hidden">
      <Popover>
        <PopoverTrigger aria-label="Abrir menú">
          <Menu className="size-6 text-foreground" />
        </PopoverTrigger>

        <PopoverContent align="end" className="w-screen max-w-xs overflow-hidden">
          <div className="w-full bg-card/80 pt-2 text-foreground backdrop-blur-md">
            <Accordion type="single" collapsible className="w-full">
              {items.map((navItem, idx) =>
                navItem.hasSubmenu ? (
                  <AccordionItem key={idx} value={navItem.name} className="border-b-0">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:bg-accent hover:no-underline">
                      <span className="text-foreground">{navItem.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="rounded-2xl">
                      <div className="ml-4 border-l-2 border-muted pl-2">
                        <ul className="py-1">
                          {navItem.submenu?.map((sub, subIdx) => (
                            <li key={sub.title || subIdx} className="px-2 py-2 text-sm hover:bg-accent">
                              <a href={sub.href} className="block">
                                {sub.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div key={idx} className="rounded-lg px-4 py-3 text-sm hover:bg-accent">
                    <a href={navItem.link} className="flex items-center justify-between">
                      <span className="text-foreground">{navItem.name}</span>
                    </a>
                  </div>
                ),
              )}
            </Accordion>
            <div className="flex flex-col gap-2 py-2">
              <Button asChild className="px-3 text-sm font-semibold">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Agenda tu cita por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export { Navbar18 };
