"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
    newsletter_schedule: project?.newsletter_schedule || {
      frequency: "weekly",
      time: "09:00",
      days: ["monday"],
      active: false
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-[#111] border-gray-800 text-white"
          placeholder="Project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-[#111] border-gray-800 text-white"
          placeholder="Project description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-white">Status</Label>
        <Select
          id="status"
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          required
        >
          <SelectTrigger className="bg-[#111] border-gray-800 text-white font-light">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-gray-800 text-white">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          {project ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}