# Frontend Implementation Plan: Newsletter Data Model and Project Scheduling

This document outlines the frontend changes needed to support the enhanced newsletter data model and project-level scheduling features once the backend API is updated.

## 1. API Client Updates

### Update `apiClient.js` to Support New Endpoints

We'll need to extend the `newslettersArchiveApi` and `projectsApi` objects in `src/lib/apiClient.js` to support the new endpoints:

```javascript
/**
 * Newsletters Archive API - Enhanced
 */
export const newslettersArchiveApi = {
  // Existing methods...
  
  /**
   * Get full newsletter details including persona and recipients
   * @param {string} id - Newsletter ID
   * @returns {Promise<Object>} - Newsletter with full details
   */
  getFullDetails: async (id) => {
    try {
      return await apiRequest(`/api/newsletters/${id}/full`);
    } catch (error) {
      console.error(`Failed to fetch full details for newsletter ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get newsletters by persona
   * @param {string} personaId - Persona ID
   * @returns {Promise<Array>} - List of newsletters
   */
  getByPersona: async (personaId) => {
    try {
      return await apiRequest(`/api/personas/${personaId}/newsletters`);
    } catch (error) {
      console.error(`Failed to fetch newsletters for persona ${personaId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get newsletters by recipient
   * @param {string} recipientId - Recipient ID
   * @returns {Promise<Array>} - List of newsletters
   */
  getByRecipient: async (recipientId) => {
    try {
      return await apiRequest(`/api/recipients/${recipientId}/newsletters`);
    } catch (error) {
      console.error(`Failed to fetch newsletters for recipient ${recipientId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get scheduled newsletters for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of scheduled newsletters
   */
  getScheduled: async (projectId) => {
    try {
      return await apiRequest(`/api/projects/${projectId}/newsletters/scheduled`);
    } catch (error) {
      console.error(`Failed to fetch scheduled newsletters for project ${projectId}:`, error);
      throw error;
    }
  },
  
  /**
   * Cancel a scheduled newsletter
   * @param {string} id - Newsletter ID
   * @returns {Promise<Object>} - Response
   */
  cancel: async (id) => {
    try {
      return await apiRequest(`/api/newsletters/${id}/cancel`, {
        method: 'POST'
      });
    } catch (error) {
      console.error(`Failed to cancel newsletter ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Reschedule a newsletter
   * @param {string} id - Newsletter ID
   * @param {Object} data - New schedule data
   * @returns {Promise<Object>} - Response
   */
  reschedule: async (id, data) => {
    try {
      return await apiRequest(`/api/newsletters/${id}/reschedule`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error(`Failed to reschedule newsletter ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Projects API - Enhanced with scheduling
 */
export const projectsApi = {
  // Existing methods...
  
  /**
   * Get project newsletter schedule
   * @param {string} id - Project ID
   * @returns {Promise<Object>} - Newsletter schedule
   */
  getSchedule: async (id) => {
    try {
      return await apiRequest(`/api/projects/${id}/schedule`);
    } catch (error) {
      console.error(`Failed to fetch schedule for project ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update project newsletter schedule
   * @param {string} id - Project ID
   * @param {Object} data - Schedule data
   * @returns {Promise<Object>} - Updated schedule
   */
  updateSchedule: async (id, data) => {
    try {
      return await apiRequest(`/api/projects/${id}/schedule`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error(`Failed to update schedule for project ${id}:`, error);
      throw error;
    }
  }
};
```

## 2. UI Components

### 2.1 Newsletter Schedule Form

Create a new component for managing newsletter schedules:

```jsx
// src/components/forms/newsletter-schedule-form.jsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function NewsletterScheduleForm({ projectId, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    frequency: 'weekly',
    time: '09:00',
    days: ['monday'],
    active: true,
    ...initialData
  });
  
  // Form handling logic...
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="frequency" className="text-gray-300 font-light">Frequency</Label>
        <RadioGroup 
          value={formData.frequency} 
          onValueChange={(value) => setFormData({...formData, frequency: value})}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="text-white">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="text-white">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="text-white">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-white">Custom</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="time" className="text-gray-300 font-light">Time</Label>
        <Input
          type="time"
          id="time"
          value={formData.time}
          onChange={(e) => setFormData({...formData, time: e.target.value})}
          className="bg-[#111] border border-gray-800 text-white mt-2"
        />
      </div>
      
      {formData.frequency === 'weekly' && (
        <div>
          <Label htmlFor="days" className="text-gray-300 font-light">Days of Week</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <Button
                key={day}
                type="button"
                className={`capitalize ${formData.days.includes(day) ? 'bg-blue-600' : 'bg-gray-800'}`}
                onClick={() => toggleDay(day)}
              >
                {day.substring(0, 1)}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional fields for monthly and custom frequencies */}
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({...formData, active: e.target.checked})}
          className="rounded bg-[#111] border-gray-800"
        />
        <Label htmlFor="active" className="text-white">Enable automatic scheduling</Label>
      </div>
      
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Save Schedule
      </Button>
    </form>
  );
}
```

### 2.2 Enhanced Newsletter Card

Update the newsletter card component to display persona and recipient information:

```jsx
// src/components/cards/newsletter-card.jsx
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, Calendar } from 'lucide-react';

export default function NewsletterCard({ newsletter, onView, onEdit, onDelete, onReschedule }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex justify-between">
        <h4 className="font-light text-white">{newsletter.subject}</h4>
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
          
          <Button variant="ghost" size="sm" onClick={() => onEdit(newsletter)}>
            <Edit className="h-4 w-4" />
          </Button>
          
          {newsletter.status === 'scheduled' && (
            <Button variant="ghost" size="sm" onClick={() => onReschedule(newsletter)}>
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={() => onDelete(newsletter)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 2.3 Scheduled Newsletters Section

Create a new component for displaying scheduled newsletters:

```jsx
// src/components/sections/scheduled-newsletters.jsx
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';

export default function ScheduledNewsletters({ newsletters, onView, onCancel, onReschedule }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.subject?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h4 className="font-light text-white">{newsletter.subject}</h4>
                <span className="text-sm text-gray-400">
                  Scheduled for: {formatDate(newsletter.scheduled_for)}
                </span>
              </div>
              
              <div className="flex gap-2">
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
```

## 3. Project Page Updates

Update the project page to include the new scheduling features and enhanced newsletter display:

```jsx
// src/app/projects/[id]/page.js
// Add to the existing imports
import NewsletterScheduleForm from '@/components/forms/newsletter-schedule-form';
import ScheduledNewsletters from '@/components/sections/scheduled-newsletters';

// Add to the existing state
const [schedule, setSchedule] = useState(null);
const [scheduledNewsletters, setScheduledNewsletters] = useState([]);
const [showScheduleModal, setShowScheduleModal] = useState(false);

// Add to the loadProjectData function
const loadProjectData = async () => {
  try {
    setIsLoading(true);

    // Get project data
    const projectData = await apiClient.projects.getById(id);
    setProject(projectData);

    // Get personas
    const personasData = await apiClient.personas.getAll();
    setPersonas(personasData);

    // Get newsletters for this project
    const newslettersData = await apiClient.newslettersArchive.getAll(id);
    setNewsletters(newslettersData);

    // Get scheduled newsletters for this project
    const scheduledNewslettersData = await apiClient.newslettersArchive.getScheduled(id);
    setScheduledNewsletters(scheduledNewslettersData);

    // Get project schedule
    const scheduleData = await apiClient.projects.getSchedule(id);
    setSchedule(scheduleData);

    // Get recipients for this project
    const recipientsData = await apiClient.recipients.getAll(id);
    setRecipients(recipientsData);

  } catch (error) {
    console.error("Error loading project data:", error);
  } finally {
    setIsLoading(false);
  }
};

// Add handler functions for schedule management
const handleUpdateSchedule = async (formData) => {
  try {
    const updatedSchedule = await apiClient.projects.updateSchedule(id, formData);
    setSchedule(updatedSchedule);
    setShowScheduleModal(false);
    toast.success("Newsletter schedule updated successfully");
  } catch (error) {
    console.error("Error updating schedule:", error);
    toast.error("Failed to update schedule: " + error.message);
  }
};

const handleCancelNewsletter = async (newsletter) => {
  try {
    await apiClient.newslettersArchive.cancel(newsletter.id);
    // Refresh scheduled newsletters
    const scheduledNewslettersData = await apiClient.newslettersArchive.getScheduled(id);
    setScheduledNewsletters(scheduledNewslettersData);
    toast.success("Newsletter cancelled successfully");
  } catch (error) {
    console.error("Error cancelling newsletter:", error);
    toast.error("Failed to cancel newsletter: " + error.message);
  }
};

const handleRescheduleNewsletter = async (newsletter, newDate) => {
  try {
    await apiClient.newslettersArchive.reschedule(newsletter.id, { scheduled_for: newDate });
    // Refresh scheduled newsletters
    const scheduledNewslettersData = await apiClient.newslettersArchive.getScheduled(id);
    setScheduledNewsletters(scheduledNewslettersData);
    toast.success("Newsletter rescheduled successfully");
  } catch (error) {
    console.error("Error rescheduling newsletter:", error);
    toast.error("Failed to reschedule newsletter: " + error.message);
  }
};

// Add to the JSX in the Newsletter Settings tab
<div className="space-y-6">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-light text-white">Newsletter Schedule</h3>
    <Button 
      onClick={() => setShowScheduleModal(true)}
      className="bg-white text-black hover:bg-gray-200 font-light"
    >
      {schedule ? 'Edit Schedule' : 'Set Schedule'}
    </Button>
  </div>
  
  {schedule ? (
    <div className="bg-[#111] p-4 rounded border border-gray-800">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Frequency</p>
          <p className="text-white capitalize">{schedule.frequency}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Time</p>
          <p className="text-white">{schedule.time}</p>
        </div>
        {schedule.frequency === 'weekly' && (
          <div className="col-span-2">
            <p className="text-gray-400 text-sm">Days</p>
            <div className="flex gap-2 mt-1">
              {schedule.days.map(day => (
                <span 
                  key={day} 
                  className="inline-block px-2 py-1 bg-gray-800 text-white rounded text-xs capitalize"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="col-span-2">
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-white">{schedule.active ? 'Active' : 'Inactive'}</p>
        </div>
        {schedule.next_scheduled_date && (
          <div className="col-span-2">
            <p className="text-gray-400 text-sm">Next Newsletter</p>
            <p className="text-white">{formatDate(schedule.next_scheduled_date)}</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-[#111] p-4 rounded border border-gray-800 text-center text-gray-400">
      No schedule configured
    </div>
  )}
  
  {/* Scheduled Newsletters Section */}
  <div className="mt-8">
    <ScheduledNewsletters 
      newsletters={scheduledNewsletters}
      onView={handleViewNewsletter}
      onCancel={handleCancelNewsletter}
      onReschedule={(newsletter) => {
        setSelectedNewsletter(newsletter);
        setShowRescheduleModal(true);
      }}
    />
  </div>
</div>

{/* Add modals */}
{showScheduleModal && (
  <Modal onClose={() => setShowScheduleModal(false)}>
    <div className="p-6">
      <h2 className="text-xl font-light text-white mb-4">
        {schedule ? 'Edit Newsletter Schedule' : 'Set Newsletter Schedule'}
      </h2>
      <NewsletterScheduleForm 
        projectId={id}
        initialData={schedule}
        onSubmit={handleUpdateSchedule}
      />
    </div>
  </Modal>
)}

{showRescheduleModal && selectedNewsletter && (
  <Modal onClose={() => setShowRescheduleModal(false)}>
    <div className="p-6">
      <h2 className="text-xl font-light text-white mb-4">
        Reschedule Newsletter
      </h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDate = formData.get('scheduled_date') + 'T' + formData.get('scheduled_time');
        handleRescheduleNewsletter(selectedNewsletter, newDate);
        setShowRescheduleModal(false);
      }}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scheduled_date" className="text-gray-300 font-light">Date</Label>
            <Input
              type="date"
              id="scheduled_date"
              name="scheduled_date"
              defaultValue={selectedNewsletter.scheduled_for?.split('T')[0]}
              className="bg-[#111] border border-gray-800 text-white mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="scheduled_time" className="text-gray-300 font-light">Time</Label>
            <Input
              type="time"
              id="scheduled_time"
              name="scheduled_time"
              defaultValue={selectedNewsletter.scheduled_for?.split('T')[1]?.substring(0, 5) || '09:00'}
              className="bg-[#111] border border-gray-800 text-white mt-2"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Reschedule
          </Button>
        </div>
      </form>
    </div>
  </Modal>
)}
```

## 4. Newsletter Card Updates

Update the newsletter cards to display the enhanced information:

```jsx
// In the newsletters tab of the project page
{filteredNewsletters.map((newsletter) => (
  <div key={newsletter.id} className="p-4 space-y-2">
    <div className="flex justify-between">
      <h4 className="font-light text-white">{newsletter.subject}</h4>
      <span className="text-sm text-gray-400">
        {formatDate(newsletter.sent_at || newsletter.scheduled_for)}
      </span>
    </div>
    
    <div className="flex flex-wrap gap-2 mt-1">
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
    
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleViewNewsletter(newsletter)}
        className="text-gray-300 border-gray-700"
      >
        View
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleDeleteNewsletter(newsletter)}
        className="text-red-400 border-gray-700 hover:text-red-300"
      >
        Delete
      </Button>
    </div>
  </div>
))}
```

## 5. Testing Plan

Once the backend API is updated, we'll need to test the following:

1. **Newsletter Data Model**
   - Verify that newsletters display persona information
   - Verify that newsletters display recipient information
   - Verify that newsletters display accurate statistics

2. **Project Scheduling**
   - Test creating schedules with different frequencies (daily, weekly, monthly)
   - Test updating existing schedules
   - Test viewing scheduled newsletters
   - Test cancelling scheduled newsletters
   - Test rescheduling newsletters

3. **API Integration**
   - Verify all API endpoints are working correctly
   - Test error handling for API failures
   - Verify data consistency between frontend and backend

## 6. Implementation Timeline

Once the backend API is updated, we estimate the following timeline for frontend implementation:

1. API Client Updates: 1 day
2. UI Components: 2 days
3. Project Page Updates: 1 day
4. Testing and Bug Fixes: 2 days

Total: 6 days
