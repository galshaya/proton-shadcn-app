import { MainNav } from "./main-nav"

export function SiteHeader() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="font-bold text-xl mr-8">PROTON</div>
          <MainNav />
        </div>
      </div>
    </header>
  )
} 