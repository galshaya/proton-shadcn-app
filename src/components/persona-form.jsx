import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function PersonaForm({ persona, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: persona?.name || "",
    email: persona?.email || "",
    description: persona?.description || "",
    status: persona?.status || "active"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Name</Label>
          <Input
            id="name"
            placeholder="Enter persona name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-[#1e1f23] border-[#2d2e33] text-white placeholder:text-gray-500 focus:border-[#e80566] focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter persona email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="bg-[#1e1f23] border-[#2d2e33] text-white placeholder:text-gray-500 focus:border-[#e80566] focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe this persona"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#1e1f23] border-[#2d2e33] text-white placeholder:text-gray-500 focus:border-[#e80566] focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="bg-[#1e1f23] border-[#2d2e33] text-white focus:ring-0 focus:border-[#e80566]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1f23] border-[#2d2e33] text-white">
              <SelectItem value="active" className="focus:bg-[#2d2e33] focus:text-white">
                <div className="flex items-center">
                  <Badge className="bg-green-500 mr-2">Active</Badge>
                  <span>Active</span>
                </div>
              </SelectItem>
              <SelectItem value="inactive" className="focus:bg-[#2d2e33] focus:text-white">
                <div className="flex items-center">
                  <Badge className="bg-yellow-500 mr-2">Inactive</Badge>
                  <span>Inactive</span>
                </div>
              </SelectItem>
              <SelectItem value="archived" className="focus:bg-[#2d2e33] focus:text-white">
                <div className="flex items-center">
                  <Badge className="bg-gray-500 mr-2">Archived</Badge>
                  <span>Archived</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-[#e80566] hover:bg-[#c30552] text-white"
        >
          {persona ? 'Update' : 'Create'} Persona
        </Button>
      </div>
    </form>
  );
} 