"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * MetaPrompt component that extracts editable fields from a template
 * 
 * @param {Object} props
 * @param {string} props.template - The template string with [FIELD_NAME] placeholders
 * @param {Object} props.fieldValues - Current values for the fields
 * @param {Function} props.onChange - Callback when field values change
 * @param {string} props.className - Additional CSS classes
 */
export function MetaPrompt({ template, fieldValues = {}, onChange, className }) {
  const [fields, setFields] = useState([]);
  const [processedTemplate, setProcessedTemplate] = useState("");
  
  // Extract fields from template on mount or when template changes
  useEffect(() => {
    if (!template) return;
    
    // Extract all fields in square brackets
    const fieldRegex = /\[(.*?)\]/g;
    const extractedFields = [];
    let match;
    
    while ((match = fieldRegex.exec(template)) !== null) {
      extractedFields.push({
        id: match[1].trim().toLowerCase().replace(/\s+/g, '_'),
        name: match[1].trim(),
        placeholder: `Enter ${match[1].trim().toLowerCase()}`,
        value: fieldValues[match[1].trim().toLowerCase().replace(/\s+/g, '_')] || ""
      });
    }
    
    // Remove duplicates by id
    const uniqueFields = extractedFields.filter((field, index, self) => 
      index === self.findIndex(f => f.id === field.id)
    );
    
    setFields(uniqueFields);
  }, [template, fieldValues]);
  
  // Generate the processed template with field values
  useEffect(() => {
    if (!template || fields.length === 0) return;
    
    let processed = template;
    fields.forEach(field => {
      const value = fieldValues[field.id] || "";
      processed = processed.replace(
        new RegExp(`\\[${field.name}\\]`, 'g'), 
        value ? value : `[${field.name}]`
      );
    });
    
    setProcessedTemplate(processed);
  }, [template, fields, fieldValues]);
  
  // Handle field value changes
  const handleFieldChange = (id, value) => {
    if (onChange) {
      onChange({ ...fieldValues, [id]: value });
    }
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Editable fields */}
      <Card className="bg-[#111] border-gray-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-gray-300 font-light">
                  {field.name}
                </Label>
                <Input
                  id={field.id}
                  value={fieldValues[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Preview of the processed template */}
      <div className="bg-[#111] border border-gray-800 rounded-md p-4 text-gray-300 text-sm">
        <p className="text-xs text-gray-500 mb-2">Preview:</p>
        <div className="whitespace-pre-wrap">
          {processedTemplate.split(/\[(.*?)\]/).map((part, index) => {
            // Check if this part is a field placeholder (odd indices in the split result)
            const isPlaceholder = index % 2 === 1;
            return isPlaceholder ? (
              <span key={index} className="bg-yellow-600/20 text-yellow-400 px-1 rounded">
                [Missing: {part}]
              </span>
            ) : (
              <span key={index}>{part}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Utility function to get the final prompt with all fields filled in
 * 
 * @param {string} template - The template string with [FIELD_NAME] placeholders
 * @param {Object} fieldValues - Values for the fields
 * @returns {string} - The processed prompt
 */
export function getProcessedPrompt(template, fieldValues) {
  if (!template) return "";
  
  let processed = template;
  const fieldRegex = /\[(.*?)\]/g;
  let match;
  
  while ((match = fieldRegex.exec(template)) !== null) {
    const fieldId = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    const value = fieldValues[fieldId] || "";
    processed = processed.replace(
      new RegExp(`\\[${match[1]}\\]`, 'g'), 
      value
    );
  }
  
  return processed;
}
