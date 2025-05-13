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
import apiClient from "@/lib/apiClient"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await apiClient.projects.getAll()
        setProjects(data)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

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

  const handleCreateProject = async (projectData) => {
    try {
      setIsLoading(true)
      const newProject = await apiClient.projects.create(projectData)
      setProjects([...projects, newProject])
      setShowCreateModal(false)
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Failed to create project: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProject = async (projectData) => {
    try {
      setIsLoading(true)
      const updatedProject = await apiClient.projects.update(selectedProject.id, projectData)

      const updatedProjects = projects.map(project =>
        project.id === selectedProject.id ? updatedProject : project
      )

      setProjects(updatedProjects)
      setShowEditModal(false)
      setSelectedProject(null)
    } catch (err) {
      console.error("Error updating project:", err)
      alert("Failed to update project: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    try {
      setIsLoading(true)
      await apiClient.projects.delete(selectedProject.id)

      const updatedProjects = projects.filter(project => project.id !== selectedProject.id)
      setProjects(updatedProjects)
      setShowDeleteDialog(false)
      setSelectedProject(null)
    } catch (err) {
      console.error("Error deleting project:", err)
      alert("Failed to delete project: " + err.message)
    } finally {
      setIsLoading(false)
    }
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
          disabled={isLoading}
        >
          Create Project
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 bg-[#111] rounded-lg border border-gray-800">
          <div className="animate-pulse">Loading projects...</div>
        </div>
      )}

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
                  {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
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