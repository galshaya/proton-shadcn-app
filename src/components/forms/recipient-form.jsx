"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, UserCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RecipientForm({ recipient, personas = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: recipient?.name || "",
    email: recipient?.email || "",
    company: recipient?.company || "",
    status: recipient?.status || "active",
    persona_id: recipient?.persona_id || recipient?.persona || "",
    // Keep persona field for backward compatibility
    persona: recipient?.persona_id || recipient?.persona || "",
  })

  const [selectedPersona, setSelectedPersona] = useState(null)

  // Find the selected persona when the form loads or when the persona changes
  useEffect(() => {
    const personaId = formData.persona_id || formData.persona
    if (personaId && personas.length > 0) {
      const persona = personas.find(p => p.id === personaId)
      setSelectedPersona(persona)
    } else {
      setSelectedPersona(null)
    }
  }, [formData, personas])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }))
  }

  const handlePersonaChange = (value) => {
    setFormData(prev => ({
      ...prev,
      persona_id: value,
      persona: value // Update both fields for backward compatibility
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 font-light">Recipient Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter recipient name"
            value={formData.name}
            onChange={handleChange}
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 font-light">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-300 font-light">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={handleChange}
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-gray-300 font-light">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-gray-800 text-white">
              <SelectItem value="active" className="focus:bg-gray-800 focus:text-white">Active</SelectItem>
              <SelectItem value="inactive" className="focus:bg-gray-800 focus:text-white">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {personas.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="persona" className="text-gray-300 font-light">Persona</Label>
            <Select
              value={formData.persona_id}
              onValueChange={handlePersonaChange}
            >
              <SelectTrigger id="persona" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-800 text-white">
                {personas.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id} className="focus:bg-gray-800 focus:text-white">
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Persona Preview */}
            {selectedPersona && (
              <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md border border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-800 rounded-full p-2">
                    <UserCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{selectedPersona.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {selectedPersona.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
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
          <Check className="h-4 w-4 mr-2" />
          {recipient ? "Update Recipient" : "Add Recipient"}
        </Button>
      </div>
    </form>
  )
}