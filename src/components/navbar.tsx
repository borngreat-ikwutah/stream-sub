import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Shadcn standard icons
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "~/components/ui/sheet";
import { Image } from "@unpic/react";

const navigation = [
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "About", href: "#" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 inset-x-0 z-50">
      <nav
        className="flex items-center justify-center p-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Global"
      >
        <div className="flex items-center justify-between w-full">
          {/* 1. LOGO */}
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Stream Sub</span>
              <span className="text-xl font-bold tracking-widest text-foreground font-['Orbitron_Variable']">
                STREAM SUB
              </span>
            </a>
          </div>

          {/* 2. MOBILE MENU TRIGGER (Sheet) */}
          <div className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-m-2.5 text-muted-foreground hover:text-primary"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-border"
              >
                <div className="flex items-center justify-between mb-8">
                  <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                    <SheetTitle className="text-lg font-bold tracking-widest text-foreground font-['Orbitron_Variable']">
                      STREAM SUB
                    </SheetTitle>
                  </a>
                </div>

                <div className="flow-root">
                  <div className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-base font-semibold leading-7 text-foreground hover:text-primary hover:translate-x-2 transition-all duration-300"
                      >
                        {item.name}
                      </a>
                    ))}
                    <div className="pt-6 border-t border-border mt-6 flex flex-col gap-4">
                      <a
                        href="#"
                        className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
                      >
                        Log in
                      </a>
                      <Button className="w-full rounded-full font-bold shadow-button">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 3. DESKTOP NAVIGATION */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* 4. DESKTOP CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Log in
            </a>
            <Button className="rounded-full shadow-button font-semibold">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
