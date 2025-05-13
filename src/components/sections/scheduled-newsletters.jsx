"use client"

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Eye, X } from 'lucide-react';

export default function ScheduledNewsletters({ newsletters, onView, onCancel, onReschedule }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-light text-white">Scheduled Newsletters</h3>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search scheduled newsletters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-[#111] border border-gray-800 text-white"
          />
        </div>
      </div>
      
      <div className="bg-[#111] rounded-lg border border-gray-800 divide-y divide-gray-800">
        {filteredNewsletters.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No scheduled newsletters found
          </div>
        ) : (
          filteredNewsletters.map((newsletter) => (
            <div key={newsletter.id} className="p-4 space-y-2">
              <div className="flex justify-between">
                <h4 className="font-light text-white">{newsletter.subject || newsletter.title}</h4>
                <span className="text-sm text-gray-400">
                  Scheduled for: {formatDate(newsletter.scheduled_for)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {newsletter.persona_name && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-purple-900 text-purple-100">
                    Persona: {newsletter.persona_name}
                  </span>
                )}
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-blue-900 text-blue-100">
                  Recipients: {newsletter.recipient_count || 0}
                </span>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onView(newsletter)}
                  className="text-gray-300 border-gray-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onReschedule(newsletter)}
                  className="text-gray-300 border-gray-700"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCancel(newsletter)}
                  className="text-red-400 border-gray-700 hover:text-red-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
