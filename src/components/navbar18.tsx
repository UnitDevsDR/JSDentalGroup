"use client";

import {
  Activity,
  AlignHorizontalDistributeCenter,
  Anchor,
  ArrowRight,
  Baby,
  Clock,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import React, { useState } from "react";

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
import { SITE } from "@/data/site";

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

interface NavSubItem {
  title: string;
  href: string;
  description: string;
  icon?: string;
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
  /** ruta actual (Astro.url.pathname) para marcar el enlace activo */
  currentPath?: string;
}

const isActive = (link: string, currentPath?: string) => {
  if (!currentPath) return false;
  if (link === "/") return currentPath === "/";
  return currentPath === link || currentPath === `${link}/`;
};

const Navbar18 = ({ className, logoSrc, whatsapp, items, currentPath }: Navbar18Props) => {
  return (
    <section
      className={cn(
        "relative mx-auto flex max-w-full items-center justify-between gap-3 border border-t-0 bg-card/95 px-5 py-2.5 shadow-lg shadow-navy/5 backdrop-blur-md transition-shadow duration-300 md:w-fit md:rounded-b-2xl lg:gap-5",
        className,
      )}
    >
      <a href="/" className="flex items-center gap-1" aria-label="JS Dental Group — Inicio">
        <img src={logoSrc} className="h-9 w-auto" alt="JS Dental Group" width={144} height={36} />
      </a>

      <MobileNav items={items} whatsapp={whatsapp} currentPath={currentPath} />

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="h-full w-full">
          {items.map((item, index) =>
            item.hasSubmenu ? (
              <NavigationMenuItem key={index} className="rounded-2xl">
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent px-2.5 py-1 text-sm",
                    currentPath && item.submenu?.some((s) => isActive(s.href, currentPath)) && "text-teal",
                  )}
                >
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl">
                  <ul className="grid w-[340px] gap-1 p-2 md:w-[540px] md:grid-cols-2">
                    {item.submenu?.map((sub) => {
                      const Icon = ICONS[sub.icon ?? ""] ?? Sparkles;
                      const active = isActive(sub.href, currentPath);
                      return (
                        <li key={sub.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={sub.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group/item flex items-start gap-3 rounded-lg p-3 text-sm leading-none no-underline transition-colors outline-none select-none hover:bg-accent focus:bg-accent",
                                active && "bg-accent",
                              )}
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent transition-colors group-hover/item:bg-teal group-hover/item:text-white">
                                <Icon className="size-4 text-teal transition-colors group-hover/item:text-white" aria-hidden="true" />
                              </span>
                              <span className="flex flex-col gap-1">
                                <span className={cn("text-sm leading-none font-medium", active && "text-teal")}>
                                  {sub.title}
                                </span>
                                <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {sub.description}
                                </span>
                              </span>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                    <li className="md:col-span-2">
                      <a
                        href="/our-services"
                        className="group/all flex items-center justify-between rounded-lg border border-dashed border-teal/40 p-3 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-white"
                      >
                        Ver todos los servicios
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover/all:translate-x-1" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  href={item.link}
                  aria-current={isActive(item.link, currentPath) ? "page" : undefined}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "relative bg-transparent px-3 py-1.5 text-sm",
                    isActive(item.link, currentPath) &&
                      "text-teal after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-teal",
                  )}
                >
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden items-center gap-2 md:flex">
        <a
          href={`tel:${SITE.phone}`}
          aria-label={`Llamar al ${SITE.phoneDisplay}`}
          title={SITE.phoneDisplay}
          className="flex size-9 items-center justify-center rounded-full border text-navy transition-colors hover:border-teal hover:text-teal"
        >
          <Phone className="size-4" aria-hidden="true" />
        </a>
        <Button asChild className="h-auto rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden="true" />
            Agenda tu cita
          </a>
        </Button>
      </div>
    </section>
  );
};

const MobileNav = ({
  items,
  whatsapp,
  currentPath,
}: {
  items: NavItem[];
  whatsapp: string;
  currentPath?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mr-1 flex items-center justify-center md:hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
        >
          {open ? (
            <X className="size-6 text-foreground" aria-hidden="true" />
          ) : (
            <Menu className="size-6 text-foreground" aria-hidden="true" />
          )}
        </PopoverTrigger>

        <PopoverContent align="end" sideOffset={12} className="w-screen max-w-sm overflow-hidden rounded-2xl p-0">
          <nav aria-label="Menú principal" className="flex max-h-[75vh] flex-col overflow-y-auto">
            <ul className="p-2">
              {items.map((navItem) =>
                navItem.hasSubmenu ? (
                  <li key={navItem.name} className="px-2 pt-3 pb-1">
                    <p className="px-1 pb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                      {navItem.name}
                    </p>
                    <ul className="grid grid-cols-2 gap-1">
                      {navItem.submenu?.map((sub) => {
                        const Icon = ICONS[sub.icon ?? ""] ?? Sparkles;
                        return (
                          <li key={sub.title}>
                            <a
                              href={sub.href}
                              aria-current={isActive(sub.href, currentPath) ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg p-2.5 text-sm font-medium hover:bg-accent",
                                isActive(sub.href, currentPath) && "bg-accent text-teal",
                              )}
                            >
                              <Icon className="size-4 shrink-0 text-teal" aria-hidden="true" />
                              {sub.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ) : (
                  <li key={navItem.name}>
                    <a
                      href={navItem.link}
                      aria-current={isActive(navItem.link, currentPath) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-accent",
                        isActive(navItem.link, currentPath) && "text-teal",
                      )}
                    >
                      {navItem.name}
                    </a>
                  </li>
                ),
              )}
            </ul>

            <div className="border-t bg-muted/40 p-4">
              <div className="mb-3 flex items-start gap-2.5 text-xs text-muted-foreground">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-teal" aria-hidden="true" />
                <p>
                  {SITE.hours.weekdays}
                  <br />
                  {SITE.hours.saturday}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full rounded-full bg-teal py-5 text-sm font-semibold text-white hover:bg-teal/90">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Agenda tu cita por WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-navy/15 py-5 text-sm font-semibold text-navy"
                >
                  <a href={`tel:${SITE.phone}`}>
                    <Phone className="size-4" aria-hidden="true" />
                    Llamar: {SITE.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { Navbar18 };
