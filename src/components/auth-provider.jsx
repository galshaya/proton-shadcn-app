"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Create authentication context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem("isAuthenticated")
      setIsAuthenticated(authStatus === "true")
      setIsLoading(false)
    }

    checkAuth()
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth)
    
    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("isAuthenticated")
    setIsAuthenticated(false)
    router.push("/login")
  }

  // Login function
  const login = () => {
    sessionStorage.setItem("isAuthenticated", "true")
    setIsAuthenticated(true)
  }

  // Provide authentication context to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
