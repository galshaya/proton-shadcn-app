"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function ScrapingPackageConfigForm({ scrapingPackage, personas = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: scrapingPackage?.name || "",
    description: scrapingPackage?.description || "",
    schedule: {
      frequency: scrapingPackage?.schedule?.frequency || "daily",
      time: scrapingPackage?.schedule?.time || "09:00",
      days: scrapingPackage?.schedule?.days || ["monday", "wednesday", "friday"],
      date: scrapingPackage?.schedule?.date || new Date(),
    },
    filters: {
      keywords: scrapingPackage?.filters?.keywords || [],
      excludeKeywords: scrapingPackage?.filters?.excludeKeywords || [],
      minWordCount: scrapingPackage?.filters?.minWordCount || 100,
      maxWordCount: scrapingPackage?.filters?.maxWordCount || 1000,
      includeImages: scrapingPackage?.filters?.includeImages || true,
      includePDF: scrapingPackage?.filters?.includePDF || false,
    },
    personaId: scrapingPackage?.personaId || "",
    status: scrapingPackage?.status || "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="space-y-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 font-light">Package Name</Label>
          <Input
            id="name"
            placeholder="Enter package name"
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
            placeholder="Enter package description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
          />
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger 
            value="schedule" 
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="filters" 
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Filters
          </TabsTrigger>
          <TabsTrigger 
            value="persona" 
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Persona
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Frequency</Label>
              <Select
                value={formData.schedule.frequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, frequency: value },
                  })
                }
              >
                <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-800 text-white">
                  <SelectItem value="daily" className="focus:bg-gray-800 focus:text-white">Daily</SelectItem>
                  <SelectItem value="weekly" className="focus:bg-gray-800 focus:text-white">Weekly</SelectItem>
                  <SelectItem value="monthly" className="focus:bg-gray-800 focus:text-white">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Time</Label>
              <Input
                type="time"
                value={formData.schedule.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, time: e.target.value },
                  })
                }
                className="bg-[#111] border-gray-800 text-white focus:border-gray-700 focus:ring-0"
              />
            </div>

            {formData.schedule.frequency === "weekly" && (
              <div className="space-y-2">
                <Label className="text-gray-300 font-light">Days</Label>
                <div className="flex flex-wrap gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={
                          formData.schedule.days.includes(day)
                            ? "default"
                            : "outline"
                        }
                        className={`capitalize font-light ${
                          formData.schedule.days.includes(day)
                            ? "bg-white text-black hover:bg-gray-200"
                            : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            schedule: {
                              ...formData.schedule,
                              days: formData.schedule.days.includes(day)
                                ? formData.schedule.days.filter((d) => d !== day)
                                : [...formData.schedule.days, day],
                            },
                          })
                        }
                      >
                        {day}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}

            {formData.schedule.frequency === "monthly" && (
              <div className="space-y-2">
                <Label className="text-gray-300 font-light">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-light border-gray-700 bg-[#111] text-white hover:bg-gray-800",
                        !formData.schedule.date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.schedule.date ? (
                        format(formData.schedule.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#111] border-gray-800">
                    <Calendar
                      mode="single"
                      selected={formData.schedule.date}
                      onSelect={(date) =>
                        setFormData({
                          ...formData,
                          schedule: { ...formData.schedule, date },
                        })
                      }
                      initialFocus
                      className="bg-[#111] text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Keywords</Label>
              <Textarea
                placeholder="Enter keywords (one per line)"
                value={formData.filters.keywords.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    filters: {
                      ...formData.filters,
                      keywords: e.target.value.split("\n").filter(Boolean),
                    },
                  })
                }
                className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Exclude Keywords</Label>
              <Textarea
                placeholder="Enter keywords to exclude (one per line)"
                value={formData.filters.excludeKeywords.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    filters: {
                      ...formData.filters,
                      excludeKeywords: e.target.value.split("\n").filter(Boolean),
                    },
                  })
                }
                className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 font-light">Min Word Count</Label>
                <Input
                  type="number"
                  value={formData.filters.minWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        minWordCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-[#111] border-gray-800 text-white focus:border-gray-700 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-light">Max Word Count</Label>
                <Input
                  type="number"
                  value={formData.filters.maxWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        maxWordCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-[#111] border-gray-800 text-white focus:border-gray-700 focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-images"
                  checked={formData.filters.includeImages}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        includeImages: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="include-images" className="text-gray-300 font-light">Include Images</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-pdf"
                  checked={formData.filters.includePDF}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        includePDF: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="include-pdf" className="text-gray-300 font-light">Include PDF Documents</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="persona" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Select Persona</Label>
              <Select
                value={formData.personaId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personaId: value,
                  })
                }
              >
                <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                  <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-800 text-white">
                  {personas.map((persona) => (
                    <SelectItem 
                      key={persona.id} 
                      value={persona.id}
                      className="focus:bg-gray-800 focus:text-white"
                    >
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-light">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value,
                  })
                }
              >
                <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-800 text-white">
                  <SelectItem value="active" className="focus:bg-gray-800 focus:text-white">
                    <div className="flex items-center">
                      <span className="inline-flex items-center w-3 h-3 mr-2 rounded-full bg-green-900/30 text-green-400"></span>
                      <span>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="paused" className="focus:bg-gray-800 focus:text-white">
                    <div className="flex items-center">
                      <span className="inline-flex items-center w-3 h-3 mr-2 rounded-full bg-yellow-900/30 text-yellow-400"></span>
                      <span>Paused</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="draft" className="focus:bg-gray-800 focus:text-white">
                    <div className="flex items-center">
                      <span className="inline-flex items-center w-3 h-3 mr-2 rounded-full bg-gray-800 text-gray-400"></span>
                      <span>Draft</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          {scrapingPackage ? 'Update' : 'Create'} Package
        </Button>
      </div>
    </form>
  );
} 