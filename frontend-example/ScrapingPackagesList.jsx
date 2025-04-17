'use client';

import { useState, useEffect } from 'react';
import { scrapingPackagesApi } from './apiClient';

/**
 * Component for displaying and managing scraping packages
 */
export default function ScrapingPackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load packages on component mount
  useEffect(() => {
    loadPackages();
  }, []);
  
  // Function to load packages from API
  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await scrapingPackagesApi.getAll();
      setPackages(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to delete a package
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }
    
    try {
      await scrapingPackagesApi.delete(id);
      // Refresh the list
      loadPackages();
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete package:', err);
    }
  };
  
  // Render loading state
  if (loading) {
    return <div className="p-4">Loading packages...</div>;
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button 
          className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={loadPackages}
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Render empty state
  if (packages.length === 0) {
    return (
      <div className="p-4">
        <p>No scraping packages found.</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {/* Navigate to create page */}}
        >
          Create Package
        </button>
      </div>
    );
  }
  
  // Render packages list
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Scraping Packages</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {/* Navigate to create page */}}
        >
          Create Package
        </button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div 
            key={pkg._id} 
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{pkg.name}</h3>
            <p className="text-gray-600 mt-1">{pkg.description}</p>
            
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Sources: {pkg.sources?.length || 0}
              </span>
            </div>
            
            {pkg.keywords && pkg.keywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {pkg.keywords.map((keyword) => (
                  <span 
                    key={keyword} 
                    className="px-2 py-1 bg-gray-100 text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex justify-end gap-2">
              <button 
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                onClick={() => {/* Navigate to edit page */}}
              >
                Edit
              </button>
              <button 
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                onClick={() => handleDelete(pkg._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
