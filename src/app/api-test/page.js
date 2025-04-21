"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { testCreatePackage, testUpdatePackage, testDeletePackage, testGetPackages } from "@/lib/api-test"

export default function ApiTestPage() {
  const [result, setResult] = useState(null)
  const [packageId, setPackageId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateTest = async () => {
    setIsLoading(true)
    try {
      const result = await testCreatePackage()
      setResult(result)
      
      // If successful and we got an ID, set it for easy testing
      if (result.success && result.data && result.data._id) {
        setPackageId(result.data._id)
      }
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTest = async () => {
    if (!packageId) {
      setResult({ error: "Please enter a package ID" })
      return
    }

    setIsLoading(true)
    try {
      const result = await testUpdatePackage(packageId)
      setResult(result)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTest = async () => {
    if (!packageId) {
      setResult({ error: "Please enter a package ID" })
      return
    }

    setIsLoading(true)
    try {
      const result = await testDeletePackage(packageId)
      setResult(result)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetTest = async () => {
    setIsLoading(true)
    try {
      const result = await testGetPackages()
      setResult(result)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-light mb-6">API Test Page</h1>
      
      <div className="bg-[#111] p-6 rounded border border-gray-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="packageId">Package ID</Label>
          <div className="flex space-x-2">
            <Input
              id="packageId"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="Enter package ID for update/delete tests"
              className="bg-[#1a1a1a] border-gray-800 text-white"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleCreateTest}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Test Create Package
          </Button>
          
          <Button 
            onClick={handleUpdateTest}
            disabled={isLoading || !packageId}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Test Update Package
          </Button>
          
          <Button 
            onClick={handleDeleteTest}
            disabled={isLoading || !packageId}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Test Delete Package
          </Button>
          
          <Button 
            onClick={handleGetTest}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Test Get All Packages
          </Button>
        </div>
      </div>
      
      {result && (
        <div className="bg-[#111] p-6 rounded border border-gray-800">
          <h2 className="text-xl font-light mb-4">Result</h2>
          <div className="bg-[#1a1a1a] p-4 rounded overflow-auto max-h-96">
            <pre className="text-white whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="bg-[#111] p-6 rounded border border-gray-800">
        <h2 className="text-xl font-light mb-4">Console Output</h2>
        <p className="text-gray-400">
          Check your browser's developer console (F12) for detailed API request and response logs.
        </p>
      </div>
    </div>
  )
}
