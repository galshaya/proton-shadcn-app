import Link from "next/link"
import { MainNav } from "./main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">PROTON</span>
          </Link>
        </div>
        <MainNav />
      </div>
    </header>
  )
} 