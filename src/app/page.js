import Link from "next/link"
import { Card } from "@/components/ui/card"

// Mock data for demonstration
const metrics = [
  {
    title: "Total Projects",
    value: "12",
    description: "Active projects in the system",
  },
  {
    title: "Total Recipients",
    value: "1,234",
    description: "Newsletter subscribers",
  },
  {
    title: "Total Documents",
    value: "456",
    description: "Uploaded documents",
  },
  {
    title: "Total Packages",
    value: "8",
    description: "Scraping packages",
  },
]

const recentProjects = [
  {
    id: 1,
    name: "Marketing Campaign 2025",
    description: "Q1 Marketing Strategy Analysis",
    lastUpdated: "2024-03-20",
    documentCount: 5,
    nextNewsletter: "2024-03-25",
  },
  {
    id: 2,
    name: "Product Launch",
    description: "New Product Line Analysis",
    lastUpdated: "2024-03-19",
    documentCount: 3,
    nextNewsletter: "2024-03-24",
  },
]

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-md border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Projects</p>
            <div className="text-2xl font-medium">12</div>
            <p className="text-xs text-gray-500">Active projects in the system</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Recipients</p>
            <div className="text-2xl font-medium">1,234</div>
            <p className="text-xs text-gray-500">Newsletter subscribers</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Documents</p>
            <div className="text-2xl font-medium">456</div>
            <p className="text-xs text-gray-500">Uploaded documents</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Packages</p>
            <div className="text-2xl font-medium">8</div>
            <p className="text-xs text-gray-500">Scraping packages</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Projects</h2>
          <a href="/projects" className="text-sm text-blue-600 hover:underline">View All Projects</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="font-medium">Marketing Campaign 2025</h3>
            <p className="text-sm text-gray-500 mb-4">Marketing Strategy Analysis</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm">2024-03-20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Documents:</span>
                <span className="text-sm">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Next Newsletter:</span>
                <span className="text-sm">2024-03-25</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="font-medium">Product Launch</h3>
            <p className="text-sm text-gray-500 mb-4">New Product Line Analysis</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm">2024-03-19</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Documents:</span>
                <span className="text-sm">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Next Newsletter:</span>
                <span className="text-sm">2024-03-24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
