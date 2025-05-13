"use client"

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, Calendar } from 'lucide-react';

export default function NewsletterCard({ newsletter, onView, onEdit, onDelete, onReschedule }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex justify-between">
        <h4 className="font-light text-white">{newsletter.subject || newsletter.title}</h4>
        <span className="text-sm text-gray-400">
          {formatDate(newsletter.sent_at || newsletter.scheduled_for)}
        </span>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {newsletter.persona_name && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-purple-900 text-purple-100">
            Persona: {newsletter.persona_name}
          </span>
        )}
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-blue-900 text-blue-100">
          Recipients: {newsletter.recipient_count || 0}
        </span>
        
        {newsletter.stats && (
          <>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-green-900 text-green-100">
              Open Rate: {newsletter.stats.open_rate || 0}%
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-yellow-900 text-yellow-100">
              Click Rate: {newsletter.stats.click_rate || 0}%
            </span>
          </>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-sm text-gray-400 space-y-2">
          {newsletter.model && (
            <p>Generated with: {newsletter.model}</p>
          )}
          
          {newsletter.documents && newsletter.documents.length > 0 && (
            <p>Documents: {newsletter.documents.length}</p>
          )}
          
          {newsletter.package_ids && newsletter.package_ids.length > 0 && (
            <p>Scraping Packages: {newsletter.package_ids.length}</p>
          )}
          
          {newsletter.generation_params && (
            <div>
              <p>Generation Parameters:</p>
              <ul className="list-disc list-inside pl-2 mt-1">
                {newsletter.generation_params.search_query && (
                  <li>Search Query: {newsletter.generation_params.search_query}</li>
                )}
                {newsletter.generation_params.use_web_search && (
                  <li>Web Search: Enabled</li>
                )}
                {newsletter.generation_params.date_range && (
                  <li>Date Range: {newsletter.generation_params.date_range}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(newsletter)}>
            <Eye className="h-4 w-4" />
          </Button>
          
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(newsletter)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {newsletter.status === 'scheduled' && onReschedule && (
            <Button variant="ghost" size="sm" onClick={() => onReschedule(newsletter)}>
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(newsletter)}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
