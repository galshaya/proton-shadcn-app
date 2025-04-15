"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav>
      <ul className="flex space-x-8">
        <li>
          <Link
            href="/"
            className={cn(
              "text-sm font-light transition-colors hover:text-white",
              pathname === "/" ? "text-white" : "text-gray-400"
            )}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className={cn(
              "text-sm font-light transition-colors hover:text-white",
              pathname.startsWith("/projects") ? "text-white" : "text-gray-400"
            )}
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            href="/scraping-packages"
            className={cn(
              "text-sm font-light transition-colors hover:text-white",
              pathname.startsWith("/scraping-packages") ? "text-white" : "text-gray-400"
            )}
          >
            Content Sources
          </Link>
        </li>
      </ul>
    </nav>
  )
} 