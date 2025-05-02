"use client"

import { useState, useEffect } from "react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Trash, RefreshCw, Upload } from "lucide-react"

export function PersonaForm({ persona, recipients = [], scrapingPackages = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: persona?.name || "",
    description: persona?.description || "",
    inputs: {
      model_name: persona?.inputs?.model_name || "gpt-4.1",
      date_range: persona?.inputs?.date_range || "all time",
      search_query: persona?.inputs?.search_query || "",
      client_context: persona?.inputs?.client_context || "",
      project_context: persona?.inputs?.project_context || "",
      prompt: persona?.inputs?.prompt || persona?.prompt || "",
      package_ids: persona?.inputs?.package_ids || [],
      document_ids: persona?.inputs?.document_ids || []
    },
    documents: persona?.documents || [],
    selectedRecipients: persona?.recipients || [],
  })

  const [availableDocuments, setAvailableDocuments] = useState([])
  const [showDocumentSelector, setShowDocumentSelector] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const availableRecipients = recipients.filter(
    (recipient) => !formData.selectedRecipients.includes(recipient.id)
  )

  // Load available documents on mount
  useEffect(() => {
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

        console.log("Persona form loaded documents:", transformedDocuments, "Original data:", documentsData)

        setAvailableDocuments(transformedDocuments)
      } catch (error) {
        console.error("Error loading documents:", error)
      }
    }

    loadDocuments()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a copy of the form data with properly formatted documents
    const formattedData = {
      ...formData,
      documents: formData.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        uploadedAt: doc.uploadedAt
      }))
    }

    onSubmit(formattedData)
  }

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

      console.log("Persona form refreshed documents:", transformedDocuments)

      setAvailableDocuments(transformedDocuments)
      return transformedDocuments
    } catch (error) {
      console.error("Error refreshing documents:", error)
      return []
    }
  }

  // Function to handle selecting existing documents
  const handleSelectExistingDocuments = (selectedDocIds) => {
    // Find the selected documents from available documents
    const selectedDocs = availableDocuments.filter(doc => selectedDocIds.includes(doc.id))

    // Add to form data
    setFormData(prevData => ({
      ...prevData,
      documents: [...prevData.documents, ...selectedDocs],
      inputs: {
        ...prevData.inputs,
        document_ids: [...prevData.inputs.document_ids, ...selectedDocIds]
      }
    }))

    // Close document selector
    setShowDocumentSelector(false)
  }

  // Function to remove a document
  const handleRemoveDocument = (docId) => {
    setFormData(prevData => ({
      ...prevData,
      documents: prevData.documents.filter(doc => doc.id !== docId),
      inputs: {
        ...prevData.inputs,
        document_ids: prevData.inputs.document_ids.filter(id => id !== docId)
      }
    }))
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
      setFormData(prevData => ({
        ...prevData,
        documents: [...prevData.documents, ...uploadedDocs],
        inputs: {
          ...prevData.inputs,
          document_ids: [...prevData.inputs.document_ids, ...uploadedDocIds]
        }
      }))

      // Clear uploaded files
      setUploadedFiles([])

      // Refresh the document list
      await refreshDocuments()
    } catch (error) {
      console.error("Error uploading documents:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-4 mb-4">
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
                  <SelectItem value="gpt-4o" className="focus:bg-gray-800 focus:text-white">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-7-sonnet-20250219" className="focus:bg-gray-800 focus:text-white">Claude 3.7 Sonnet</SelectItem>
                  <SelectItem value="claude-3-5-sonnet-20240620" className="focus:bg-gray-800 focus:text-white">Claude 3.5 Sonnet</SelectItem>
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

          <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-gray-300">Documents</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-gray-300 font-light">Attached Documents</Label>
                <button
                  type="button"
                  onClick={async () => {
                    console.log("Persona form opening document selector, refreshing documents...");
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
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

          <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-gray-300">Scraping Packages</h3>

            {formData.inputs.package_ids.length > 0 ? (
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {formData.inputs.package_ids.map((packageId) => {
                  const pkg = scrapingPackages.find((p) => p.id === packageId);
                  return (
                    <div key={packageId} className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded border border-gray-800">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {pkg?.name || 'Unknown Package'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {pkg?.description || 'No description'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            inputs: {
                              ...formData.inputs,
                              package_ids: formData.inputs.package_ids.filter(id => id !== packageId)
                            }
                          });
                        }}
                        className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-800 rounded">
                <p className="text-sm text-gray-400">No packages selected yet</p>
              </div>
            )}

            {scrapingPackages.filter(pkg => !formData.inputs.package_ids.includes(pkg.id)).length > 0 && (
              <div className="mt-4">
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
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
          <h3 className="text-sm font-medium text-gray-300">Recipients</h3>

          {formData.selectedRecipients.length > 0 ? (
            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
              {formData.selectedRecipients.map((recipientId) => {
                const recipient = recipients.find((r) => r.id === recipientId);
                return (
                  <div key={recipientId} className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded border border-gray-800">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {recipient?.name || 'Unknown Recipient'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {recipient?.email || 'No email'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRecipient(recipientId)}
                      className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-800 rounded">
              <p className="text-sm text-gray-400">No recipients assigned yet</p>
            </div>
          )}

          {availableRecipients.length > 0 && (
            <div className="mt-4">
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
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          {persona ? "Update Persona" : "Create Persona"}
        </Button>
      </div>
    </form>
  )
}