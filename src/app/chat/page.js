"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Import API client
import apiClient from "@/lib/apiClient"

export default function ChatPage() {
  // State for chat messages
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage if available
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages')
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // State for context panel
  const [scrapingPackages, setScrapingPackages] = useState([])
  const [formData, setFormData] = useState({
    model: "gpt-4.1",
    useWebSearch: false,
    package_ids: []
  })

  // Reference to track the latest package_ids for API calls
  const packageIdsRef = useRef([])

  // Debug log for initial state and keep packageIdsRef in sync
  useEffect(() => {
    console.log("formData state updated:", formData);
    // Keep the ref in sync with the state
    packageIdsRef.current = formData.package_ids;
  }, [formData])

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null)

  // Load scraping packages and documents on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load scraping packages
        const packagesData = await apiClient.scrapingPackages.getAll()
        console.log("Loaded scraping packages:", packagesData)

        // Debug log to see the structure of the first package
        if (packagesData && packagesData.length > 0) {
          console.log("First package structure:", JSON.stringify(packagesData[0], null, 2));
          console.log("Package ID field:", packagesData[0]._id || packagesData[0].id);
        }

        setScrapingPackages(packagesData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content sources and documents"
        })
      }
    }

    loadData()
  }, [])

  // Auto-scroll to bottom when messages change and save to localStorage
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Save messages to localStorage
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Clear chat history
  const handleClearChat = () => {
    setMessages([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
    }
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared."
    })
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Create context from previous messages
      const previousMessages = messages.map(msg =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');

      const contextPrefix = previousMessages ?
        `Previous conversation:\n${previousMessages}\n\nContinue the conversation based on the above context. User's new message: ` : '';

      // Debug log for package IDs
      console.log("Selected package IDs from state:", formData.package_ids);
      console.log("Selected package IDs from ref:", packageIdsRef.current);

      // Get the current package IDs
      const currentPackageIds = formData.package_ids || [];

      // Log the exact package IDs we're sending
      console.log("Sending package IDs in the request:", currentPackageIds);

      // Create a request object with the correct field names
      const requestParams = {
        message: contextPrefix + inputMessage,
        model: formData.model,
        packageIds: currentPackageIds,
        useWebSearch: formData.useWebSearch
      };

      // Log the full request parameters
      console.log("Full request parameters:", JSON.stringify(requestParams, null, 2));

      // Use the chat API instead of newsletter API
      const response = await apiClient.chat.sendMessage(requestParams)

      // Log the request that was sent
      console.log("Request sent with package IDs:", currentPackageIds);

      console.log("API response:", response);

      // Add assistant message to chat
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.generated_content || response.content || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      // Add error message to chat
      const errorMessage = {
        id: `system-${Date.now()}`,
        role: "system",
        content: "An error occurred while generating a response. Please try again.",
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate response. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check if web search is available for the selected model
  const isWebSearchAvailable = ["gpt-4.1", "gpt-4o", "o3", "o4-mini"].includes(formData.model)

  // Model options
  const modelOptions = [
    { value: "gpt-4.1", label: "GPT-4.1" },
    { value: "o4-mini", label: "o4-mini" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "o3", label: "o3" },
    { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Proton Chat</h1>
          <p className="text-gray-400">Chat with AI using your content sources and documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Context Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat Settings</CardTitle>
              <CardDescription>
                Configure the AI model and context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model selection */}
              <div className="space-y-2">
                <Label htmlFor="model_name" className="text-gray-300 font-light">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({...formData, model: value})}
                >
                  <SelectTrigger id="model_name" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-800 text-white">
                    {modelOptions.map((option, index) => (
                      <SelectItem key={`model-${option.value}-${index}`} value={option.value} className="focus:bg-gray-800 focus:text-white">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Web search toggle */}
              {isWebSearchAvailable && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use_web_search"
                    checked={formData.useWebSearch}
                    onCheckedChange={(checked) => setFormData({...formData, useWebSearch: checked})}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label
                    htmlFor="use_web_search"
                    className="text-sm font-light text-gray-300"
                  >
                    Enable web search
                  </Label>
                </div>
              )}

              <Separator className="bg-gray-800" />

              {/* Scraping Packages section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Content Sources</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {scrapingPackages.length === 0 ? (
                    <p className="text-sm text-gray-500">No content sources available</p>
                  ) : (
                    scrapingPackages.map((pkg, index) => (
                      <div key={`pkg-${pkg._id || pkg.id || index}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`package-${pkg._id || pkg.id || index}`}
                          checked={(pkg._id && formData.package_ids.includes(pkg._id)) || (pkg.id && formData.package_ids.includes(pkg.id))}
                          onCheckedChange={(checked) => {
                            // Use _id which is the MongoDB ID field
                            const packageId = pkg._id || pkg.id;

                            if (checked && packageId) {
                              const newPackageIds = [...(formData.package_ids || []), packageId];
                              console.log("Adding package ID:", packageId, "New package IDs:", newPackageIds);
                              // Update the ref with the latest value
                              packageIdsRef.current = newPackageIds;
                              setFormData(prev => ({
                                ...prev,
                                package_ids: newPackageIds
                              }));
                            } else if (packageId) {
                              const newPackageIds = (formData.package_ids || []).filter(id => id !== packageId);
                              console.log("Removing package ID:", packageId, "New package IDs:", newPackageIds);
                              // Update the ref with the latest value
                              packageIdsRef.current = newPackageIds;
                              setFormData(prev => ({
                                ...prev,
                                package_ids: newPackageIds
                              }));
                            }
                          }}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label
                          htmlFor={`package-${pkg._id || pkg.id}`}
                          className="text-sm font-light text-gray-300 cursor-pointer"
                        >
                          {pkg.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>




            </CardContent>
          </Card>
        </div>

        {/* Right column - Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col w-full" style={{ maxHeight: "calc(100vh - 12rem)" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Chat</CardTitle>
                <CardDescription>
                  Chat with the AI using your selected context
                </CardDescription>
              </div>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col overflow-hidden">
              {/* Chat messages */}
              <div
                className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2 w-full"
                style={{ overflowX: "hidden" }}
              >
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Send a message to start chatting</p>
                  </div>
                ) : (
                  <div className="space-y-4 w-full max-w-full">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        } w-full`}
                      >
                        <div
                          className={`p-4 rounded-lg ${message.role === "assistant" ? "max-w-[90%] min-w-[50%]" : "max-w-[85%]"} ${
                            message.role === "user"
                              ? "bg-blue-600/20 border border-blue-600/30"
                              : message.role === "assistant"
                                ? "bg-[#111] border border-gray-800"
                                : "bg-red-600/20 border border-red-600/30"
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-medium text-gray-400">
                              {message.role === "user"
                                ? "You"
                                : message.role === "assistant"
                                  ? "Proton AI"
                                  : "System"}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="prose prose-invert break-words overflow-hidden max-w-full">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                p: ({node, ...props}) => <p className="mb-3 overflow-wrap-anywhere" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-700 pl-3 italic my-3" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                code: ({node, inline, className, ...props}) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return inline ? (
                                    <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
                                  ) : (
                                    <div className="bg-gray-800 rounded-md my-3 overflow-hidden">
                                      {match && (
                                        <div className="bg-gray-700 px-3 py-1 text-xs text-gray-300 border-b border-gray-600">
                                          {match[1]}
                                        </div>
                                      )}
                                      <pre className="p-3 overflow-x-auto">
                                        <code className="text-sm" {...props} />
                                      </pre>
                                    </div>
                                  );
                                },
                                hr: ({node, ...props}) => <hr className="my-4 border-gray-700" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto my-3"><table className="min-w-full border border-gray-700" {...props} /></div>,
                                thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
                                tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-700" {...props} />,
                                tr: ({node, ...props}) => <tr className="border-b border-gray-700" {...props} />,
                                th: ({node, ...props}) => <th className="px-3 py-1 text-left text-sm font-medium" {...props} />,
                                td: ({node, ...props}) => <td className="px-3 py-1 text-sm" {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="bg-[#111] border-gray-800 text-white resize-none min-h-[80px]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-10 px-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
