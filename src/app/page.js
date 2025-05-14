"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ApiStatus } from "@/components/api-status"
import { formatDate } from "@/lib/utils"
import apiClient from "@/lib/apiClient"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [scrapingPackages, setScrapingPackages] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch projects
        const projectsData = await apiClient.projects.getAll();
        setProjects(projectsData);

        // Fetch scraping packages
        const packagesData = await apiClient.scrapingPackages.getAll();
        setScrapingPackages(packagesData);

        // Fetch personas
        const personasData = await apiClient.personas.getAll();
        setPersonas(personasData);

        // Fetch newsletters from all projects
        let allNewsletters = [];
        for (const project of projectsData) {
          try {
            const projectNewsletters = await apiClient.newslettersArchive.getAll(project.id);
            allNewsletters = [...allNewsletters, ...projectNewsletters];
          } catch (error) {
            console.error(`Failed to fetch newsletters for project ${project.id}:`, error);
          }
        }
        setNewsletters(allNewsletters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-400">Loading data...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-light">Projects</p>
                <div className="text-2xl font-light">{projects.length}</div>
                <p className="text-xs text-gray-500 font-light">Active projects</p>
              </div>
            </div>
            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-light">Newsletters</p>
                <div className="text-2xl font-light">{newsletters.length}</div>
                <p className="text-xs text-gray-500 font-light">Created newsletters</p>
              </div>
            </div>
            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-light">Scraping Packages</p>
                <div className="text-2xl font-light">{scrapingPackages.length}</div>
                <p className="text-xs text-gray-500 font-light">Content sources</p>
              </div>
            </div>
            <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-light">Personas</p>
                <div className="text-2xl font-light">{personas.length}</div>
                <p className="text-xs text-gray-500 font-light">AI personalities</p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">Active Projects</h2>
              <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 font-light">
                View All Projects
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="bg-[#111] p-8 rounded border border-gray-800 text-center">
                <p className="text-gray-400">No projects found. Create your first project to get started.</p>
                <Link href="/projects" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <h3 className="text-lg font-light mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 font-light">{project.description || "No description"}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 font-light">Created</span>
                        <span className="text-sm font-light">{formatDate(project.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 font-light">Last Updated</span>
                        <span className="text-sm font-light">{formatDate(project.updated_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 font-light">Status</span>
                        <span className={`text-sm font-light px-2 py-0.5 rounded-full ${
                          project.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                        }`}>
                          {project.status || "active"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
