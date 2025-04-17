'use client';

import { useState, useEffect } from 'react';
import { personasApi } from './apiClient';

/**
 * Component for creating or editing a persona
 * @param {Object} props - Component props
 * @param {string} props.id - Persona ID (if editing)
 * @param {Function} props.onSuccess - Callback function on successful save
 */
export default function PersonaForm({ id, onSuccess }) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load persona data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadPersona(id);
    }
  }, [id]);
  
  // Function to load persona data
  const loadPersona = async (personaId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await personasApi.getById(personaId);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        prompt: data.prompt || '',
      });
    } catch (err) {
      setError('Failed to load persona: ' + err.message);
      console.error('Failed to load persona:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!formData.prompt.trim()) {
        throw new Error('Prompt is required');
      }
      
      // Create or update persona
      let result;
      if (isEditing) {
        result = await personasApi.update(id, formData);
      } else {
        result = await personasApi.create(formData);
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Reset form if creating new persona
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          prompt: '',
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to save persona:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">
        {isEditing ? 'Edit Persona' : 'Create Persona'}
      </h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Growth Marketer"
            required
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., High-level overview focused on trends"
          />
        </div>
        
        {/* Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="prompt">
            Prompt *
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            placeholder="e.g., Summarize key industry shifts with a growth marketing focus"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This prompt will be used to guide the AI when generating newsletters with this persona.
          </p>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Persona' : 'Create Persona')}
          </button>
        </div>
      </form>
    </div>
  );
}
