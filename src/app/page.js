"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ApiStatus } from "@/components/api-status"

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
    <div>
      <div className="mb-12">
        <div className="flex justify-between items-start">
          <div>
            <Image
              src="/proton.svg"
              alt="Proton"
              width={240}
              height={72}
              className="mb-6"
              priority
            />
            <h1 className="text-3xl font-light tracking-tight mb-2">AI Signal Intelligence</h1>
            <p className="text-gray-400">Distinguishing signal from noise for strategic decision making</p>
          </div>
          <div className="w-64">
            <ApiStatus />
          </div>
        </div>
      </div>
      {/* // life is okay */}
      <div className="space-y-10">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-light">Active Clients</p>
              <div className="text-2xl font-light">8</div>
              <p className="text-xs text-gray-500 font-light">Currently monitoring</p>
            </div>
          </div>
          <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-light">Weekly Insights</p>
              <div className="text-2xl font-light">24</div>
              <p className="text-xs text-gray-500 font-light">Generated this week</p>
            </div>
          </div>
          <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-light">Content Sources</p>
              <div className="text-2xl font-light">156</div>
              <p className="text-xs text-gray-500 font-light">RSS feeds & APIs</p>
            </div>
          </div>
          <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-light">AI Models</p>
              <div className="text-2xl font-light">3</div>
              <p className="text-xs text-gray-500 font-light">Active processing chains</p>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light">Active Client Projects</h2>
            <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 font-light">
              View All Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <h3 className="text-lg font-light mb-1">Advent Health</h3>
              <p className="text-sm text-gray-400 mb-6 font-light">Healthcare Innovation Monitoring</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Last Updated</span>
                  <span className="text-sm font-light">2025-01-15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Sources</span>
                  <span className="text-sm font-light">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Next Report</span>
                  <span className="text-sm font-light">2025-01-20</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <h3 className="text-lg font-light mb-1">Mars Pet Nutrition</h3>
              <p className="text-sm text-gray-400 mb-6 font-light">Pet Care Industry Intelligence</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Last Updated</span>
                  <span className="text-sm font-light">2025-01-14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Sources</span>
                  <span className="text-sm font-light">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-light">Next Report</span>
                  <span className="text-sm font-light">2025-01-19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
