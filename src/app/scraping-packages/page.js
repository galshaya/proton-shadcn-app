"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal } from "@/components/ui/modal"
import { PersonaForm } from "@/components/forms/persona-form"
import { RecipientForm } from "@/components/forms/recipient-form"
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form"
import { ScrapingPackageHistory } from "@/components/scraping-package-history"
import { Plus, Settings, History, Edit, MoreHorizontal, Users, UserCircle, Trash, Search, RefreshCw, Calendar, Mail, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { mockApi } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { PlusCircle, Edit2, Eye, Clock, MailCheck, Check, X } from "lucide-react"
import { format, parseISO } from "date-fns"

export default function ScrapingPackagesPage() {
  const [activeTab, setActiveTab] = useState("packages")
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showPersonaModal, setShowPersonaModal] = useState(false)
  const [showRecipientModal, setShowRecipientModal] = useState(false)
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [packages, setPackages] = useState([])
  const [personas, setPersonas] = useState([])
  const [recipients, setRecipients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [packageSearch, setPackageSearch] = useState("")
  const [personaSearch, setPersonaSearch] = useState("")
  const [recipientSearch, setRecipientSearch] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [packagesData, personasData, recipientsData] = await Promise.all([
        mockApi.getScrapingPackages(),
        mockApi.getPersonas(),
        mockApi.getRecipients(),
      ])

      setPackages(packagesData || [])
      setPersonas(personasData || [])
      setRecipients(recipientsData || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePackage = (formData) => {
    const newPackage = {
      id: "pkg_" + Math.random().toString(36).substring(2, 9),
      ...formData,
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: formData.schedule?.date || null,
      status: "active"
    }
    setPackages([...packages, newPackage])
    setShowPackageModal(false)
  }

  const handleEditPackage = (formData) => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === selectedPackage.id ? { ...pkg, ...formData } : pkg
    )
    setPackages(updatedPackages)
    setSelectedPackage(null)
    setShowPackageModal(false)
  }

  const handleCreatePersona = (formData) => {
    const newPersona = {
      id: "pers_" + Math.random().toString(36).substring(2, 9),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "active"
    }
    setPersonas([...personas, newPersona])
    setShowPersonaModal(false)
  }

  const handleEditPersona = (formData) => {
    const updatedPersonas = personas.map((persona) =>
      persona.id === selectedPersona.id ? { ...persona, ...formData } : persona
    )
    setPersonas(updatedPersonas)
    setSelectedPersona(null)
    setShowPersonaModal(false)
  }

  const handleCreateRecipient = (formData) => {
    const newRecipient = {
      id: "rec_" + Math.random().toString(36).substring(2, 9),
      ...formData,
      createdAt: new Date().toISOString()
    }
    setRecipients([...recipients, newRecipient])
    setShowRecipientModal(false)
  }

  const handleEditRecipient = (formData) => {
    const updatedRecipients = recipients.map((recipient) =>
      recipient.id === selectedRecipient.id ? { ...recipient, ...formData } : recipient
    )
    setRecipients(updatedRecipients)
    setSelectedRecipient(null)
    setShowRecipientModal(false)
  }

  const handleConfigurePackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowConfigureModal(true)
  }

  const handleViewHistory = (pkg) => {
    setSelectedPackage(pkg)
    setShowHistoryModal(true)
  }

  const handleManageRecipients = (persona) => {
    setSelectedPersona(persona)
    setShowRecipientModal(true)
  }

  const getPersonaRecipients = (personaId) => {
    return recipients.filter(recipient => recipient.persona === personaId)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled"
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(packageSearch.toLowerCase())
  )

  const filteredPersonas = personas.filter(persona => 
    persona.name.toLowerCase().includes(personaSearch.toLowerCase())
  )

  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
    recipient.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    (recipient.company && recipient.company.toLowerCase().includes(recipientSearch.toLowerCase()))
  )

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl text-white">
      <h1 className="text-3xl font-bold mb-6">Content Sources</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">Scraping Packages</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                className="pl-8"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedPackage(null)
                setShowPackageModal(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#1e1f23] rounded-lg border border-[#2d2e33]">
                <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Packages Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create your first scraping package to get started
                </p>
                <Button 
                  onClick={() => setShowPackageModal(true)} 
                  className="bg-[#e80566] hover:bg-[#c30552] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="bg-[#1e1f23] border-[#2d2e33]">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{pkg.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {pkg.description}
                        </CardDescription>
                      </div>
                      <Badge className={`
                        ${pkg.status === "active" ? "bg-green-600" : 
                        pkg.status === "paused" ? "bg-yellow-600" : 
                        "bg-gray-600"} text-white`}
                      >
                        {pkg.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last run:</span>
                        <span className="text-gray-300">{formatDate(pkg.lastRun)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next run:</span>
                        <span className="text-gray-300">{formatDate(pkg.nextRun)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Items processed:</span>
                        <span className="text-gray-300">{pkg.itemsProcessed}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-[#2d2e33] pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewHistory(pkg)}
                      className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
                    >
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditPackage(pkg)}
                      className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search personas..."
                className="pl-8"
                value={personaSearch}
                onChange={(e) => setPersonaSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedPersona(null)
                setShowPersonaModal(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Persona
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonas.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#1e1f23] rounded-lg border border-[#2d2e33]">
                <UserCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Personas Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create your first persona to get started
                </p>
                <Button 
                  onClick={() => {
                    setSelectedPersona(null)
                    setShowPersonaModal(true)
                  }}
                  className="bg-[#e80566] hover:bg-[#c30552] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Persona
                </Button>
              </div>
            ) : (
              filteredPersonas.map((persona) => {
                const personaRecipients = getPersonaRecipients(persona.id)
                return (
                  <Card key={persona.id} className="bg-[#1e1f23] border-[#2d2e33]">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{persona.name}</CardTitle>
                        <Badge className="bg-[#e80566] text-white">{personaRecipients.length} Recipients</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        {persona.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-gray-300">{persona.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created:</span>
                          <span className="text-gray-300">{formatDate(persona.createdAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-[#2d2e33] pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleManageRecipients(persona)}
                        className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Recipients
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditPersona(persona)}
                        className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipients..."
                className="pl-8"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRecipient(null)
                setShowRecipientModal(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipients.map((recipient) => (
              <Card key={recipient.id} className="bg-[#1e1f23] border-[#2d2e33]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{recipient.name}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedRecipient(recipient)
                        setShowRecipientModal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{recipient.email}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm">
                    <MailCheck className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">Newsletters: {recipient.newsletterCount || 0}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Badge className={recipient.status === "active" ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                    {recipient.status}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showPackageModal && (
        <Modal
          title={selectedPackage ? "Edit Package" : "New Package"}
          isOpen={showPackageModal}
          onClose={() => setShowPackageModal(false)}
          className="bg-[#1e1f23] text-white border-[#2d2e33]"
        >
          <ScrapingPackageConfigForm
            package={selectedPackage}
            onSubmit={(pkg) => {
              if (selectedPackage) {
                handleEditPackage(pkg)
              } else {
                handleCreatePackage(pkg)
              }
              setShowPackageModal(false)
            }}
            onCancel={() => setShowPackageModal(false)}
          />
        </Modal>
      )}

      {showPersonaModal && (
        <Modal
          title={selectedPersona ? "Edit Persona" : "New Persona"}
          isOpen={showPersonaModal}
          onClose={() => setShowPersonaModal(false)}
          className="bg-[#1e1f23] text-white border-[#2d2e33]"
        >
          <PersonaForm
            persona={selectedPersona}
            onSubmit={(persona) => {
              if (selectedPersona) {
                handleEditPersona(persona)
              } else {
                handleCreatePersona(persona)
              }
              setShowPersonaModal(false)
            }}
            onCancel={() => setShowPersonaModal(false)}
            availableRecipients={recipients.filter(r => r.status === "active").map(r => ({
              id: r.id,
              name: r.name,
              email: r.email,
            }))}
          />
        </Modal>
      )}

      {showHistoryModal && selectedPackage && (
        <Modal
          title={`History - ${selectedPackage.name}`}
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          className="bg-[#1e1f23] text-white border-[#2d2e33]"
        >
          <ScrapingPackageHistory
            packageId={selectedPackage.id}
            onClose={() => setShowHistoryModal(false)}
          />
        </Modal>
      )}

      {showRecipientModal && selectedRecipient && (
        <Modal
          title={`Edit Recipient - ${selectedRecipient.name}`}
          isOpen={showRecipientModal}
          onClose={() => setShowRecipientModal(false)}
          className="bg-[#1e1f23] text-white border-[#2d2e33]"
        >
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input 
                id="name" 
                placeholder="Enter recipient name"
                defaultValue={selectedRecipient.name}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter recipient email"
                defaultValue={selectedRecipient.email}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 text-white cursor-pointer">
                  Active
                </Badge>
                <Badge className="bg-gray-600 text-white cursor-pointer">
                  Inactive
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowRecipientModal(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => {
                const updatedRecipient = {
                  ...selectedRecipient,
                  name: document.getElementById("name").value,
                  email: document.getElementById("email").value,
                  status: document.querySelector('input[name="status"]:checked').value
                }
                handleEditRecipient(updatedRecipient)
              }}>
                <Check className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
} 