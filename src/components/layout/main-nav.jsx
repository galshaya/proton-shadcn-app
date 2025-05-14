"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav>
      <ul className="flex space-x-8">
        <li>
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
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
              "text-sm font-medium transition-colors hover:text-white",
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
              "text-sm font-medium transition-colors hover:text-white",
              pathname.startsWith("/scraping-packages") ? "text-white" : "text-gray-400"
            )}
          >
            Content Sources
          </Link>
        </li>
        <li>
          <Link
            href="/lab"
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname.startsWith("/lab") ? "text-white" : "text-gray-400"
            )}
          >
            AI Lab
          </Link>
        </li>
        <li>
          <Link
            href="/chat"
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname.startsWith("/chat") ? "text-white" : "text-gray-400"
            )}
          >
            Proton Chat
          </Link>
        </li>
      </ul>
    </nav>
  )
}