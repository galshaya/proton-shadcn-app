'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Scraping Packages",
    href: "/scraping-packages",
  },
  {
    label: "Global Settings",
    href: "/settings",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              PROTON
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
              JD
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 