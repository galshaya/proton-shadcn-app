"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ProjectForm } from "@/components/forms/project-form";
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form";
import { mockApi } from "@/lib/mock-data";
import { Upload, FileText, Plus, Settings, History, Edit, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchNewsletter, setSearchNewsletter] = useState("");

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectData, documentsData, packagesData, personasData, newslettersData] = await Promise.all([
        mockApi.getProject(id),
        mockApi.getProjectDocuments(id),
        mockApi.getProjectPackages(id),
        mockApi.getPersonas(),
        mockApi.getProjectNewsletters(id),
      ]);

      setProject(projectData);
      setDocuments(documentsData);
      setPackages(packagesData);
      setPersonas(personasData);
      setNewsletters(newslettersData);
    } catch (error) {
      console.error("Error loading project data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (formData) => {
    try {
      const updatedProject = await mockApi.updateProject(id, formData);
      setProject(updatedProject);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleCreatePackage = (formData) => {
    const newPackage = {
      id: "pkg_" + Math.random().toString(36).substring(2, 9),
      ...formData,
      projectId: id,
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: formData.schedule?.date || null,
      status: "active"
    };
    setPackages([...packages, newPackage]);
    setShowPackageModal(false);
  }

  const handleEditPackage = (formData) => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === selectedPackage.id ? { ...pkg, ...formData } : pkg
    );
    setPackages(updatedPackages);
    setSelectedPackage(null);
    setShowPackageModal(false);
  }

  const handleConfigurePackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowConfigureModal(true);
  }

  const handleViewHistory = (pkg) => {
    setSelectedPackage(pkg);
    setShowHistoryModal(true);
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: "file_" + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleUploadDocument = () => {
    // Simulate upload and add to documents
    const newDocs = uploadedFiles.map(file => ({
      id: "doc_" + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }));
    
    setDocuments([...documents, ...newDocs]);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  const filteredNewsletters = newsletters.filter(newsletter => 
    newsletter.subject.toLowerCase().includes(searchNewsletter.toLowerCase())
  );

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-light">{project.name}</h1>
          <p className="text-sm text-gray-400">{project.description}</p>
        </div>
        <Button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Documents</p>
            <div className="text-2xl font-light">{documents.length}</div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Next Newsletter</p>
            <div className="text-2xl font-light">{formatDate(project.nextNewsletter)}</div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Scraping Packages</p>
            <div className="text-2xl font-light">{packages.length}</div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Last Updated</p>
            <div className="text-2xl font-light">{formatDate(project.lastUpdated)}</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger 
            value="documents"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="newsletter"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Newsletter Settings
          </TabsTrigger>
          <TabsTrigger 
            value="scraping"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Scraping Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-light">Documents</h2>
              <p className="text-sm text-gray-400">
                Manage project documents and files
              </p>
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-md bg-[#111]">
              <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-light mb-2">No Documents Yet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Upload documents to get started with your project
              </p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-white text-black hover:bg-gray-200 font-light"
              >
                Upload Document
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-light text-white">{doc.name}</h3>
                      <p className="text-sm text-gray-400">
                        {doc.size} • Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-light">Newsletter Settings</h2>
            <p className="text-sm text-gray-400">
              Configure newsletter delivery schedule and settings
            </p>
          </div>

          <div className="bg-[#111] rounded-lg border border-gray-800 p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Frequency & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-light">Delivery Frequency</label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-200 font-light">Weekly</Button>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light">Bi-weekly</Button>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light">Monthly</Button>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light">Custom</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-light">Send Time</label>
                  <Button variant="outline" className="w-full justify-between border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light">
                    9:00 AM
                    <span className="text-gray-500">▼</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-light">Day of Week</label>
                  <Button variant="outline" className="w-full justify-between border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light">
                    Monday
                    <span className="text-gray-500">▼</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-white text-black hover:bg-gray-200 font-light">Save Settings</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-light">Sent Newsletters</h3>
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search newsletters..."
                    className="pl-8 bg-[#111] border-gray-800 text-white"
                    value={searchNewsletter}
                    onChange={(e) => setSearchNewsletter(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#111] rounded-lg border border-gray-800 divide-y divide-gray-800">
                {filteredNewsletters.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No newsletters found
                  </div>
                ) : (
                  filteredNewsletters.map((newsletter) => (
                    <div key={newsletter.id} className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-light text-white">{newsletter.subject}</h4>
                        <span className="text-sm text-gray-400">
                          {formatDate(newsletter.sentAt || newsletter.scheduledFor)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Sent to {newsletter.recipients} recipients
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-300">Open Rate: {newsletter.stats?.openRate || 0}%</span>
                        <span className="text-gray-300">Click Rate: {newsletter.stats?.clickRate || 0}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-light">Analytics Overview</h3>
              <div className="bg-[#111] rounded-lg border border-gray-800 p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Average Open Rate</p>
                  <p className="text-2xl font-light">68.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Average Click Rate</p>
                  <p className="text-2xl font-light">38.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Total Subscribers</p>
                  <p className="text-2xl font-light">{project.recipients}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                >
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scraping" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-light">Scraping Packages</h2>
              <p className="text-sm text-gray-400">
                Manage and configure content scraping packages
              </p>
            </div>
            <Button 
              onClick={() => {
                setSelectedPackage(null);
                setShowPackageModal(true);
              }}
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-md bg-[#111]">
              <h3 className="text-lg font-light mb-2">No Scraping Packages Yet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Create a scraping package to automate content collection
              </p>
              <Button 
                onClick={() => {
                  setSelectedPackage(null);
                  setShowPackageModal(true);
                }}
                className="bg-white text-black hover:bg-gray-200 font-light"
              >
                Add Package
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-light text-white">{pkg.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                          pkg.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                        }`}>
                          {pkg.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {pkg.description}
                      </p>
                      <div className="flex gap-4 text-sm mt-3">
                        <span className="text-gray-400">
                          Last run: {pkg.lastRun ? formatDate(pkg.lastRun) : "Never"}
                        </span>
                        <span className="text-gray-400">
                          Next run: {formatDate(pkg.nextRun)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewHistory(pkg)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigurePackage(pkg)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowPackageModal(true);
                        }}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              dragActive ? "border-gray-600 bg-gray-900/10" : "border-gray-800"
            } bg-[#111]`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <p className="text-gray-400 mb-2 font-light">Drag and drop your file here, or</p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="file-input">
              <Button 
                as="span"
                className="bg-white text-black hover:bg-gray-200 font-light cursor-pointer"
              >
                Browse Files
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-4">Supported file types: PDF, DOCX, XLSX, CSV, TXT (Max 10MB)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="border border-gray-800 rounded-md divide-y divide-gray-800 bg-[#111]">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-light text-white">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setUploadedFiles([]);
                setShowUploadModal(false);
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
            >
              Cancel
            </Button>
            <Button 
              disabled={uploadedFiles.length === 0}
              onClick={handleUploadDocument}
              className="bg-white text-black hover:bg-gray-200 font-light disabled:bg-gray-800 disabled:text-gray-500"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPackageModal}
        onClose={() => {
          setShowPackageModal(false);
          setSelectedPackage(null);
        }}
        title={selectedPackage ? "Edit Scraping Package" : "Create Scraping Package"}
      >
        <ScrapingPackageConfigForm
          scrapingPackage={selectedPackage}
          personas={personas}
          onSubmit={selectedPackage ? handleEditPackage : handleCreatePackage}
          onCancel={() => {
            setShowPackageModal(false);
            setSelectedPackage(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showConfigureModal}
        onClose={() => {
          setShowConfigureModal(false);
          setSelectedPackage(null);
        }}
        title={`Configure ${selectedPackage?.name || 'Scraping Package'}`}
      >
        <ScrapingPackageConfigForm
          scrapingPackage={selectedPackage}
          personas={personas}
          onSubmit={(formData) => {
            const updatedPackages = packages.map((pkg) =>
              pkg.id === selectedPackage.id ? { ...pkg, ...formData } : pkg
            );
            setPackages(updatedPackages);
            setSelectedPackage(null);
            setShowConfigureModal(false);
          }}
          onCancel={() => {
            setShowConfigureModal(false);
            setSelectedPackage(null);
          }}
        />
      </Modal>
    </div>
  );
} 