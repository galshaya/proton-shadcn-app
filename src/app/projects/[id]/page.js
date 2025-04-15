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
import { Upload, FileText, Plus, Settings, History, Edit, X } from "lucide-react";

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

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
          <p className="text-sm text-gray-400">{project.description}</p>
        </div>
        <Button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-[#e80566] hover:bg-[#c30552] text-white"
        >
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-300">Documents</CardTitle>
            <div className="text-2xl font-bold text-white">{documents.length}</div>
          </CardHeader>
        </Card>
        <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-300">Next Newsletter</CardTitle>
            <div className="text-2xl font-bold text-white">{formatDate(project.nextNewsletter)}</div>
          </CardHeader>
        </Card>
        <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-300">Scraping Packages</CardTitle>
            <div className="text-2xl font-bold text-white">{packages.length}</div>
          </CardHeader>
        </Card>
        <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-300">Last Updated</CardTitle>
            <div className="text-2xl font-bold text-white">{formatDate(project.lastUpdated)}</div>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1e1f23] border-b border-[#2d2e33] rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#e80566] rounded-none px-4 py-3 text-gray-300 data-[state=active]:text-white"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="newsletter"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#e80566] rounded-none px-4 py-3 text-gray-300 data-[state=active]:text-white"
          >
            Newsletter Settings
          </TabsTrigger>
          <TabsTrigger 
            value="scraping"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#e80566] rounded-none px-4 py-3 text-gray-300 data-[state=active]:text-white"
          >
            Scraping Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Documents</h2>
              <p className="text-sm text-gray-400">
                Manage project documents and files
              </p>
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-[#e80566] hover:bg-[#c30552] text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#2d2e33] rounded-md bg-[#1e1f23]">
              <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">No Documents Yet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Upload documents to get started with your project
              </p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-[#e80566] hover:bg-[#c30552] text-white"
              >
                Upload Document
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{doc.name}</h3>
                        <p className="text-sm text-gray-400">
                          {doc.size} • Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#2d2e33] text-white hover:bg-[#2d2e33] hover:text-white">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Newsletter Settings</h2>
            <p className="text-sm text-gray-400">
              Configure newsletter delivery schedule and settings
            </p>
          </div>

          <div className="bg-[#1e1f23] rounded-lg shadow-sm border border-[#2d2e33] p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Frequency & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Delivery Frequency</label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="bg-[#e80566] text-white">Weekly</Button>
                    <Button variant="outline" size="sm" className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">Bi-weekly</Button>
                    <Button variant="outline" size="sm" className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">Monthly</Button>
                    <Button variant="outline" size="sm" className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">Custom</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Send Time</label>
                  <Button variant="outline" className="w-full justify-between border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">
                    9:00 AM
                    <span className="text-gray-500">▼</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Day of Week</label>
                  <Button variant="outline" className="w-full justify-between border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">
                    Monday
                    <span className="text-gray-500">▼</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#e80566] hover:bg-[#c30552] text-white">Save Settings</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Sent Newsletters</h3>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search newsletters..."
                    className="pl-3 pr-8 py-2 text-sm border rounded-md"
                  />
                  <span className="absolute right-3 top-2.5">🔍</span>
                </div>
              </div>

              <div className="bg-[#1e1f23] rounded-lg shadow-sm border border-[#2d2e33] divide-y divide-[#2d2e33]">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-white">{newsletter.subject}</h4>
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
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Analytics Overview</h3>
              <div className="bg-[#1e1f23] rounded-lg shadow-sm border border-[#2d2e33] p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Average Open Rate</p>
                  <p className="text-2xl font-semibold text-white">68.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Average Click Rate</p>
                  <p className="text-2xl font-semibold text-white">38.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Total Subscribers</p>
                  <p className="text-2xl font-semibold text-white">{project.recipients}</p>
                </div>
                <Button variant="outline" className="w-full border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]">Download Report</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scraping" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Scraping Packages</h2>
              <p className="text-sm text-gray-400">
                Manage and configure content scraping packages
              </p>
            </div>
            <Button 
              onClick={() => {
                setSelectedPackage(null);
                setShowPackageModal(true);
              }}
              className="bg-[#e80566] hover:bg-[#c30552] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#2d2e33] rounded-md bg-[#1e1f23]">
              <h3 className="text-lg font-medium mb-2 text-white">No Scraping Packages Yet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Create a scraping package to automate content collection
              </p>
              <Button 
                onClick={() => {
                  setSelectedPackage(null);
                  setShowPackageModal(true);
                }}
                className="bg-[#e80566] hover:bg-[#c30552] text-white"
              >
                Add Package
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {packages.map((pkg) => (
                <Card className="bg-[#1e1f23] border-[#2d2e33] text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{pkg.name}</h3>
                          <Badge variant={pkg.status === "active" ? "default" : "secondary"} className={pkg.status === "active" ? "bg-[#e80566] text-white" : "bg-[#2d2e33] text-gray-300"}>
                            {pkg.status}
                          </Badge>
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
                          className="border-[#2d2e33] text-white hover:bg-[#2d2e33] hover:text-white"
                        >
                          <History className="h-4 w-4 mr-2" />
                          History
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConfigurePackage(pkg)}
                          className="border-[#2d2e33] text-white hover:bg-[#2d2e33] hover:text-white"
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
                          className="border-[#2d2e33] text-white hover:bg-[#2d2e33] hover:text-white"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              dragActive ? "border-[#e80566] bg-[#e80566]/5" : "border-[#2d2e33]"
            } bg-[#1e1f23]`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <p className="text-gray-400 mb-2">Drag and drop your file here, or</p>
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
                className="bg-[#e80566] hover:bg-[#c30552] text-white cursor-pointer"
              >
                Browse Files
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-4">Supported file types: PDF, DOCX, XLSX, CSV, TXT (Max 10MB)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="border border-[#2d2e33] rounded-md divide-y divide-[#2d2e33] bg-[#1e1f23]">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2d2e33]"
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
              className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33]"
            >
              Cancel
            </Button>
            <Button 
              disabled={uploadedFiles.length === 0}
              onClick={handleUploadDocument}
              className="bg-[#e80566] hover:bg-[#c30552] text-white disabled:bg-[#2d2e33] disabled:text-gray-500"
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