"use client";

import { ArrowRight, Clock, Menu, MessageCircle, Phone, X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

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

interface Navbar17Props {
  className?: string;
  logoSrc: string;
  whatsapp: string;
  items: NavItem[];
  currentPath?: string;
}

const isActive = (item: NavItem, currentPath?: string) => {
  if (!currentPath) return false;
  if (item.link === "/") return currentPath === "/";
  if (currentPath === item.link || currentPath === `${item.link}/`) return true;
  return !!item.submenu?.some((s) => currentPath === s.href || currentPath === `${s.href}/`);
};

const Navbar17 = ({ className, logoSrc, whatsapp, items, currentPath }: Navbar17Props) => {
  const activeItem = items.find((i) => isActive(i, currentPath))?.name;

  return (
    <section className={cn("bg-background/90 shadow-sm shadow-navy/5 backdrop-blur-md", className)}>
      <nav className="container flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2" aria-label="JS Dental Group — Inicio">
          <img src={logoSrc} className="h-9 w-auto" alt="JS Dental Group" width={144} height={36} />
        </a>

        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList className="relative flex items-center gap-1">
            {items.map((item) =>
              item.hasSubmenu ? (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-10 bg-transparent px-3.5 text-base font-medium hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                      activeItem === item.name ? "font-semibold text-teal" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-xl">
                    <ul className="grid w-[340px] gap-1 p-2 md:w-[540px] md:grid-cols-2">
                      {item.submenu?.map((sub) => {
                        const subActive = currentPath === sub.href || currentPath === `${sub.href}/`;
                        return (
                          <li key={sub.title}>
                            <NavigationMenuLink asChild>
                              <a
                                href={sub.href}
                                aria-current={subActive ? "page" : undefined}
                                className={cn(
                                  "group/item flex items-start gap-3 rounded-lg p-3 text-sm leading-none no-underline transition-colors outline-none select-none hover:bg-accent focus:bg-accent",
                                  subActive && "bg-accent",
                                )}
                              >
                                <span className="flex flex-col gap-1.5">
                                  <span className={cn("text-sm leading-none font-medium", subActive && "text-teal")}>
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
                          <ArrowRight
                            className="size-4 transition-transform duration-300 group-hover/all:translate-x-1"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink
                    href={item.link}
                    aria-current={activeItem === item.name ? "page" : undefined}
                    className={cn(
                      "relative flex h-10 cursor-pointer items-center rounded-md px-3.5 text-base font-medium transition-colors hover:bg-transparent",
                      activeItem === item.name ? "font-semibold text-teal" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}

          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`Llamar al ${SITE.phoneDisplay}`}
            title={SITE.phoneDisplay}
            className="hidden size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
          >
            <Phone className="size-4" aria-hidden="true" />
          </a>
          <Button
            asChild
            size="sm"
            className="hidden h-10 rounded-md bg-teal px-5 text-base font-medium text-white hover:bg-teal/90 lg:inline-flex"
          >
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              Agenda tu cita
            </a>
          </Button>

          <MobileNav items={items} whatsapp={whatsapp} currentPath={currentPath} />
        </div>
      </nav>
    </section>
  );
};

const AnimatedHamburger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="group relative size-full">
      <div className="absolute flex size-full items-center justify-center">
        <Menu
          className={`absolute size-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${
            isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
          aria-hidden="true"
        />
        <X
          className={`absolute size-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${
            isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-full items-center lg:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
            <AnimatedHamburger isOpen={isOpen} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={14}
          className="w-screen max-w-sm overflow-hidden rounded-xl p-0"
        >
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
                        const subActive = currentPath === sub.href || currentPath === `${sub.href}/`;
                        return (
                          <li key={sub.title}>
                            <a
                              href={sub.href}
                              aria-current={subActive ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg p-2.5 text-sm font-medium hover:bg-accent",
                                subActive && "bg-accent text-teal",
                              )}
                            >
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
                      aria-current={isActive(navItem, currentPath) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between border-l-[3px] border-transparent px-4 py-3 text-base font-medium text-muted-foreground transition-all hover:text-foreground",
                        isActive(navItem, currentPath) && "border-teal text-foreground",
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
                <Button asChild className="w-full rounded-md bg-teal py-5 text-sm font-semibold text-white hover:bg-teal/90">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Agenda tu cita por WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-md border-border py-5 text-sm font-semibold text-foreground"
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

export { Navbar17 };
