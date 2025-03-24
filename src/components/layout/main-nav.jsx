"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav>
      <ul className="flex space-x-6">
        <li>
          <Link
            href="/"
            className={cn(
              "text-sm transition-colors hover:text-gray-900",
              pathname === "/" ? "text-gray-900 font-medium" : "text-gray-500"
            )}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className={cn(
              "text-sm transition-colors hover:text-gray-900",
              pathname.startsWith("/projects") ? "text-gray-900 font-medium" : "text-gray-500"
            )}
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            href="/scraping-packages"
            className={cn(
              "text-sm transition-colors hover:text-gray-900",
              pathname.startsWith("/scraping-packages") ? "text-gray-900 font-medium" : "text-gray-500"
            )}
          >
            Scraping Packages
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={cn(
              "text-sm transition-colors hover:text-gray-900",
              pathname.startsWith("/settings") ? "text-gray-900 font-medium" : "text-gray-500"
            )}
          >
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  )
} 