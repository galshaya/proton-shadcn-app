"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"

export default function ClientLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = sessionStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")
    setIsLoading(false)

    // If not authenticated and not on login page, redirect to login
    if (authStatus !== "true" && pathname !== "/login") {
      router.push("/login")
    }
  }, [pathname, router])

  // Show loading state
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // If on login page or authenticated, show content
  if (pathname === "/login" || isAuthenticated) {
    return (
      <>
        {/* Only show header if not on login page */}
        {pathname !== "/login" && <SiteHeader />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </>
    )
  }

  // Default case - should not reach here due to redirect
  return null
}
