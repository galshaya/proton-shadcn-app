"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash, Save, Download, Upload, Play, RefreshCw, Copy, Check, X } from "lucide-react"
import { personasApi, newsletterApi } from "@/lib/apiClient"
import { toast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { SharedPersonaForm } from "@/components/shared/persona-form"

export default function LabPage() {
  const [personas, setPersonas] = useState([])
  const [scrapingPackages, setScrapingPackages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPersonaId, setSelectedPersonaId] = useState("")
  const [formData, setFormData] = useState({
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
      document_ids: [] // Store document IDs for API
    },
    documents: [] // Store document objects for UI
  })
  // Document-related state is now handled by the shared component
  const [generatedContent, setGeneratedContent] = useState("")
  const [contextData, setContextData] = useState("")
  const [showContext, setShowContext] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load personas and scraping packages on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [personasData, packagesData] = await Promise.all([
          fetch('http://localhost:5001/api/personas').then(res => res.json()).catch(err => {
            console.error('Error fetching personas:', err)
            return []
          }),
          fetch('http://localhost:5001/api/scraping-packages').then(res => res.json()).catch(err => {
            console.error('Error fetching scraping packages:', err)
            return []
          })
        ])

        // Transform personas data
        const transformedPersonas = personasData.map(persona => ({
          id: persona._id,
          name: persona.name,
          description: persona.description,
          // Handle both old and new schema
          ...(persona.inputs ? { inputs: persona.inputs } : {
            inputs: {
              model_name: "gpt-4o",
              date_range: "all time",
              search_query: "",
              client_context: "",
              project_context: "",
              prompt: persona.prompt || "",
              package_ids: []
            }
          }),
          documents: persona.documents || []
        }))

        // Transform packages data
        const transformedPackages = packagesData.map(pkg => ({
          id: pkg._id,
          name: pkg.name,
          description: pkg.description
        }))

        setPersonas(transformedPersonas)
        setScrapingPackages(transformedPackages)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again."
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle persona selection
  const handlePersonaSelect = (personaId) => {
    console.log("Persona selected:", personaId);

    if (personaId === "_new") {
      // Reset form if "Create New" is chosen
      setFormData({
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
        documents: []
      });
      setSelectedPersonaId("");
      return;
    }

    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      console.log("Found persona:", persona);

      // Update form data with selected persona
      setFormData({
        name: persona.name,
        description: persona.description,
        inputs: {
          model_name: persona.inputs?.model_name || "gpt-4o",
          date_range: persona.inputs?.date_range || "all time",
          search_query: persona.inputs?.search_query || "",
          client_context: persona.inputs?.client_context || "",
          project_context: persona.inputs?.project_context || "",
          prompt: persona.inputs?.prompt || "",
          package_ids: persona.inputs?.package_ids || [],
          document_ids: persona.inputs?.document_ids || []
        },
        documents: persona.documents || []
      });

      // Update selected persona ID
      setSelectedPersonaId(personaId);
    }
  }

  // Generate newsletter
  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedContent("")

    try {
      // Prepare data for API
      const requestData = {
        model: formData.inputs.model_name,
        date_range: formData.inputs.date_range,
        search_query: formData.inputs.search_query,
        client_context: formData.inputs.client_context,
        project_context: formData.inputs.project_context,
        prompt: formData.inputs.prompt,
        package_ids: formData.inputs.package_ids,
        document_ids: formData.inputs.document_ids
      }

      // Call the API
      const response = await fetch('http://localhost:5001/api/newsletter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Include-Document-Content': 'true', // Tell the API to include document content
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate newsletter: ${response.statusText}`)
      }

      const data = await response.json()

      // Extract the content from the response
      // If there's a generated_content field, use that
      // Otherwise, try content, text, or stringify the whole response
      const content = data.generated_content || data.content || data.text || JSON.stringify(data, null, 2)
      setGeneratedContent(content)

      // Store the context separately if available
      if (data.context_used) {
        // Add document information to the context if documents were used
        if (formData.inputs.document_ids && formData.inputs.document_ids.length > 0) {
          const documentNames = formData.documents
            .filter(doc => formData.inputs.document_ids.includes(doc.id))
            .map(doc => doc.name)
            .join(", ")

          const documentContext = `DOCUMENTS USED:\n${documentNames}\n\n${data.context_used}`
          setContextData(documentContext)
        } else {
          setContextData(data.context_used)
        }
      }

      toast({
        title: "Success",
        description: "Newsletter generated successfully",
      })
    } catch (error) {
      console.error("Error generating newsletter:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate newsletter: ${error.message}`,
      })
      setGeneratedContent(`Error: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Save persona to database
  const handleSavePersona = async () => {
    setIsLoading(true)

    try {
      // First, upload any documents if needed
      // In a real implementation, we would upload each document to the server
      // For now, we'll just include them in the persona data

      let response

      if (selectedPersonaId) {
        // Update existing persona
        response = await fetch(`http://localhost:5001/api/personas/${selectedPersonaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            inputs: formData.inputs,
            documents: formData.documents.map(doc => ({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              uploadedAt: doc.uploadedAt
            }))
          }),
        })
      } else {
        // Create new persona
        response = await fetch('http://localhost:5001/api/personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            inputs: formData.inputs,
            documents: formData.documents.map(doc => ({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              uploadedAt: doc.uploadedAt
            }))
          }),
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to save persona: ${response.statusText}`)
      }

      const savedPersona = await response.json()

      // Refresh personas list
      const personasResponse = await fetch('http://localhost:5001/api/personas')
      const personasData = await personasResponse.json()

      // Transform personas data
      const transformedPersonas = personasData.map(persona => ({
        id: persona._id,
        name: persona.name,
        description: persona.description,
        // Handle both old and new schema
        ...(persona.inputs ? { inputs: persona.inputs } : {
          inputs: {
            model_name: "gpt-4o",
            date_range: "all time",
            search_query: "",
            client_context: "",
            project_context: "",
            prompt: persona.prompt || "",
            package_ids: [],
            document_ids: []
          }
        }),
        documents: persona.documents || []
      }))

      setPersonas(transformedPersonas)

      // Update selected persona ID if creating new
      if (!selectedPersonaId) {
        setSelectedPersonaId(savedPersona._id)
      }

      toast({
        title: "Success",
        description: `Persona ${selectedPersonaId ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving persona:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save persona: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Export persona as JSON
  const handleExportPersona = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `${formData.name.replace(/\s+/g, '_').toLowerCase()}_persona.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import persona from JSON
  const handleImportPersona = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)

        // Handle different JSON structures
        // Case 1: Standard persona format with name, description, inputs
        if (importedData.name && importedData.description) {
          setFormData({
            name: importedData.name,
            description: importedData.description,
            inputs: {
              model_name: importedData.inputs?.model_name || "gpt-4o",
              date_range: importedData.inputs?.date_range || "all time",
              search_query: importedData.inputs?.search_query || "",
              client_context: importedData.inputs?.client_context || "",
              project_context: importedData.inputs?.project_context || "",
              prompt: importedData.inputs?.prompt || importedData.prompt || "",
              package_ids: importedData.inputs?.package_ids || [],
              document_ids: importedData.inputs?.document_ids || []
            },
            documents: importedData.documents || []
          })
        }
        // Case 2: Just inputs object (like the example provided)
        else if (importedData.inputs) {
          // Create a name based on the search query or model
          const generatedName = importedData.inputs.search_query
            ? `Persona for ${importedData.inputs.search_query.split(',')[0]}`
            : `${importedData.inputs.model_name || 'AI'} Persona`

          setFormData({
            name: generatedName,
            description: importedData.inputs.client_context || importedData.inputs.project_context || "Imported persona",
            inputs: {
              model_name: importedData.inputs.model_name || "gpt-4o",
              date_range: importedData.inputs.date_range || "all time",
              search_query: importedData.inputs.search_query || "",
              client_context: importedData.inputs.client_context || "",
              project_context: importedData.inputs.project_context || "",
              prompt: importedData.inputs.prompt || "",
              package_ids: importedData.inputs.package_ids || [],
              document_ids: importedData.inputs.document_ids || []
            },
            documents: importedData.documents || []
          })

          // Reset selected persona
          setSelectedPersonaId("")
        } else {
          throw new Error("Invalid persona data: missing required fields or unsupported format")
        }

        toast({
          title: "Success",
          description: "Persona imported successfully",
        })
      } catch (error) {
        console.error("Error importing persona:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to import persona: ${error.message}`,
        })
      }
    }
    reader.readAsText(file)

    // Reset file input
    event.target.value = null
  }

  // Copy generated content to clipboard
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Document-related functions are now handled by the shared component

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AI Lab</h1>
        <div className="flex space-x-2">
          <input
            type="file"
            id="import-persona"
            className="hidden"
            accept=".json"
            onChange={handleImportPersona}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-persona').click()}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPersona}
            disabled={!formData.name}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSavePersona}
            disabled={!formData.name || !formData.description || !formData.inputs.prompt}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Persona Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Persona Configuration</CardTitle>
              <CardDescription>
                Configure a persona to generate a newsletter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Persona selector */}
              <div className="space-y-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="persona-select">Load Persona</Label>
                  <Select
                    value={selectedPersonaId}
                    onValueChange={handlePersonaSelect}
                  >
                    <SelectTrigger id="persona-select" className="w-full bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-gray-800 text-white">
                      <SelectItem value="_new" className="focus:bg-gray-800 focus:text-white">Create New</SelectItem>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id} className="focus:bg-gray-800 focus:text-white">
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Use the shared persona form component */}
              <SharedPersonaForm
                persona={selectedPersonaId && selectedPersonaId !== "_new" ? personas.find(p => p.id === selectedPersonaId) : null}
                scrapingPackages={scrapingPackages}
                onSubmit={(updatedFormData) => {
                  console.log("Form submitted with data:", updatedFormData);
                  setFormData(updatedFormData);
                  toast({
                    title: "Form Updated",
                    description: "Persona form data has been updated.",
                  });
                }}
              />
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.inputs.prompt}
                className="w-full bg-white text-black hover:bg-gray-200 font-light"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Newsletter
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Preview */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Newsletter Preview</CardTitle>
                <div className="flex space-x-2">
                  {contextData && (
                    <Button
                      variant={contextData.includes("DOCUMENTS USED:") ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowContext(!showContext)}
                      className={contextData.includes("DOCUMENTS USED:")
                        ? "bg-blue-700 text-white hover:bg-blue-600 font-light"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                      }
                    >
                      {showContext
                        ? "Hide Context"
                        : contextData.includes("DOCUMENTS USED:")
                          ? "Show Context (Documents Used)"
                          : "Show Context"
                      }
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyContent}
                    disabled={!generatedContent}
                    className="text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Generated newsletter content
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="border border-gray-800 rounded-md bg-[#111] p-4 h-[800px] overflow-y-auto">
                {generatedContent ? (
                  <div className="prose prose-invert max-w-none">
                    {showContext && contextData ? (
                      <div className="mb-4">
                        <details className="bg-gray-900 p-3 rounded-md border border-gray-800" open={contextData.includes("DOCUMENTS USED:")}>
                          <summary className="font-medium cursor-pointer">
                            {contextData.includes("DOCUMENTS USED:") ?
                              <span className="flex items-center">
                                Context Used <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900 text-blue-100 rounded-full">Documents Included</span>
                              </span> :
                              "Context Used"
                            }
                          </summary>
                          <div className="mt-2 text-sm whitespace-pre-wrap">
                            {contextData.includes("DOCUMENTS USED:") ? (
                              <>
                                <div className="mb-3 p-2 bg-blue-900/20 border border-blue-800 rounded text-blue-100">
                                  <strong>Documents Used:</strong> {contextData.split("\n\n")[0].replace("DOCUMENTS USED:", "")}
                                </div>
                                <div className="text-gray-400">
                                  {contextData.split("\n\n").slice(1).join("\n\n")}
                                </div>
                              </>
                            ) : (
                              <div className="text-gray-400">
                                {contextData}
                              </div>
                            )}
                          </div>
                        </details>
                        <div className="my-4 border-t border-gray-800"></div>
                      </div>
                    ) : null}
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                          h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-700 pl-4 italic my-4" {...props} />,
                          a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          code: ({node, inline, ...props}) =>
                            inline
                              ? <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
                              : <code className="block bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />,
                          hr: ({node, ...props}) => <hr className="my-6 border-gray-700" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full border border-gray-700" {...props} /></div>,
                          thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
                          tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-700" {...props} />,
                          tr: ({node, ...props}) => <tr className="border-b border-gray-700" {...props} />,
                          th: ({node, ...props}) => <th className="px-4 py-2 text-left text-sm font-medium" {...props} />,
                          td: ({node, ...props}) => <td className="px-4 py-2 text-sm" {...props} />,
                        }}
                      >
                        {generatedContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    {isGenerating ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                        <p>Generating newsletter...</p>
                      </div>
                    ) : (
                      <p>Generated content will appear here</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
