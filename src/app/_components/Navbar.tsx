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
  return (
    <header className="w-full bg-cream border-b border-[#E5E0D9] px-6 py-2 flex items-center justify-between">
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

      {/* Nav links */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="gap-2">
          {navLinks.map(({ label, href, highlight }) => (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <Link
                  href={href}
                  className={
                    highlight
                      ? "inline-flex items-center gap-2 justify-center px-3 py-2 rounded-full bg-linear-to-r from-strong-purple to-girly-purple hover:from-girly-purple hover:to-hot-pink text-white font-semibold text-sm transition-all duration-500 ease-in-out shadow-md"
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

      {/* Language switch */}
      <div className="flex items-center gap-1 shrink-0 border border-girly-purple rounded-full px-1 py-1 bg-white">
        <button className="px-3 py-1 rounded-full text-sm font-semibold bg-girly-purple text-white transition">
          ES
        </button>
        <button className="px-3 py-1 rounded-full text-sm font-semibold text-dark-purple hover:bg-girly-purple/10 transition">
          EN
        </button>
      </div>
    </header>
  );
}
