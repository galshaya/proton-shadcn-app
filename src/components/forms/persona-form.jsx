"use client"

import { useState } from "react"
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
import { Plus, X, Trash } from "lucide-react"

export function PersonaForm({ persona, recipients = [], scrapingPackages = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: persona?.name || "",
    description: persona?.description || "",
    inputs: {
      model_name: persona?.inputs?.model_name || "gpt-4o",
      date_range: persona?.inputs?.date_range || "all time",
      search_query: persona?.inputs?.search_query || "",
      client_context: persona?.inputs?.client_context || "",
      project_context: persona?.inputs?.project_context || "",
      prompt: persona?.inputs?.prompt || persona?.prompt || "",
      package_ids: persona?.inputs?.package_ids || []
    },
    selectedRecipients: persona?.recipients || [],
  })

  const availableRecipients = recipients.filter(
    (recipient) => !formData.selectedRecipients.includes(recipient.id)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
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