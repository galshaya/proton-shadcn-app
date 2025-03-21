"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function ScrapingPackageForm({ package: pkg, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    description: pkg?.description || "",
    status: pkg?.status || "inactive",
    schedule: {
      frequency: pkg?.schedule?.frequency || "daily",
      time: pkg?.schedule?.time || "09:00",
      days: pkg?.schedule?.days || ["monday"],
    },
    sources: pkg?.sources || [
      {
        name: "TechCrunch",
        enabled: true,
        url: "https://techcrunch.com",
      },
      {
        name: "Reuters Technology",
        enabled: false,
        url: "https://reuters.com/technology",
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleSource = (index) => {
    const newSources = [...formData.sources];
    newSources[index] = {
      ...newSources[index],
      enabled: !newSources[index].enabled,
    };
    setFormData({ ...formData, sources: newSources });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Package Name</Label>
          <Input
            id="name"
            placeholder="Enter package name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe this package's purpose..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Schedule Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.schedule.frequency === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: "daily" }
                })}
              >
                Daily
              </Button>
              <Button
                type="button"
                variant={formData.schedule.frequency === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: "weekly" }
                })}
              >
                Weekly
              </Button>
              <Button
                type="button"
                variant={formData.schedule.frequency === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: "monthly" }
                })}
              >
                Monthly
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={formData.schedule.time}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, time: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.schedule.frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select
                  value={formData.schedule.days[0]}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, days: [value] }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Content Sources</h3>
          <Button type="button" variant="outline" size="sm">Add Source</Button>
        </div>

        <div className="space-y-4">
          {formData.sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{source.name}</p>
                <p className="text-sm text-muted-foreground">{source.url}</p>
              </div>
              <Switch
                checked={source.enabled}
                onCheckedChange={() => toggleSource(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Package</Button>
      </div>
    </form>
  );
} 