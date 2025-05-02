"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash, RefreshCw, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

/**
 * Shared PersonaForm component that can be used in both the Lab page and Content Sources section
 *
 * @param {Object} props - Component props
 * @param {Object} props.persona - Persona data for editing (optional)
 * @param {Array} props.recipients - Available recipients (optional)
 * @param {Array} props.scrapingPackages - Available scraping packages (optional)
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is cancelled
 * @param {Boolean} props.embedded - Whether the form is embedded in another component
 * @param {Function} props.onPersonaSelect - Function to call when a persona is selected (for Lab page)
 * @param {Array} props.personas - Available personas (for Lab page)
 * @param {String} props.selectedPersonaId - ID of the selected persona (for Lab page)
 */
export function SharedPersonaForm({
  persona,
  recipients = [],
  scrapingPackages = [],
  onSubmit,
  onCancel,
  embedded = false,
  onPersonaSelect,
  personas = [],
  selectedPersonaId = "",
}) {
  // Form state - initialize with default values using useMemo to prevent recreation on each render
  const defaultFormData = useMemo(() => ({
    name: "",
    description: "",
    inputs: {
      model_name: "gpt-4.1",
      date_range: "all time",
      search_query: "",
      client_context: "",
      project_context: "",
      prompt: "",
      package_ids: [],
      document_ids: []
    },
    documents: [],
    selectedRecipients: [],
  }), []); // Empty dependency array means this will only be created once

  // Use the provided formData from parent if available, otherwise use default
  const [formData, setFormData] = useState(() => {
    if (persona) {
      return {
        name: persona.name || "",
        description: persona.description || "",
        inputs: {
          model_name: persona.inputs?.model_name || "gpt-4.1",
          date_range: persona.inputs?.date_range || "all time",
          search_query: persona.inputs?.search_query || "",
          client_context: persona.inputs?.client_context || "",
          project_context: persona.inputs?.project_context || "",
          prompt: persona.inputs?.prompt || persona?.prompt || "",
          package_ids: persona.inputs?.package_ids || [],
          document_ids: persona.inputs?.document_ids || []
        },
        documents: persona.documents || [],
        selectedRecipients: persona.recipients || [],
      };
    } else {
      return defaultFormData;
    }
  })

  // Document handling state
  const [availableDocuments, setAvailableDocuments] = useState([])
  const [showDocumentSelector, setShowDocumentSelector] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Filter available recipients
  const availableRecipients = recipients.filter(
    (recipient) => !formData.selectedRecipients.includes(recipient.id)
  )

  // Load available documents on mount
  useEffect(() => {
    loadDocuments()
  }, [])

  // Update form data when persona changes - only when the persona prop changes
  useEffect(() => {
    if (persona) {
      console.log("Persona prop changed, updating form data:", JSON.stringify(persona, null, 2));

      // Ensure package_ids is always an array
      const package_ids = Array.isArray(persona.inputs?.package_ids)
        ? persona.inputs.package_ids
        : [];

      // Ensure document_ids is always an array
      const document_ids = Array.isArray(persona.inputs?.document_ids)
        ? persona.inputs.document_ids
        : [];

      // Ensure documents is always an array
      const documents = Array.isArray(persona.documents)
        ? persona.documents
        : [];

      console.log("Package IDs:", package_ids);
      console.log("Document IDs:", document_ids);
      console.log("Documents:", JSON.stringify(documents, null, 2));

      // Deep clone the documents array to ensure it's a new reference
      const documentsCopy = documents.map(doc => ({...doc}));

      // Create a new form data object with all the necessary fields
      const newFormData = {
        name: persona.name || "",
        description: persona.description || "",
        inputs: {
          model_name: persona.inputs?.model_name || "gpt-4.1",
          date_range: persona.inputs?.date_range || "all time",
          search_query: persona.inputs?.search_query || "",
          client_context: persona.inputs?.client_context || "",
          project_context: persona.inputs?.project_context || "",
          prompt: persona.inputs?.prompt || persona?.prompt || "",
          package_ids: [...package_ids], // Create a new array to ensure it's a new reference
          document_ids: [...document_ids] // Create a new array to ensure it's a new reference
        },
        documents: documentsCopy,
        selectedRecipients: persona.recipients ? [...persona.recipients] : []
      };

      console.log("Setting form data to:", JSON.stringify(newFormData, null, 2));

      // Update the form data
      setFormData(newFormData);

      // Also refresh the documents list to ensure we have the latest documents
      loadDocuments();
    } else {
      console.log("No persona provided, using defaults");
      setFormData({...defaultFormData}); // Create a new object to ensure it's a new reference
    }
  }, [persona]) // Remove defaultFormData from dependencies to prevent unnecessary updates

  // Load documents from API
  const loadDocuments = async () => {
    try {
      // Import the documents API
      const { documentsApi } = await import('@/lib/apiClient');

      // Use the documents API to fetch all documents
      const documentsData = await documentsApi.getAll();

      // Transform documents data
      const transformedDocuments = documentsData.map(doc => ({
        id: doc._id,
        name: doc.document_name || doc.name,
        type: doc.document_type || doc.type,
        uploadedAt: doc.uploaded_at || doc.uploadedAt
      }))

      console.log("Shared form loaded documents:", transformedDocuments)

      setAvailableDocuments(transformedDocuments)
    } catch (error) {
      console.error("Error loading documents:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents. Please try again."
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a copy of the form data with properly formatted documents and package IDs
    const formattedData = {
      ...formData,
      documents: formData.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        uploadedAt: doc.uploadedAt
      })),
      inputs: {
        ...formData.inputs,
        // Ensure package_ids is always an array
        package_ids: Array.isArray(formData.inputs.package_ids) ? formData.inputs.package_ids : []
      }
    }

    console.log("Submitting formatted data:", formattedData);
    onSubmit(formattedData)
  }

  // We'll rely on explicit form submission instead of auto-updating

  // Handle recipient management
  const handleAddRecipient = (recipientId) => {
    setFormData({
      ...formData,
      selectedRecipients: [...formData.selectedRecipients, recipientId],
    })
  }

  const handleRemoveRecipient = (recipientId) => {
    setFormData({
      ...formData,
      selectedRecipients: formData.selectedRecipients.filter(
        (id) => id !== recipientId
      ),
    })
  }

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: "file_" + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file
    }))
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Function to refresh document list
  const refreshDocuments = async () => {
    try {
      // Import the documents API
      const { documentsApi } = await import('@/lib/apiClient');

      // Use the documents API to fetch all documents
      const documentsData = await documentsApi.getAll();

      // Transform documents data
      const transformedDocuments = documentsData.map(doc => ({
        id: doc._id,
        name: doc.document_name || doc.name,
        type: doc.document_type || doc.type,
        uploadedAt: doc.uploaded_at || doc.uploadedAt
      }))

      console.log("Shared form refreshed documents:", transformedDocuments)

      setAvailableDocuments(transformedDocuments)
      return transformedDocuments
    } catch (error) {
      console.error("Error refreshing documents:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents. Please try again."
      })
      return []
    }
  }

  // Function to handle selecting existing documents
  const handleSelectExistingDocuments = (selectedDocIds) => {
    // Find the selected documents from available documents
    const selectedDocs = availableDocuments.filter(doc => selectedDocIds.includes(doc.id))

    console.log("Selected documents:", selectedDocs);

    // Add to form data
    setFormData(prevData => {
      // Filter out documents that are already in the form
      const newDocs = selectedDocs.filter(doc => !prevData.documents.some(d => d.id === doc.id))

      // Ensure document_ids is always an array
      const currentDocIds = Array.isArray(prevData.inputs.document_ids)
        ? prevData.inputs.document_ids
        : [];

      // Get new document IDs that aren't already in the list
      const newDocIds = selectedDocIds.filter(id => !currentDocIds.includes(id));

      console.log("Current document IDs:", currentDocIds);
      console.log("New document IDs to add:", newDocIds);

      return {
        ...prevData,
        documents: [...prevData.documents, ...newDocs],
        inputs: {
          ...prevData.inputs,
          document_ids: [...currentDocIds, ...newDocIds]
        }
      };
    });

    // Close document selector
    setShowDocumentSelector(false)

    toast({
      title: "Success",
      description: `${selectedDocs.length} document(s) added to persona`,
    })
  }

  // Function to remove a document
  const handleRemoveDocument = (docId) => {
    console.log("Removing document with ID:", docId);

    setFormData(prevData => {
      // Ensure document_ids is always an array
      const currentDocIds = Array.isArray(prevData.inputs.document_ids)
        ? prevData.inputs.document_ids
        : [];

      console.log("Current document IDs before removal:", currentDocIds);

      return {
        ...prevData,
        documents: prevData.documents.filter(doc => doc.id !== docId),
        inputs: {
          ...prevData.inputs,
          document_ids: currentDocIds.filter(id => id !== docId)
        }
      };
    });

    toast({
      title: "Document Removed",
      description: "Document has been removed from the persona",
    });
  }

  const handleAddDocuments = async () => {
    setIsUploading(true)

    try {
      // Upload each file to the API
      const uploadedDocs = []
      const uploadedDocIds = []

      // Import the documents API
      const { documentsApi } = await import('@/lib/apiClient');

      for (const file of uploadedFiles) {
        // Use the documents API to upload the file
        const docData = await documentsApi.upload(file.file);

        // Add to uploaded docs list
        uploadedDocs.push({
          id: docData._id,
          name: docData.document_name || file.name,
          type: docData.document_type || file.type,
          size: file.size,
          uploadedAt: docData.uploaded_at || new Date().toISOString()
        })

        // Add to document IDs list
        uploadedDocIds.push(docData._id)
      }

      // Add to form data
      setFormData(prevData => {
        // Ensure document_ids is always an array
        const currentDocIds = Array.isArray(prevData.inputs.document_ids)
          ? prevData.inputs.document_ids
          : [];

        console.log("Current document IDs before adding:", currentDocIds);
        console.log("New document IDs to add:", uploadedDocIds);

        return {
          ...prevData,
          documents: [...prevData.documents, ...uploadedDocs],
          inputs: {
            ...prevData.inputs,
            document_ids: [...currentDocIds, ...uploadedDocIds]
          }
        };
      })

      // Clear uploaded files
      setUploadedFiles([])

      // Refresh the document list
      await refreshDocuments()

      toast({
        title: "Success",
        description: `${uploadedDocs.length} document(s) uploaded successfully`,
      })
    } catch (error) {
      console.error("Error uploading documents:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to upload documents: ${error.message}`,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Persona selection is now handled by the parent component

  // Render the form UI
  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-4 mb-4">
        {/* Persona selector is now handled by the parent component */}

        {/* Basic persona information */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 font-light">Persona Name</Label>
          <Input
            id="name"
            placeholder="Enter persona name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300 font-light">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter persona description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
          />
        </div>

        {/* Newsletter generation settings */}
        <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
          <h3 className="text-sm font-medium text-gray-300">Newsletter Generation Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model_name" className="text-gray-300 font-light">Model</Label>
              <Select
                value={formData.inputs.model_name}
                onValueChange={(value) => setFormData({
                  ...formData,
                  inputs: { ...formData.inputs, model_name: value }
                })}
              >
                <SelectTrigger id="model_name" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-800 text-white">
                  <SelectItem value="gpt-4.1" className="focus:bg-gray-800 focus:text-white">GPT-4.1</SelectItem>
                  <SelectItem value="gpt-4.1-web" className="focus:bg-gray-800 focus:text-white">GPT-4.1 (Web)</SelectItem>
                  <SelectItem value="gpt-4o" className="focus:bg-gray-800 focus:text-white">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-web" className="focus:bg-gray-800 focus:text-white">GPT-4o (Web)</SelectItem>
                  <SelectItem value="gpt-4-turbo" className="focus:bg-gray-800 focus:text-white">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4-turbo-web" className="focus:bg-gray-800 focus:text-white">GPT-4 Turbo (Web)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo" className="focus:bg-gray-800 focus:text-white">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-7-sonnet-20250219" className="focus:bg-gray-800 focus:text-white">Claude 3.7 Sonnet</SelectItem>
                  <SelectItem value="claude-3-5-sonnet-20241022" className="focus:bg-gray-800 focus:text-white">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="claude-3-opus-20240229" className="focus:bg-gray-800 focus:text-white">Claude 3 Opus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_range" className="text-gray-300 font-light">Date Range</Label>
              <Select
                value={formData.inputs.date_range}
                onValueChange={(value) => setFormData({
                  ...formData,
                  inputs: { ...formData.inputs, date_range: value }
                })}
              >
                <SelectTrigger id="date_range" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-800 text-white">
                  <SelectItem value="all time" className="focus:bg-gray-800 focus:text-white">All Time</SelectItem>
                  <SelectItem value="30days" className="focus:bg-gray-800 focus:text-white">Last 30 Days</SelectItem>
                  <SelectItem value="7days" className="focus:bg-gray-800 focus:text-white">Last 7 Days</SelectItem>
                  <SelectItem value="24hours" className="focus:bg-gray-800 focus:text-white">Last 24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search_query" className="text-gray-300 font-light">Search Query</Label>
            <Input
              id="search_query"
              placeholder="Enter search terms (e.g., AI, MCP, Agents)"
              value={formData.inputs.search_query}
              onChange={(e) => setFormData({
                ...formData,
                inputs: { ...formData.inputs, search_query: e.target.value }
              })}
              className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            />
            <p className="text-xs text-gray-500">Comma-separated keywords to filter content</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_context" className="text-gray-300 font-light">Client Context</Label>
            <Textarea
              id="client_context"
              placeholder="Enter client context information"
              value={formData.inputs.client_context}
              onChange={(e) => setFormData({
                ...formData,
                inputs: { ...formData.inputs, client_context: e.target.value }
              })}
              rows={2}
              className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_context" className="text-gray-300 font-light">Project Context</Label>
            <Textarea
              id="project_context"
              placeholder="Enter project context information"
              value={formData.inputs.project_context}
              onChange={(e) => setFormData({
                ...formData,
                inputs: { ...formData.inputs, project_context: e.target.value }
              })}
              rows={2}
              className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-gray-300 font-light">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter detailed prompt for the newsletter"
              value={formData.inputs.prompt}
              onChange={(e) => setFormData({
                ...formData,
                inputs: { ...formData.inputs, prompt: e.target.value }
              })}
              required
              rows={5}
              className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            />
            <p className="text-xs text-gray-500">This prompt will guide the AI when generating content for this persona.</p>
          </div>

          {/* Documents section */}
          <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-gray-300">Documents</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-gray-300 font-light">Attached Documents</Label>
                <button
                  type="button"
                  onClick={async () => {
                    console.log("Opening document selector, refreshing documents...");
                    await refreshDocuments();
                    setShowDocumentSelector(true);
                  }}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
                >
                  Browse Library
                </button>
              </div>
              <div className="border border-gray-800 rounded-md p-4 bg-[#111]">
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.documents.map((doc) => (
                    <Badge
                      key={doc.id}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    >
                      {doc.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="ml-1 hover:bg-gray-700 rounded-full"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.documents.length === 0 && (
                    <p className="text-sm text-gray-500">No documents attached</p>
                  )}
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    dragActive ? "border-gray-600 bg-gray-900/10" : "border-gray-800"
                  } bg-[#111] mb-4`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <p className="text-gray-400 mb-2 font-light text-sm">Drag and drop files here, or</p>
                  <input
                    type="file"
                    id="document-input"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label htmlFor="document-input" className="cursor-pointer">
                    <div
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
                    >
                      Browse Files
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Supported file types: PDF, DOCX, TXT (Max 10MB)</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="border border-gray-800 rounded-md divide-y divide-gray-800 bg-[#111]">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <div>
                              <p className="font-light text-white text-sm">{file.name}</p>
                              <p className="text-xs text-gray-400">{file.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md flex items-center justify-center"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddDocuments}
                      disabled={isUploading}
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white hover:bg-gray-700 font-light h-9 px-4 py-2"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Documents"
                      )}
                    </button>
                  </div>
                )}

                {/* Document selection modal */}
                {showDocumentSelector && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-lg font-medium">Select Documents</h3>
                        <button
                          type="button"
                          onClick={() => setShowDocumentSelector(false)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md flex items-center justify-center"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-4 overflow-y-auto flex-grow">
                        {availableDocuments.length === 0 ? (
                          <p className="text-center text-gray-400 py-8">No documents available</p>
                        ) : (
                          <div className="space-y-2">
                            {availableDocuments
                              // Show all documents - the API now supports many-to-many relationships
                              .map(doc => (
                                <div
                                  key={doc.id}
                                  className="flex items-center p-3 border border-gray-800 rounded-md hover:bg-gray-900 cursor-pointer"
                                  onClick={() => handleSelectExistingDocuments([doc.id])}
                                >
                                  <div className="flex-grow">
                                    <p className="font-light text-white">{doc.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectExistingDocuments([doc.id]);
                                    }}
                                  >
                                    Add
                                  </button>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-800 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowDocumentSelector(false)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scraping Packages section - conditionally rendered */}
          {scrapingPackages.length > 0 && (
            <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-300">Scraping Packages</h3>
              <div className="space-y-2">
                <div className="border border-gray-800 rounded-md p-4 bg-[#111]">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.inputs.package_ids.map((packageId) => {
                      const pkg = scrapingPackages.find((p) => p.id === packageId);
                      return (
                        <Badge
                          key={packageId}
                          variant="secondary"
                          className="flex items-center gap-1 bg-gray-800 text-gray-200 hover:bg-gray-700"
                        >
                          {pkg?.name || packageId}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                inputs: {
                                  ...formData.inputs,
                                  package_ids: formData.inputs.package_ids.filter(id => id !== packageId)
                                }
                              });
                            }}
                            className="ml-1 hover:bg-gray-700 rounded-full"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                    {formData.inputs.package_ids.length === 0 && (
                      <p className="text-sm text-gray-500">No packages selected</p>
                    )}
                  </div>
                  {scrapingPackages.filter(pkg => !formData.inputs.package_ids.includes(pkg.id)).length > 0 && (
                    <Select
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          inputs: {
                            ...formData.inputs,
                            package_ids: [...formData.inputs.package_ids, value]
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                        <SelectValue placeholder="Add package" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-gray-800 text-white">
                        {scrapingPackages
                          .filter(pkg => !formData.inputs.package_ids.includes(pkg.id))
                          .map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id} className="focus:bg-gray-800 focus:text-white">
                              {pkg.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recipients section - conditionally rendered */}
          {recipients.length > 0 && (
            <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-300">Recipients</h3>
              <div className="space-y-2">
                <div className="border border-gray-800 rounded-md p-4 bg-[#111]">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.selectedRecipients.map((recipientId) => {
                      const recipient = recipients.find((r) => r.id === recipientId);
                      return (
                        <Badge
                          key={recipientId}
                          variant="secondary"
                          className="flex items-center gap-1 bg-gray-800 text-gray-200 hover:bg-gray-700"
                        >
                          {recipient?.name || recipientId}
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(recipientId)}
                            className="ml-1 hover:bg-gray-700 rounded-full"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                    {formData.selectedRecipients.length === 0 && (
                      <p className="text-sm text-gray-500">No recipients selected</p>
                    )}
                  </div>
                  {availableRecipients.length > 0 && (
                    <Select
                      onValueChange={handleAddRecipient}
                    >
                      <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                        <SelectValue placeholder="Add recipient" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-gray-800 text-white">
                        {availableRecipients.map((recipient) => (
                          <SelectItem key={recipient.id} value={recipient.id} className="focus:bg-gray-800 focus:text-white">
                            {recipient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        )}
        {!embedded && (
          <button
            type="button"
            onClick={() => {
              // Manually trigger form submission to update parent state
              const formattedData = {
                ...formData,
                documents: formData.documents.map(doc => ({
                  id: doc.id,
                  name: doc.name,
                  type: doc.type,
                  uploadedAt: doc.uploadedAt
                })),
                inputs: {
                  ...formData.inputs,
                  // Ensure package_ids is always an array
                  package_ids: Array.isArray(formData.inputs.package_ids) ? formData.inputs.package_ids : []
                }
              };
              onSubmit(formattedData);
            }}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 px-4 py-2"
          >
            Apply Changes
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-gray-200 font-light h-9 px-4 py-2"
        >
          {persona ? "Update Persona" : "Create Persona"}
        </button>
      </div>
    </form>
  )
}
