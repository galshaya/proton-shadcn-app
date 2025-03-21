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
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ScrapingPackageConfigForm({ config, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    schedule: {
      frequency: config?.schedule?.frequency || "daily",
      time: config?.schedule?.time || "09:00",
      days: config?.schedule?.days || ["monday", "wednesday", "friday"],
      date: config?.schedule?.date || new Date(),
    },
    filters: {
      keywords: config?.filters?.keywords || [],
      excludeKeywords: config?.filters?.excludeKeywords || [],
      minWordCount: config?.filters?.minWordCount || 100,
      maxWordCount: config?.filters?.maxWordCount || 1000,
      includeImages: config?.filters?.includeImages || true,
      includePDF: config?.filters?.includePDF || false,
    },
    status: config?.status || "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={formData.schedule.frequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, frequency: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={formData.schedule.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, time: e.target.value },
                  })
                }
              />
            </div>

            {formData.schedule.frequency === "weekly" && (
              <div className="space-y-2">
                <Label>Days</Label>
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
                        className="capitalize"
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
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.schedule.date && "text-muted-foreground"
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
                  <PopoverContent className="w-auto p-0">
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Keywords</Label>
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
              />
            </div>

            <div className="space-y-2">
              <Label>Exclude Keywords</Label>
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Word Count</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.filters.minWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        minWordCount: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Max Word Count</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.filters.maxWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        maxWordCount: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-images">Include Images</Label>
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
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-pdf">Include PDF Documents</Label>
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
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Configuration</Button>
      </div>
    </form>
  );
} 