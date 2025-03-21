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
import { mockApi } from "@/lib/mock-data";
import { PersonaForm } from "@/components/forms/persona-form";
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form";
import { ScrapingPackageHistory } from "@/components/scraping-package-history";
import { Plus, Settings, History, Upload } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [personas, setPersonas] = useState([
    {
      id: 1,
      name: "General Persona",
      description: "Default persona for all recipients",
      recipientCount: 856,
      lastModified: "2h ago"
    },
    {
      id: 2,
      name: "Executives",
      description: "Specific adjustments for decision makers",
      recipientCount: 378,
      lastModified: "1d ago"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectData, documentsData, recipientsData, newslettersData] = await Promise.all([
        mockApi.getProject(id),
        mockApi.getProjectDocuments(id),
        mockApi.getProjectRecipients(id),
        mockApi.getProjectNewsletters(id),
      ]);

      setProject(projectData);
      setDocuments(documentsData);
      setRecipients(recipientsData);
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

  const handleCreatePersona = (data) => {
    const newPersona = {
      id: personas.length + 1,
      ...data,
    };
    setPersonas([...personas, newPersona]);
    setIsPersonaModalOpen(false);
  };

  const handleEditPersona = (data) => {
    const updatedPersonas = personas.map((persona) =>
      persona.id === selectedPersona.id ? { ...persona, ...data } : persona
    );
    setPersonas(updatedPersonas);
    setIsPersonaModalOpen(false);
    setSelectedPersona(null);
  };

  const handleConfigurePackage = (data) => {
    // Handle package configuration
    setShowConfigureModal(false);
    setSelectedPackage(null);
  };

  const handleUploadDocument = (files) => {
    // Handle document upload
    setShowUploadModal(false);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>Edit Project</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <div className="text-2xl font-bold">{project.documents}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Next Newsletter</CardTitle>
            <div className="text-2xl font-bold">{new Date(project.nextNewsletter).toLocaleDateString()}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <div className="text-2xl font-bold">{project.recipients}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <div className="text-2xl font-bold">{new Date(project.lastUpdated).toLocaleDateString()}</div>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border-b rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="newsletter"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
          >
            Newsletter Settings
          </TabsTrigger>
          <TabsTrigger 
            value="personas"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
          >
            Personas & Recipients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Documents</h2>
              <p className="text-sm text-muted-foreground">
                Manage project documents and files
              </p>
            </div>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Newsletter Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure newsletter delivery schedule and settings
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Frequency & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Delivery Frequency</label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Daily</Button>
                    <Button variant="outline" size="sm">Weekly</Button>
                    <Button variant="outline" size="sm">Monthly</Button>
                    <Button variant="outline" size="sm">Custom</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Send Time</label>
                  <Button variant="outline" className="w-full justify-between">
                    9:00 AM
                    <span className="text-muted-foreground">▼</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Day of Week</label>
                  <Button variant="outline" className="w-full justify-between">
                    Monday
                    <span className="text-muted-foreground">▼</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Settings</Button>
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

              <div className="bg-white rounded-lg shadow-sm border divide-y">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{newsletter.subject}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(newsletter.sentAt || newsletter.scheduledFor).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sent to {newsletter.recipients?.length || 0} recipients
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span>Open Rate: {newsletter.stats?.openRate || 0}%</span>
                      <span>Click Rate: {newsletter.stats?.clickRate || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Analytics Overview</h3>
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Open Rate</p>
                  <p className="text-2xl font-semibold">68.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Click Rate</p>
                  <p className="text-2xl font-semibold">38.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                  <p className="text-2xl font-semibold">{recipients.length}</p>
                </div>
                <Button variant="outline" className="w-full">Download Report</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Personas</h2>
              <p className="text-sm text-muted-foreground">
                Manage content personas and recipients
              </p>
            </div>
            <Button onClick={() => {
              setSelectedPersona(null)
              setIsPersonaModalOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Persona
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona) => (
              <div key={persona.id} className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{persona.name}</h3>
                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                  </div>
                  <Button variant="ghost" size="icon">⋮</Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipients</span>
                  <span className="font-medium">{persona.recipientCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium">{persona.lastModified}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedPersona(persona)
                    setIsPersonaModalOpen(true)
                  }}
                >
                  Edit Persona
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recipients</h3>
              <div className="flex gap-2">
                <Button variant="outline">Filter</Button>
                <Button>Add Recipients</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Persona</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recipients.map((recipient) => (
                      <tr key={recipient.id}>
                        <td className="p-4">{recipient.name}</td>
                        <td className="p-4">{recipient.email}</td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" className="w-40 justify-between">
                            {recipient.persona || "General Persona"}
                            <span className="text-muted-foreground">▼</span>
                          </Button>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={recipient.status || "active"} />
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">⋮</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing 1-10 of {recipients.length}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        isOpen={isPersonaModalOpen}
        onClose={() => {
          setIsPersonaModalOpen(false);
          setSelectedPersona(null);
        }}
        title={selectedPersona ? "Edit Persona" : "Create Persona"}
      >
        <PersonaForm
          persona={selectedPersona}
          recipients={recipients}
          onSubmit={selectedPersona ? handleEditPersona : handleCreatePersona}
          onCancel={() => {
            setIsPersonaModalOpen(false);
            setSelectedPersona(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showConfigureModal}
        onClose={() => {
          setShowConfigureModal(false);
          setSelectedPackage(null);
        }}
        title={selectedPackage ? "Configure Package" : "Add Package"}
      >
        <ScrapingPackageConfigForm
          config={selectedPackage}
          onSubmit={handleConfigurePackage}
          onCancel={() => {
            setShowConfigureModal(false);
            setSelectedPackage(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedPackage(null);
        }}
        title="Package History"
      >
        <ScrapingPackageHistory history={[]} />
      </Modal>

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your files here, or click to select files
            </p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleUploadDocument(e.target.files)}
              multiple
            />
            <Button variant="outline">Select Files</Button>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 