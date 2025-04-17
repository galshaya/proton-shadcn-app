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
import { Plus, X } from "lucide-react"

export function PersonaForm({ persona, recipients = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: persona?.name || "",
    description: persona?.description || "",
    prompt: persona?.prompt || "",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Persona Name</Label>
          <Input
            id="name"
            placeholder="Enter persona name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter persona description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Enter persona prompt for AI generation"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">This prompt will guide the AI when generating content for this persona.</p>
        </div>

        <div className="space-y-4">
          <Label>Recipients</Label>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Assigned Recipients
              </CardTitle>
              <CardDescription>
                Select recipients to assign to this persona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.selectedRecipients.map((recipientId) => {
                  const recipient = recipients.find((r) => r.id === recipientId)
                  return (
                    <Badge
                      key={recipientId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {recipient?.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(recipientId)}
                        className="ml-1 hover:bg-secondary rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
              {availableRecipients.length > 0 && (
                <Select
                  onValueChange={handleAddRecipient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {persona ? "Update Persona" : "Create Persona"}
        </Button>
      </div>
    </form>
  )
}