"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { label: "Careers", href: "/explore-careers" },
  { label: "References", href: "/references" },
  { label: "Community", href: "/community" },
  { label: "Take the Quiz", href: "/quiz", highlight: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-cream border-b border-[#E5E0D9] px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="SheShips logo"
              width={48}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-girly-purple transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-girly-purple transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-girly-purple transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Desktop nav links */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2">
            {navLinks.map(({ label, href, highlight }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    className={
                      highlight
                        ? "inline-flex items-center gap-2 justify-center px-3 py-2 rounded-full bg-linear-to-br from-strong-purple via-strong-purple to-girly-purple hover:from-girly-purple hover:via-hot-pink hover:to-cute-orange text-white font-semibold text-sm transition-all duration-500 ease-in-out shadow-md"
                        : `${navigationMenuTriggerStyle()} font-semibold text-strong-purple bg-transparent hover:bg-girly-purple/10`
                    }
                  >
                    {label}
                    {highlight && (
                      <Image
                        src="/quiz-icon.svg"
                        alt="quiz icon"
                        width={18}
                        height={18}
                        className="object-contain relative -top-0.5"
                      />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {/* Language switch */}
          <div className="flex items-center gap-1 shrink-0 border border-girly-purple rounded-full px-1 py-1 bg-white">
            <button className="px-3 py-1 rounded-full text-sm font-semibold bg-girly-purple text-white transition">
              ES
            </button>
            <button className="px-3 py-1 rounded-full text-sm font-semibold text-dark-purple hover:bg-girly-purple/10 transition">
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col gap-2 pb-4">
          {navLinks.map(({ label, href, highlight }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={
                highlight
                  ? "inline-flex items-center gap-2 justify-center px-4 py-3 rounded-full bg-linear-to-br from-strong-purple via-strong-purple to-girly-purple text-white font-semibold text-base transition-all duration-500 shadow-md"
                  : "px-4 py-3 rounded-full text-base font-semibold text-strong-purple hover:bg-girly-purple/10 transition-colors"
              }
            >
              {label}
              {highlight && (
                <Image
                  src="/quiz-icon.svg"
                  alt="quiz icon"
                  width={18}
                  height={18}
                  className="object-contain relative -top-0.5"
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
