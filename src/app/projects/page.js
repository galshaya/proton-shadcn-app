"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { ProjectForm } from "@/components/forms/project-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState([
    { id: "proj_1", name: "AI-driven content analysis", description: "Automated content evaluation for market trends", status: "active", lastUpdated: "2024-03-15" },
    { id: "proj_2", name: "Market research automation", description: "Competitor analysis in retail sector", status: "archived", lastUpdated: "2024-03-14" },
    { id: "proj_3", name: "Customer feedback analysis", description: "Sentiment analysis of survey responses", status: "active", lastUpdated: "2024-03-13" },
  ])
  const [searchInput, setSearchInput] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // Filter projects based on search input
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    project.description.toLowerCase().includes(searchInput.toLowerCase())
  )

  // Calculate pagination
  const totalProjects = filteredProjects.length
  const totalPages = Math.ceil(totalProjects / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  const handleCreateProject = (projectData) => {
    const newProject = {
      id: "proj_" + Math.random().toString(36).substring(2, 9),
      ...projectData,
      lastUpdated: new Date().toISOString().split("T")[0]
    }
    setProjects([...projects, newProject])
    setShowCreateModal(false)
  }

  const handleEditProject = (projectData) => {
    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id
        ? { ...project, ...projectData, lastUpdated: new Date().toISOString().split("T")[0] }
        : project
    )
    setProjects(updatedProjects)
    setShowEditModal(false)
    setSelectedProject(null)
  }

  const handleDeleteProject = () => {
    const updatedProjects = projects.filter(project => project.id !== selectedProject.id)
    setProjects(updatedProjects)
    setShowDeleteDialog(false)
    setSelectedProject(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Projects</h1>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          Create Project
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm bg-[#111] border-gray-800 text-white"
        />
        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
          <SelectTrigger className="w-[140px] bg-[#111] border-gray-800 text-white font-light">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-gray-800 text-white">
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="20">20 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded border border-gray-800 bg-black overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-left text-sm font-light text-gray-400">Name</th>
              <th className="px-6 py-3 text-left text-sm font-light text-gray-400">Description</th>
              <th className="px-6 py-3 text-left text-sm font-light text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-sm font-light text-gray-400">Last Updated</th>
              <th className="px-6 py-3 text-left text-sm font-light text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id} className="border-b border-gray-800 hover:bg-[#0a0a0a] cursor-pointer">
                <td 
                  className="px-6 py-4 text-sm"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  {project.name}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-gray-400"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  {project.description}
                </td>
                <td 
                  className="px-6 py-4"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                    project.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td 
                  className="px-6 py-4 text-sm text-gray-400"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  {project.lastUpdated}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProject(project)
                        setShowEditModal(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-900/30 text-red-400 hover:bg-red-900/50 font-light"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProject(project)
                        setShowDeleteDialog(true)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400 font-light">
            Showing {startIndex + 1} to {Math.min(endIndex, totalProjects)} of {totalProjects} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Project"
      >
        <ProjectForm onSubmit={handleCreateProject} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProject(null)
        }}
        title="Edit Project"
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={handleEditProject}
          onCancel={() => {
            setShowEditModal(false)
            setSelectedProject(null)
          }}
        />
      </Modal>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#111] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project
              and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false)
              setSelectedProject(null)
            }}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}
              className="bg-red-900/30 text-red-400 hover:bg-red-900/50 font-light"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 