"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal } from "@/components/ui/modal"
import { SharedPersonaForm } from "@/components/shared/persona-form"
import { RecipientForm } from "@/components/forms/recipient-form"
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form"

import { Plus, Settings, Edit, MoreHorizontal, Users, UserCircle, Trash, Search, Calendar, Mail, Filter, Package, Check, X, PlusCircle, Edit2, Eye, Clock, MailCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { scrapingPackagesApi } from "@/lib/apiClient"
import { Input } from "@/components/ui/input"
import { format, parseISO } from "date-fns"

export default function ScrapingPackagesPage() {
  const [activeTab, setActiveTab] = useState("packages")
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showPersonaModal, setShowPersonaModal] = useState(false)
  const [showRecipientModal, setShowRecipientModal] = useState(false)
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeletePersonaModal, setShowDeletePersonaModal] = useState(false)
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
      // Get packages directly from the API
      const packagesResponse = await scrapingPackagesApi.getAll();

      // Transform API response to match expected format
      const packagesData = packagesResponse.map(pkg => ({
        id: pkg._id,
        name: pkg.name,
        description: pkg.description,
        status: pkg.status || 'active',
        schedule_interval: pkg.schedule_interval || '1h',
        max_articles_per_run: pkg.max_articles_per_run || 10,
        calculate_embeddings: pkg.calculate_embeddings !== false,
        extract_entities: pkg.extract_entities !== false,
        summarize: pkg.summarize !== false,
        lastRun: pkg.last_run,
        nextRun: pkg.next_run,
        createdAt: pkg.date_created || pkg.created_at || pkg.created_date,
        updatedAt: pkg.date_updated || pkg.updated_at || pkg.updated_date,
        itemsProcessed: pkg.articles_last_run || 0,
        totalArticles: pkg.article_count || 0,
        // Handle both sources and rss_feeds fields
        sources: pkg.sources || pkg.rss_feeds || [],
        stats: pkg.stats || {}
      }));

      // Import the personas API
      const { personasApi } = await import('@/lib/apiClient');

      // Get personas from the API
      const [personasData, recipientsData] = await Promise.all([
        personasApi.getAll().catch(err => {
          console.error('Error fetching personas:', err);
          return [];
        }),
        [], // Replace with real API call when available for recipients
      ]);

      // Transform personas data to match expected format
      const transformedPersonas = personasData.map(persona => ({
        id: persona._id,
        name: persona.name,
        description: persona.description,
        // Handle both old and new schema
        ...(persona.inputs ? { inputs: persona.inputs } : { prompt: persona.prompt }),
        status: persona.status || 'active',
        createdAt: persona.created_at,
        email: persona.email || ''
      }));

      setPackages(packagesData || [])
      setPersonas(transformedPersonas || [])
      setRecipients(recipientsData || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePackage = async (formData) => {
    try {
      setIsLoading(true)
      console.log('Creating package with data:', formData);

      // Transform data to match API format
      const apiData = {
        name: formData.name,
        description: formData.description,
        status: formData.status || 'active',
        schedule_interval: formData.schedule_interval || '1h',
        max_articles_per_run: formData.max_articles_per_run || 10,
        calculate_embeddings: formData.calculate_embeddings !== false,
        extract_entities: formData.extract_entities !== false,
        summarize: formData.summarize !== false,
        // Use both sources and rss_feeds for compatibility
        sources: formData.sources || [],
        rss_feeds: formData.sources || []
      };

      console.log('API data being sent for package creation:', apiData);

      // Call the API directly
      const response = await scrapingPackagesApi.create(apiData);
      console.log('API response:', response);

      // Transform response to match expected format
      const newPackage = {
        id: response._id,
        name: response.name,
        description: response.description,
        status: response.status || 'active',
        schedule_interval: response.schedule_interval || '1h',
        max_articles_per_run: response.max_articles_per_run || 10,
        calculate_embeddings: response.calculate_embeddings !== false,
        extract_entities: response.extract_entities !== false,
        summarize: response.summarize !== false,
        lastRun: response.last_run,
        nextRun: response.next_run,
        createdAt: response.date_created || response.created_at || response.created_date,
        updatedAt: response.date_updated || response.updated_at || response.updated_date,
        itemsProcessed: response.articles_last_run || 0,
        totalArticles: response.article_count || 0,
        sources: response.sources || response.rss_feeds || [],
        stats: response.stats || {}
      };

      // Update the local state with the new package
      setPackages([...packages, newPackage])
      setShowPackageModal(false)
    } catch (error) {
      console.error("Error creating package:", error)
      alert(`Failed to create package: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPackage = async (formData) => {
    try {
      setIsLoading(true)
      console.log('Updating package with ID:', selectedPackage.id, 'Data:', formData);

      // Transform data to match API format
      const apiData = {
        name: formData.name,
        description: formData.description,
        status: formData.status || 'active',
        schedule_interval: formData.schedule_interval || '1h',
        max_articles_per_run: formData.max_articles_per_run || 10,
        calculate_embeddings: formData.calculate_embeddings !== false,
        extract_entities: formData.extract_entities !== false,
        summarize: formData.summarize !== false,
        // Use both sources and rss_feeds for compatibility
        sources: formData.sources || [],
        rss_feeds: formData.sources || []
      };

      console.log('API data being sent:', apiData);

      // Call the API directly
      const response = await scrapingPackagesApi.update(selectedPackage.id, apiData);
      console.log('API response:', response);

      // Transform response to match expected format
      const updatedPackage = {
        id: response._id,
        name: response.name,
        description: response.description,
        status: response.status || 'active',
        schedule_interval: response.schedule_interval || '1h',
        max_articles_per_run: response.max_articles_per_run || 10,
        calculate_embeddings: response.calculate_embeddings !== false,
        extract_entities: response.extract_entities !== false,
        summarize: response.summarize !== false,
        lastRun: response.last_run,
        nextRun: response.next_run,
        createdAt: response.date_created || response.created_at || response.created_date,
        updatedAt: response.date_updated || response.updated_at || response.updated_date,
        itemsProcessed: response.articles_last_run || 0,
        totalArticles: response.article_count || 0,
        sources: response.sources || response.rss_feeds || [],
        stats: response.stats || {}
      };

      // Update the local state with the updated package
      const updatedPackages = packages.map((pkg) =>
        pkg.id === selectedPackage.id ? updatedPackage : pkg
      )
      setPackages(updatedPackages)
      setSelectedPackage(null)
      setShowPackageModal(false)
    } catch (error) {
      console.error("Error updating package:", error)
      alert(`Failed to update package: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePersona = async (formData) => {
    try {
      setIsLoading(true);
      console.log('Creating persona with data:', formData);

      // Import the personas API
      const { personasApi } = await import('@/lib/apiClient');

      // Call the API to create the persona
      const newPersona = await personasApi.create({
        name: formData.name,
        description: formData.description,
        // Include documents array if present
        ...(formData.documents ? { documents: formData.documents } : {}),
        // If using new schema with inputs
        ...(formData.inputs ? { inputs: formData.inputs } : { prompt: formData.prompt })
      });

      // Transform response to match expected format
      const transformedPersona = {
        id: newPersona._id,
        name: newPersona.name,
        description: newPersona.description,
        // Include documents array if present
        documents: newPersona.documents || [],
        // Handle both old and new schema
        ...(newPersona.inputs ? { inputs: newPersona.inputs } : { prompt: newPersona.prompt }),
        status: newPersona.status || 'active',
        createdAt: newPersona.created_at,
        email: newPersona.email || ''
      };

      // Update the local state
      setPersonas([...personas, transformedPersona]);
      setShowPersonaModal(false);
    } catch (error) {
      console.error("Error creating persona:", error);
      alert(`Failed to create persona: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditPersona = async (formData) => {
    try {
      setIsLoading(true);
      console.log('Updating persona with ID:', selectedPersona.id, 'Data:', formData);

      // Import the personas API
      const { personasApi } = await import('@/lib/apiClient');

      // Call the API to update the persona
      const updatedPersona = await personasApi.update(selectedPersona.id, {
        name: formData.name,
        description: formData.description,
        // Include documents array if present
        ...(formData.documents ? { documents: formData.documents } : {}),
        // If using new schema with inputs
        ...(formData.inputs ? { inputs: formData.inputs } : { prompt: formData.prompt })
      });

      // Transform response to match expected format
      const transformedPersona = {
        id: updatedPersona._id,
        name: updatedPersona.name,
        description: updatedPersona.description,
        // Include documents array if present
        documents: updatedPersona.documents || [],
        // Handle both old and new schema
        ...(updatedPersona.inputs ? { inputs: updatedPersona.inputs } : { prompt: updatedPersona.prompt }),
        status: updatedPersona.status || 'active',
        createdAt: updatedPersona.created_at,
        email: updatedPersona.email || ''
      };

      // Update the local state
      const updatedPersonas = personas.map((persona) =>
        persona.id === selectedPersona.id ? { ...persona, ...transformedPersona } : persona
      );

      setPersonas(updatedPersonas);
      setSelectedPersona(null);
      setShowPersonaModal(false);
    } catch (error) {
      console.error("Error updating persona:", error);
      alert(`Failed to update persona: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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



  const handleTogglePackageStatus = async (pkg) => {
    try {
      const newStatus = pkg.status === "active" ? "inactive" : "active"

      // Optimistically update the UI
      const updatedPackages = packages.map((p) =>
        p.id === pkg.id ? { ...p, status: newStatus } : p
      )
      setPackages(updatedPackages)

      // Prepare API data
      const apiData = {
        name: pkg.name,
        description: pkg.description,
        status: newStatus,
        schedule_interval: pkg.schedule_interval || '1h',
        max_articles_per_run: pkg.max_articles_per_run || 10,
        calculate_embeddings: pkg.calculate_embeddings !== false,
        extract_entities: pkg.extract_entities !== false,
        summarize: pkg.summarize !== false,
        // Use both sources and rss_feeds for compatibility
        sources: pkg.sources || [],
        rss_feeds: pkg.sources || []
      };

      console.log('API data being sent for status toggle:', apiData);

      // Call the API directly
      await scrapingPackagesApi.update(pkg.id, apiData);
    } catch (error) {
      console.error("Error toggling package status:", error)
      alert(`Failed to update package status: ${error.message}`)

      // Revert the optimistic update on error
      setPackages(packages)
      // Reload the data to ensure UI is in sync with server
      loadData()
    }
  }

  const handleDeletePackage = (pkg) => {
    // Set the selected package and show the delete confirmation modal
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  }

  const handleDeletePersona = (persona) => {
    // Set the selected persona and show the delete confirmation modal
    setSelectedPersona(persona);
    setShowDeletePersonaModal(true);
  }

  const confirmDeletePackage = async () => {
    try {
      setIsLoading(true);
      console.log('Deleting package with ID:', selectedPackage.id);

      // Call the API directly to delete the package
      await scrapingPackagesApi.delete(selectedPackage.id);

      // Remove the package from the local state
      const updatedPackages = packages.filter(p => p.id !== selectedPackage.id);
      setPackages(updatedPackages);

      // Close the modal and clear the selected package
      setShowDeleteModal(false);
      setSelectedPackage(null);

      // Show success message
      alert(`Package deleted successfully.`);
    } catch (error) {
      console.error("Error deleting package:", error);
      alert(`Failed to delete package: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const confirmDeletePersona = async () => {
    try {
      setIsLoading(true);
      console.log('Deleting persona with ID:', selectedPersona.id);

      // Import the personas API
      const { personasApi } = await import('@/lib/apiClient');

      // Call the API directly to delete the persona
      await personasApi.delete(selectedPersona.id);

      // Remove the persona from the local state
      const updatedPersonas = personas.filter(p => p.id !== selectedPersona.id);
      setPersonas(updatedPersonas);

      // Close the modal and clear the selected persona
      setShowDeletePersonaModal(false);
      setSelectedPersona(null);

      // Show success message
      alert(`Persona deleted successfully.`);
    } catch (error) {
      console.error("Error deleting persona:", error);
      alert(`Failed to delete persona: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleConfigurePackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowPackageModal(true)
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
      // Handle both ISO format and the API's date format
      return format(parseISO(dateString), "MMM d, yyyy h:mm a")
    } catch (error) {
      console.error("Error formatting date:", error, dateString)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-light">Content Sources</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger
            value="packages"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Scraping Packages
          </TabsTrigger>
          <TabsTrigger
            value="personas"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Personas
          </TabsTrigger>
          <TabsTrigger
            value="recipients"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Recipients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages..."
                className="pl-8 bg-[#111] border-gray-800 text-white"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
              />
            </div>
            <div>
              <Button
                onClick={() => {
                  setSelectedPackage(null)
                  setShowPackageModal(true)
                }}
                className="bg-white text-black hover:bg-gray-200 font-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#111] rounded-lg border border-gray-800">
                <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-light mb-2">No Packages Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create your first scraping package to get started
                </p>
                <Button
                  onClick={() => setShowPackageModal(true)}
                  className="bg-white text-black hover:bg-gray-200 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-[#111] p-5 rounded border border-gray-800 hover:border-gray-700 transition-colors relative">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white text-lg">{pkg.name}</h3>
                        <p className="text-sm text-gray-400">
                          {pkg.description}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                        pkg.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                  </div>

                  {/* RSS Feeds Section */}
                  {pkg.sources && pkg.sources.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs uppercase text-gray-500 mb-2">RSS FEEDS</h4>
                      <div className="max-h-32 overflow-y-auto pr-1 space-y-1.5">
                        {pkg.sources.map((source, idx) => (
                          <div key={idx} className="bg-[#1a1a1a] rounded p-1.5 text-xs">
                            {source.name ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-white truncate">{source.name}</span>
                                <span className="text-gray-400 truncate">{source.url}</span>
                              </div>
                            ) : (
                              <span className="text-gray-300 truncate">{source.url || 'Unnamed Feed'}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm mb-4">
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
                      <span className="text-gray-300">{pkg.itemsProcessed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total articles:</span>
                      <span className="text-gray-300">{pkg.totalArticles || 0}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePackageStatus(pkg)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light flex-1 py-1.5"
                      >
                        {pkg.status === "active" ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigurePackage(pkg)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light flex-1 py-1.5"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePackage(pkg)}
                        className="border-gray-700 text-gray-300 hover:bg-red-900 hover:text-white font-light w-full py-1.5"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search personas..."
                className="pl-8 bg-[#111] border-gray-800 text-white"
                value={personaSearch}
                onChange={(e) => setPersonaSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedPersona(null)
                setShowPersonaModal(true)
              }}
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Persona
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonas.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#111] rounded-lg border border-gray-800">
                <UserCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-light mb-2">No Personas Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create your first persona to get started
                </p>
                <Button
                  onClick={() => {
                    setSelectedPersona(null)
                    setShowPersonaModal(true)
                  }}
                  className="bg-white text-black hover:bg-gray-200 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Persona
                </Button>
              </div>
            ) : (
              filteredPersonas.map((persona) => {
                const personaRecipients = getPersonaRecipients(persona.id)
                return (
                  <div key={persona.id} className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-light text-white">{persona.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-gray-800 text-gray-300">
                          {personaRecipients.length} Recipients
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {persona.description || "No description"}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-gray-300">{persona.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-gray-300">{formatDate(persona.createdAt)}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-800 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageRecipients(persona)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Recipients
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPersona(persona);
                            setShowPersonaModal(true);
                          }}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePersona(persona)}
                        className="border-gray-700 text-gray-300 hover:bg-red-900 hover:text-white font-light w-full"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recipients..."
                className="pl-8 bg-[#111] border-gray-800 text-white"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRecipient(null)
                setShowRecipientModal(true)
              }}
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipients.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#111] rounded-lg border border-gray-800">
                <Mail className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-light mb-2">No Recipients Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Add recipients to manage your audience
                </p>
                <Button
                  onClick={() => {
                    setSelectedRecipient(null)
                    setShowRecipientModal(true)
                  }}
                  className="bg-white text-black hover:bg-gray-200 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>
            ) : (
              filteredRecipients.map((recipient) => (
                <div key={recipient.id} className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-light text-white">{recipient.name}</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedRecipient(recipient)
                        setShowRecipientModal(true)
                      }}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{recipient.email}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <MailCheck className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-400">Newsletters: {recipient.newsletterCount || 0}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                      recipient.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                    }`}>
                      {recipient.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {showPackageModal && (
        <Modal
          title={selectedPackage ? `Edit ${selectedPackage.name}` : "New Package"}
          isOpen={showPackageModal}
          onClose={() => setShowPackageModal(false)}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          <ScrapingPackageConfigForm
            scrapingPackage={selectedPackage}
            onSubmit={(pkg) => {
              if (selectedPackage) {
                handleEditPackage(pkg)
              } else {
                handleCreatePackage(pkg)
              }
              // Don't close the modal immediately, wait for the API call to complete
              // setShowPackageModal(false) will be called after the API call completes
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
        >
          <SharedPersonaForm
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
            recipients={recipients.filter(r => r.status === "active").map(r => ({
              id: r.id,
              name: r.name,
              email: r.email,
            }))}
            scrapingPackages={packages}
            embedded={true}
          />
        </Modal>
      )}



      {showRecipientModal && selectedRecipient && (
        <Modal
          title={`Edit Recipient - ${selectedRecipient.name}`}
          isOpen={showRecipientModal}
          onClose={() => setShowRecipientModal(false)}
        >
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-light">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter recipient name"
                defaultValue={selectedRecipient.name}
                className="bg-[#111] border-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-light">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient email"
                defaultValue={selectedRecipient.email}
                className="bg-[#111] border-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-light">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-light bg-green-900/30 text-green-400 cursor-pointer">
                  Active
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-light bg-gray-800 text-gray-400 cursor-pointer">
                  Inactive
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRecipientModal(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const updatedRecipient = {
                    ...selectedRecipient,
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    status: document.querySelector('input[name="status"]:checked').value
                  }
                  handleEditRecipient(updatedRecipient)
                }}
                className="bg-white text-black hover:bg-gray-200 font-light"
              >
                <Check className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Package Confirmation Modal */}
      {showDeleteModal && selectedPackage && (
        <Modal
          title="Confirm Delete"
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPackage(null);
          }}
        >
          <div className="space-y-4 py-2 pb-4">
            <p className="text-white">
              Are you sure you want to delete the package <span className="font-semibold">"{selectedPackage.name}"</span>?
            </p>
            <p className="text-gray-400 text-sm">
              This action cannot be undone. All associated data will be permanently removed.
            </p>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPackage(null);
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeletePackage}
                className="bg-red-600 hover:bg-red-700 text-white font-light"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Package
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Persona Confirmation Modal */}
      {showDeletePersonaModal && selectedPersona && (
        <Modal
          title="Confirm Delete"
          isOpen={showDeletePersonaModal}
          onClose={() => {
            setShowDeletePersonaModal(false);
            setSelectedPersona(null);
          }}
        >
          <div className="space-y-4 py-2 pb-4">
            <p className="text-white">
              Are you sure you want to delete the persona <span className="font-semibold">"{selectedPersona.name}"</span>?
            </p>
            <p className="text-gray-400 text-sm">
              This action cannot be undone. All associated data will be permanently removed.
            </p>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeletePersonaModal(false);
                  setSelectedPersona(null);
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeletePersona}
                className="bg-red-600 hover:bg-red-700 text-white font-light"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Persona
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}