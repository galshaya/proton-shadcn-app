"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash } from "lucide-react";

export function ScrapingPackageConfigForm({ scrapingPackage, initialData, onSubmit, onCancel }) {
  // Use either scrapingPackage or initialData (for backward compatibility)
  const packageData = scrapingPackage || initialData || {};

  const [formData, setFormData] = useState({
    name: packageData.name || "",
    description: packageData.description || "",
    status: packageData.status || "active",
    sources: packageData.sources || [],
    schedule_interval: packageData.schedule_interval || "1h",
    max_articles_per_run: packageData.max_articles_per_run || 10,
    calculate_embeddings: packageData.calculate_embeddings !== false,
    extract_entities: packageData.extract_entities !== false,
    summarize: packageData.summarize !== false
  });

  // Log the initial data for debugging
  console.log('ScrapingPackageConfigForm initialData:', { scrapingPackage, initialData, formData });

  const [newSource, setNewSource] = useState({ name: "", url: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the sources to match the API's expected format
    const formattedData = {
      ...formData,
      // Ensure each source has a type field set to 'rss'
      sources: formData.sources.map(source => ({
        name: source.name || '',
        url: source.url,
        type: source.type || 'rss'
      }))
    };

    console.log('Submitting form data:', formattedData);
    onSubmit(formattedData);
  };

  const handleAddSource = () => {
    if (newSource.url) { // Only require URL, name can be optional
      setFormData({
        ...formData,
        sources: [...formData.sources, {
          name: newSource.name.trim() || '', // Allow empty name
          url: newSource.url.trim(),
          type: 'rss' // Always set the type to 'rss'
        }]
      });
      setNewSource({ name: "", url: "" });
    }
  };

  const handleRemoveSource = (index) => {
    setFormData({
      ...formData,
      sources: formData.sources.filter((_, i) => i !== index)
    });
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
            className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
          />
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4 mt-6 border-t border-gray-800 pt-4">
          <h3 className="text-sm font-medium text-gray-300">Advanced Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule_interval" className="text-gray-300 font-light">Schedule Interval</Label>
              <select
                id="schedule_interval"
                value={formData.schedule_interval}
                onChange={(e) => setFormData({ ...formData, schedule_interval: e.target.value })}
                className="w-full bg-[#111] border border-gray-800 rounded p-2 text-white"
              >
                <option value="15m">Every 15 minutes</option>
                <option value="30m">Every 30 minutes</option>
                <option value="1h">Every hour</option>
                <option value="2h">Every 2 hours</option>
                <option value="4h">Every 4 hours</option>
                <option value="6h">Every 6 hours</option>
                <option value="12h">Every 12 hours</option>
                <option value="24h">Every 24 hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_articles_per_run" className="text-gray-300 font-light">Max Articles Per Run</Label>
              <Input
                id="max_articles_per_run"
                type="number"
                min="1"
                max="100"
                value={formData.max_articles_per_run}
                onChange={(e) => setFormData({ ...formData, max_articles_per_run: parseInt(e.target.value) })}
                className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-gray-300 font-light">Processing Options</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="calculate_embeddings"
                  checked={formData.calculate_embeddings}
                  onChange={(e) => setFormData({ ...formData, calculate_embeddings: e.target.checked })}
                  className="rounded border-gray-700 bg-[#111] text-white"
                />
                <Label htmlFor="calculate_embeddings" className="text-sm text-gray-300 cursor-pointer">Calculate Embeddings</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="extract_entities"
                  checked={formData.extract_entities}
                  onChange={(e) => setFormData({ ...formData, extract_entities: e.target.checked })}
                  className="rounded border-gray-700 bg-[#111] text-white"
                />
                <Label htmlFor="extract_entities" className="text-sm text-gray-300 cursor-pointer">Extract Entities</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="summarize"
                  checked={formData.summarize}
                  onChange={(e) => setFormData({ ...formData, summarize: e.target.checked })}
                  className="rounded border-gray-700 bg-[#111] text-white"
                />
                <Label htmlFor="summarize" className="text-sm text-gray-300 cursor-pointer">Summarize</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <Label className="text-gray-300 font-light">RSS Feeds</Label>

          {formData.sources.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {formData.sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded border border-gray-800">
                  <div className="flex-1 min-w-0"> {/* min-width: 0 helps with text truncation */}
                    <p className="text-sm font-medium text-white truncate">
                      {source.name || 'Unnamed Feed'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {source.url || 'No URL provided'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSource(index)}
                    className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-800 rounded">
              <p className="text-sm text-gray-400">No RSS feeds added yet</p>
            </div>
          )}

          <div className="space-y-4 mt-4 border-t border-gray-800 pt-4">
            <h4 className="text-sm font-medium text-gray-300">Add New Feed</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sourceName" className="text-xs text-gray-400">Feed Name</Label>
                <Input
                  id="sourceName"
                  placeholder="e.g., TechCrunch"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceUrl" className="text-xs text-gray-400">Feed URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sourceUrl"
                    placeholder="https://example.com/rss"
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="flex-1 bg-[#111] border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSource}
                    disabled={!newSource.url} // Only require URL, name can be optional
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
          {scrapingPackage ? 'Update' : 'Create'} Package
        </Button>
      </div>
    </form>
  );
}