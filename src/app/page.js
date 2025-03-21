import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
          <p className="mt-2 text-3xl font-semibold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">Active projects in the system</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Recipients</h3>
          <p className="mt-2 text-3xl font-semibold text-foreground">1,234</p>
          <p className="text-sm text-muted-foreground">Newsletter subscribers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Documents</h3>
          <p className="mt-2 text-3xl font-semibold text-foreground">456</p>
          <p className="text-sm text-muted-foreground">Uploaded documents</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Packages</h3>
          <p className="mt-2 text-3xl font-semibold text-foreground">8</p>
          <p className="text-sm text-muted-foreground">Scraping packages</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">Recent Projects</h2>
          <Button variant="outline" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Marketing Campaign 2025</h3>
              <p className="text-muted-foreground">Q1 Marketing Strategy Analysis</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Updated:</p>
                <p className="font-medium">2024-03-20</p>
              </div>
              <div>
                <p className="text-muted-foreground">Documents:</p>
                <p className="font-medium">5</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Newsletter:</p>
                <p className="font-medium">2024-03-25</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Product Launch</h3>
              <p className="text-muted-foreground">New Product Line Analysis</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Updated:</p>
                <p className="font-medium">2024-03-19</p>
              </div>
              <div>
                <p className="text-muted-foreground">Documents:</p>
                <p className="font-medium">3</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Newsletter:</p>
                <p className="font-medium">2024-03-24</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
