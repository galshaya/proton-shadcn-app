import { MainNav } from "./main-nav"
import Link from "next/link"
import Image from "next/image"

export function SiteHeader() {
  return (
    <header className="w-full border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light text-white mr-8">
              <Image 
                src="/proton logo.svg" 
                alt="Proton AI"
                width={120}
                height={36}
                priority
              />
            </Link>
            <MainNav />
          </div>
          <div>
            <Link 
              href="/settings" 
              className="text-sm font-light text-gray-400 hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 