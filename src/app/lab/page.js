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
  const handlePersonaSelect = async (personaId) => {
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

    try {
      // Fetch the persona directly from the API to ensure we have the latest data
      const response = await fetch(`http://localhost:5001/api/personas/${personaId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch persona: ${response.status} ${response.statusText}`);
      }

      const persona = await response.json();
      console.log("Fetched persona from API:", JSON.stringify(persona, null, 2));

      if (persona) {
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

        // Update form data with selected persona
        const newFormData = {
          name: persona.name,
          description: persona.description,
          inputs: {
            model_name: persona.inputs?.model_name || "gpt-4o",
            date_range: persona.inputs?.date_range || "all time",
            search_query: persona.inputs?.search_query || "",
            client_context: persona.inputs?.client_context || "",
            project_context: persona.inputs?.project_context || "",
            prompt: persona.inputs?.prompt || "",
            package_ids: [...package_ids], // Create a new array to ensure it's a new reference
            document_ids: [...document_ids] // Create a new array to ensure it's a new reference
          },
          documents: documents.map(doc => ({...doc})) // Deep clone to ensure new references
        };

        console.log("Setting form data to:", JSON.stringify(newFormData, null, 2));

        // Update form data
        setFormData(newFormData);

        // Update selected persona ID
        setSelectedPersonaId(personaId);

        // Show success toast
        toast({
          title: "Persona Loaded",
          description: `Successfully loaded persona: ${persona.name}`,
        });
      }
    } catch (error) {
      console.error("Error loading persona:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load persona: ${error.message}`,
      });
    }
  }

  // Generate newsletter
  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedContent("")

    try {
      console.log("Starting newsletter generation with form data:", JSON.stringify(formData, null, 2));

      // Ensure document_ids is always an array
      const document_ids = Array.isArray(formData.inputs?.document_ids)
        ? [...formData.inputs.document_ids]
        : [];

      // Ensure package_ids is always an array
      const package_ids = Array.isArray(formData.inputs?.package_ids)
        ? [...formData.inputs.package_ids]
        : [];

      console.log("Document IDs for newsletter generation:", document_ids);
      console.log("Package IDs for newsletter generation:", package_ids);

      // Prepare data for API - following the updated API documentation
      // We only need to pass document_ids, and the backend will handle retrieving and processing the content
      const requestData = {
        model: formData.inputs.model_name || "gpt-4o",
        date_range: formData.inputs.date_range || "all time",
        search_query: formData.inputs.search_query || "",
        client_context: formData.inputs.client_context || "",
        project_context: formData.inputs.project_context || "",
        prompt: formData.inputs.prompt || "",
        package_ids: package_ids,
        document_ids: document_ids // This is the key field - just pass the IDs
      };

      console.log("Sending request data to API:", JSON.stringify(requestData, null, 2));

      // Call the API - no special headers needed, just pass the document IDs
      const response = await fetch('http://localhost:5001/api/newsletter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate newsletter: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response:", JSON.stringify({
        ...data,
        context_used: data.context_used ? `${data.context_used.substring(0, 100)}...` : null,
        outputs: data.outputs ? {
          ...data.outputs,
          context_used: data.outputs.context_used ? `${data.outputs.context_used.substring(0, 100)}...` : null
        } : null
      }, null, 2));

      // Extract the content from the response
      // If there's outputs.content field (new schema), use that
      // Otherwise, try generated_content, content, text, or stringify the whole response
      const content =
        (data.outputs && data.outputs.content) ||
        data.generated_content ||
        data.content ||
        data.text ||
        JSON.stringify(data, null, 2);

      setGeneratedContent(content);

      // Store the context separately if available
      if (data.outputs?.context_used || data.context_used) {
        const contextUsed = data.outputs?.context_used || data.context_used;

        // Add document information to the context if documents were used
        if (document_ids.length > 0) {
          // Get document names from the form data
          const documentNames = formData.documents
            .filter(doc => document_ids.includes(doc.id))
            .map(doc => doc.name)
            .join(", ");

          const documentContext = `DOCUMENTS USED:\n${documentNames}\n\n${contextUsed}`;
          setContextData(documentContext);
        } else {
          setContextData(contextUsed);
        }
      }

      toast({
        title: "Success",
        description: "Newsletter generated successfully",
      });
    } catch (error) {
      console.error("Error generating newsletter:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate newsletter: ${error.message}`,
      });
      setGeneratedContent(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  // Save persona to database
  const handleSavePersona = async () => {
    setIsLoading(true)

    try {
      console.log("Starting save persona operation with formData:", JSON.stringify(formData, null, 2));
      console.log("Selected persona ID:", selectedPersonaId);

      // Deep clone the form data to avoid reference issues
      const clonedFormData = JSON.parse(JSON.stringify(formData));

      // Ensure package_ids is always an array
      const package_ids = Array.isArray(clonedFormData.inputs?.package_ids)
        ? [...clonedFormData.inputs.package_ids]
        : [];

      // Ensure document_ids is always an array
      const document_ids = Array.isArray(clonedFormData.inputs?.document_ids)
        ? [...clonedFormData.inputs.document_ids]
        : [];

      // Ensure documents is always an array
      const documents = Array.isArray(clonedFormData.documents)
        ? clonedFormData.documents.map(doc => ({...doc}))  // Deep clone each document
        : [];

      console.log("Saving persona with package IDs:", package_ids);
      console.log("Saving persona with document IDs:", document_ids);
      console.log("Saving persona with documents:", JSON.stringify(documents, null, 2));

      // Make sure document_ids and documents are in sync
      // Create a map of existing documents by ID for quick lookup
      const documentMap = {};
      documents.forEach(doc => {
        if (doc && doc.id) {
          documentMap[doc.id] = doc;
        }
      });

      // Add any document IDs that are in documents but not in document_ids
      const documentIdsFromDocuments = documents.map(doc => doc.id);
      const missingDocumentIds = documentIdsFromDocuments.filter(id => !document_ids.includes(id));

      if (missingDocumentIds.length > 0) {
        console.log("Adding missing document IDs to document_ids:", missingDocumentIds);
        document_ids.push(...missingDocumentIds);
      }

      // Add any documents that are in document_ids but not in documents
      const missingDocuments = document_ids.filter(id => !documentIdsFromDocuments.includes(id));

      if (missingDocuments.length > 0) {
        console.log("Fetching missing documents:", missingDocuments);
        try {
          const fetchedDocuments = await Promise.all(
            missingDocuments.map(async (docId) => {
              try {
                const response = await fetch(`http://localhost:5001/api/documents/${docId}`);
                if (!response.ok) {
                  console.warn(`Failed to fetch document ${docId}: ${response.status} ${response.statusText}`);
                  return null;
                }
                const docData = await response.json();

                // Transform API response to match the expected document format
                return {
                  id: docData._id,
                  name: docData.document_name,
                  type: docData.document_type,
                  uploadedAt: docData.upload_date
                };
              } catch (error) {
                console.warn(`Error fetching document ${docId}:`, error);
                return null;
              }
            })
          );

          // Filter out null values and add to documents
          const validDocuments = fetchedDocuments.filter(doc => doc !== null);
          console.log("Fetched documents:", JSON.stringify(validDocuments, null, 2));

          // Add fetched documents to the documents array
          validDocuments.forEach(doc => {
            if (!documentMap[doc.id]) {
              documents.push(doc);
              documentMap[doc.id] = doc;
            }
          });
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      }

      // Prepare the data to save
      const personaData = {
        name: clonedFormData.name,
        description: clonedFormData.description,
        inputs: {
          ...clonedFormData.inputs,
          model_name: clonedFormData.inputs.model_name || "gpt-4.1",
          date_range: clonedFormData.inputs.date_range || "all time",
          package_ids: [...package_ids], // Create a new array to ensure it's a new reference
          document_ids: [...document_ids] // Create a new array to ensure it's a new reference
        },
        documents: documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          uploadedAt: doc.uploadedAt
        }))
      };

      console.log("Saving persona data:", JSON.stringify(personaData, null, 2));

      let response;
      let savedPersona;

      if (selectedPersonaId && selectedPersonaId !== "_new") {
        // Update existing persona
        console.log(`Updating existing persona with ID: ${selectedPersonaId}`);
        response = await fetch(`http://localhost:5001/api/personas/${selectedPersonaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(personaData),
        });
      } else {
        // Create new persona
        console.log("Creating new persona");
        response = await fetch('http://localhost:5001/api/personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(personaData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save persona: ${response.status} ${response.statusText} - ${errorText}`);
      }

      savedPersona = await response.json();
      console.log("Saved persona response:", JSON.stringify(savedPersona, null, 2));

      // Refresh personas list
      const personasResponse = await fetch('http://localhost:5001/api/personas');
      if (!personasResponse.ok) {
        throw new Error(`Failed to fetch personas: ${personasResponse.status} ${personasResponse.statusText}`);
      }

      const personasData = await personasResponse.json();
      console.log("Fetched personas:", JSON.stringify(personasData, null, 2));

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
      }));

      setPersonas(transformedPersonas);

      // Update selected persona ID if creating new
      if (!selectedPersonaId || selectedPersonaId === "_new") {
        console.log(`Setting selected persona ID to: ${savedPersona._id}`);
        setSelectedPersonaId(savedPersona._id);
      }

      // Update the form data with the saved persona data to ensure consistency
      const updatedFormData = {
        name: savedPersona.name,
        description: savedPersona.description,
        inputs: {
          ...(savedPersona.inputs || {}),
          model_name: savedPersona.inputs?.model_name || "gpt-4.1",
          date_range: savedPersona.inputs?.date_range || "all time",
          package_ids: savedPersona.inputs?.package_ids || [],
          document_ids: savedPersona.inputs?.document_ids || []
        },
        documents: savedPersona.documents || []
      };

      console.log("Updating form data with saved persona:", JSON.stringify(updatedFormData, null, 2));
      setFormData(updatedFormData);

      toast({
        title: "Success",
        description: `Persona ${selectedPersonaId && selectedPersonaId !== "_new" ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error("Error saving persona:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save persona: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
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
  const handleImportPersona = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        console.log("Imported data:", JSON.stringify(importedData, null, 2));

        // Initialize variables for persona data
        let name = "";
        let description = "";
        let inputs = {};
        let documents = [];
        let document_ids = [];
        let package_ids = [];

        // Handle different JSON structures
        if (importedData.name && importedData.description) {
          // Case 1: Standard persona format with name, description, inputs
          name = importedData.name;
          description = importedData.description;

          // Handle inputs
          if (importedData.inputs) {
            inputs = importedData.inputs;
          } else if (importedData.prompt) {
            // Legacy format with prompt at top level
            inputs = {
              model_name: "gpt-4o",
              date_range: "all time",
              prompt: importedData.prompt
            };
          }

          // Handle documents
          if (Array.isArray(importedData.documents)) {
            documents = [...importedData.documents];
          }

        } else if (importedData.inputs) {
          // Case 2: Just inputs object or inputs+outputs format
          inputs = importedData.inputs;

          // Generate name from search query or model
          name = inputs.search_query
            ? `Persona for ${inputs.search_query.split(',')[0]}`
            : `${inputs.model_name || 'AI'} Persona`;

          // Generate description from context fields
          description = inputs.client_context || inputs.project_context || "Imported persona";

          // Handle documents if present
          if (Array.isArray(importedData.documents)) {
            documents = [...importedData.documents];
          }
        } else {
          throw new Error("Invalid persona data: missing required fields or unsupported format");
        }

        // Ensure package_ids is always an array
        package_ids = Array.isArray(inputs.package_ids) ? [...inputs.package_ids] : [];

        // Ensure document_ids is always an array
        document_ids = Array.isArray(inputs.document_ids) ? [...inputs.document_ids] : [];

        // Remove duplicates from document_ids
        document_ids = [...new Set(document_ids)];

        console.log("Package IDs:", package_ids);
        console.log("Document IDs:", document_ids);
        console.log("Documents:", JSON.stringify(documents, null, 2));

        // Create a map of existing documents by ID for quick lookup
        const documentMap = {};
        documents.forEach(doc => {
          if (doc && doc.id) {
            documentMap[doc.id] = doc;
          }
        });

        // If we have document IDs that aren't in the documents array, fetch them from the API
        const missingDocIds = document_ids.filter(id => !documentMap[id]);

        if (missingDocIds.length > 0) {
          try {
            console.log("Fetching missing documents from API:", missingDocIds);
            const fetchedDocuments = await Promise.all(
              missingDocIds.map(async (docId) => {
                try {
                  const response = await fetch(`http://localhost:5001/api/documents/${docId}`);
                  if (!response.ok) {
                    console.warn(`Failed to fetch document ${docId}: ${response.status} ${response.statusText}`);
                    return null;
                  }
                  const docData = await response.json();

                  // Transform API response to match the expected document format
                  return {
                    id: docData._id,
                    name: docData.document_name,
                    type: docData.document_type,
                    uploadedAt: docData.upload_date
                  };
                } catch (error) {
                  console.warn(`Error fetching document ${docId}:`, error);
                  return null;
                }
              })
            );

            // Filter out null values and add to documents
            const validDocuments = fetchedDocuments.filter(doc => doc !== null);
            console.log("Fetched documents:", JSON.stringify(validDocuments, null, 2));

            // Add fetched documents to the documents array
            validDocuments.forEach(doc => {
              if (!documentMap[doc.id]) {
                documents.push(doc);
                documentMap[doc.id] = doc;
              }
            });
          } catch (error) {
            console.error("Error fetching documents:", error);
          }
        }

        // Ensure all document_ids have corresponding documents
        // If not, add the ID to the document_ids array
        documents.forEach(doc => {
          if (doc && doc.id && !document_ids.includes(doc.id)) {
            document_ids.push(doc.id);
          }
        });

        // Create the final form data object
        const newFormData = {
          name: name,
          description: description,
          inputs: {
            model_name: inputs.model_name || "gpt-4o",
            date_range: inputs.date_range || "all time",
            search_query: inputs.search_query || "",
            client_context: inputs.client_context || "",
            project_context: inputs.project_context || "",
            prompt: inputs.prompt || "",
            package_ids: package_ids,
            document_ids: document_ids,
            article_limit: inputs.article_limit || "10"
          },
          documents: documents.map(doc => ({...doc})) // Deep clone to ensure new references
        };

        console.log("Setting form data to:", JSON.stringify(newFormData, null, 2));
        setFormData(newFormData);

        // Reset selected persona
        setSelectedPersonaId("");

        toast({
          title: "Success",
          description: "Persona imported successfully",
        });
      } catch (error) {
        console.error("Error importing persona:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to import persona: ${error.message}`,
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = null;
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
                key={selectedPersonaId || JSON.stringify(formData)} // Add key to force re-render when formData changes
                persona={selectedPersonaId && selectedPersonaId !== "_new" ? personas.find(p => p.id === selectedPersonaId) : formData}
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
