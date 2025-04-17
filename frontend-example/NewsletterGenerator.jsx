'use client';

import { useState, useEffect } from 'react';
import { newsletterApi, scrapingPackagesApi, personasApi } from './apiClient';

/**
 * Component for generating newsletters
 */
export default function NewsletterGenerator() {
  // Form state
  const [formData, setFormData] = useState({
    model: 'gpt-4o',
    date_range: 'all',
    package_ids: [],
    search_query: '',
    client_context: '',
    project_context: '',
    prompt: '',
    persona_id: '',
    article_limit: 10,
  });
  
  // Data state
  const [packages, setPackages] = useState([]);
  const [personas, setPersonas] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  // Load packages and personas on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [packagesData, personasData] = await Promise.all([
          scrapingPackagesApi.getAll(),
          personasApi.getAll(),
        ]);
        
        setPackages(packagesData);
        setPersonas(personasData);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        console.error('Failed to load data:', err);
      }
    };
    
    loadData();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox inputs
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'package_ids' && type === 'select-multiple') {
      // Handle multi-select for package_ids
      const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        package_ids: selectedOptions,
      }));
    } else {
      // Handle other inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const result = await newsletterApi.generate(formData);
      setResult(result);
    } catch (err) {
      setError(err.message);
      console.error('Failed to generate newsletter:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Newsletter Generator</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={handleSubmit}>
            {/* Model selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Model</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              </select>
            </div>
            
            {/* Date range */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                name="date_range"
                value={formData.date_range}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
            
            {/* Scraping packages */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Scraping Packages</label>
              <select
                name="package_ids"
                multiple
                value={formData.package_ids}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
              >
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple packages
              </p>
            </div>
            
            {/* Search query */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Search Query</label>
              <input
                type="text"
                name="search_query"
                value={formData.search_query}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., artificial intelligence healthcare"
              />
            </div>
            
            {/* Persona */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Persona</label>
              <select
                name="persona_id"
                value={formData.persona_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">None</option>
                {personas.map((persona) => (
                  <option key={persona._id} value={persona._id}>
                    {persona.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Client context */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Client Context</label>
              <textarea
                name="client_context"
                value={formData.client_context}
                onChange={handleChange}
                className="w-full p-2 border rounded h-20"
                placeholder="Information about the client..."
              />
            </div>
            
            {/* Project context */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Project Context</label>
              <textarea
                name="project_context"
                value={formData.project_context}
                onChange={handleChange}
                className="w-full p-2 border rounded h-20"
                placeholder="Information about the project..."
              />
            </div>
            
            {/* Prompt */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Prompt</label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
                placeholder="Instructions for newsletter generation..."
                required
              />
            </div>
            
            {/* Article limit */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Article Limit</label>
              <input
                type="number"
                name="article_limit"
                value={formData.article_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
                max="50"
              />
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Newsletter'}
            </button>
          </form>
        </div>
        
        {/* Result */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Generated Newsletter</h2>
          
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!loading && !result && (
            <div className="text-gray-500 h-64 flex items-center justify-center">
              <p>Newsletter will appear here after generation</p>
            </div>
          )}
          
          {result && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Generated using {result.articles_count} articles
                </p>
              </div>
              
              <div className="prose max-w-none">
                {/* Display the generated content */}
                <div dangerouslySetInnerHTML={{ __html: result.generated_content.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
