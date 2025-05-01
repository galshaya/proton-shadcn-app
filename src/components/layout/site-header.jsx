"use client"

import { MainNav } from "./main-nav"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function SiteHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Remove authentication from session storage
    sessionStorage.removeItem("isAuthenticated")

    // Show success toast
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })

    // Redirect to login page
    router.push("/login")
  }

  return (
    <header className="w-full border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light text-white mr-8">
              <span className="text-white font-light text-2xl">proton</span>
            </Link>
            <MainNav />
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/settings"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Settings
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}