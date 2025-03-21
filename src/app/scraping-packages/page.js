"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal } from "@/components/ui/modal"
import { PersonaForm } from "@/components/forms/persona-form"
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form"
import { ScrapingPackageHistory } from "@/components/scraping-package-history"
import { Plus, Settings, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ScrapingPackagesPage() {
  const [activeTab, setActiveTab] = useState("packages")
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showPersonaModal, setShowPersonaModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPersona, setSelectedPersona] = useState(null)

  // Mock data
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Industry News",
      description: "Scrapes industry news websites",
      status: "active",
      lastRun: "2024-03-15",
      nextRun: "2024-03-16",
    },
    {
      id: 2,
      name: "Competitor Blogs",
      description: "Monitors competitor blog posts",
      status: "active",
      lastRun: "2024-03-14",
      nextRun: "2024-03-15",
    },
  ])

  const [personas, setPersonas] = useState([
    { id: 1, name: "Executive", description: "For C-level executives", recipients: [1, 2] },
    { id: 2, name: "Manager", description: "For middle management", recipients: [3, 4] },
  ])

  const [recipients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", email: "alice@example.com" },
  ])

  const handleCreatePackage = (data) => {
    const newPackage = {
      id: packages.length + 1,
      ...data,
      status: "active",
      lastRun: null,
      nextRun: data.schedule?.time,
    }
    setPackages([...packages, newPackage])
    setShowPackageModal(false)
  }

  const handleEditPackage = (data) => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === selectedPackage.id ? { ...pkg, ...data } : pkg
    )
    setPackages(updatedPackages)
    setShowPackageModal(false)
    setSelectedPackage(null)
  }

  const handleCreatePersona = (data) => {
    const newPersona = {
      id: personas.length + 1,
      ...data,
    }
    setPersonas([...personas, newPersona])
    setShowPersonaModal(false)
  }

  const handleEditPersona = (data) => {
    const updatedPersonas = personas.map((persona) =>
      persona.id === selectedPersona.id ? { ...persona, ...data } : persona
    )
    setPersonas(updatedPersonas)
    setShowPersonaModal(false)
    setSelectedPersona(null)
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Scraping Packages</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Scraping Packages</h2>
            <Button onClick={() => setShowPackageModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          <div className="grid gap-4">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{pkg.name}</h3>
                        <Badge
                          variant={pkg.status === "active" ? "default" : "secondary"}
                        >
                          {pkg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pkg.description}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {pkg.lastRun && (
                          <span>Last run: {new Date(pkg.lastRun).toLocaleDateString()}</span>
                        )}
                        {pkg.nextRun && (
                          <span className="ml-4">
                            Next run: {new Date(pkg.nextRun).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg)
                          setShowPackageModal(true)
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg)
                          setShowHistoryModal(true)
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Personas</h2>
            <Button onClick={() => setShowPersonaModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Persona
            </Button>
          </div>

          <div className="grid gap-4">
            {personas.map((persona) => (
              <Card key={persona.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{persona.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {persona.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">
                          {persona.recipients.length} recipients
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPersona(persona)
                        setShowPersonaModal(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Package Modal */}
      <Modal
        isOpen={showPackageModal}
        onClose={() => {
          setShowPackageModal(false)
          setSelectedPackage(null)
        }}
        title={selectedPackage ? "Configure Package" : "Add Package"}
      >
        <ScrapingPackageConfigForm
          config={selectedPackage}
          onSubmit={selectedPackage ? handleEditPackage : handleCreatePackage}
          onCancel={() => {
            setShowPackageModal(false)
            setSelectedPackage(null)
          }}
        />
      </Modal>

      {/* Persona Modal */}
      <Modal
        isOpen={showPersonaModal}
        onClose={() => {
          setShowPersonaModal(false)
          setSelectedPersona(null)
        }}
        title={selectedPersona ? "Edit Persona" : "Create Persona"}
      >
        <PersonaForm
          persona={selectedPersona}
          recipients={recipients}
          onSubmit={selectedPersona ? handleEditPersona : handleCreatePersona}
          onCancel={() => {
            setShowPersonaModal(false)
            setSelectedPersona(null)
          }}
        />
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedPackage(null)
        }}
        title="Package History"
      >
        <ScrapingPackageHistory
          history={[
            {
              status: "success",
              startTime: "2024-03-15T09:00:00",
              duration: 45,
              documentsFound: 12,
              message: "Successfully scraped 12 documents",
            },
            {
              status: "failed",
              startTime: "2024-03-14T09:00:00",
              duration: 15,
              documentsFound: 0,
              message: "Connection timeout",
            },
          ]}
        />
      </Modal>
    </div>
  )
} 