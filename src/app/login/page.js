"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (isAuthenticated === "true") {
      router.push("/")
    }
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Hard-coded password check
    if (password === "Pr*0t*0n!!!") {
      // Set authentication in session storage
      sessionStorage.setItem("isAuthenticated", "true")
      
      // Show success toast
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })
      
      // Redirect to home page
      router.push("/")
    } else {
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid password. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md space-y-8 bg-[#111] p-8 rounded-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Proton Newsletter Creator</h1>
          <p className="mt-2 text-gray-400">Enter the password to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  )
}
