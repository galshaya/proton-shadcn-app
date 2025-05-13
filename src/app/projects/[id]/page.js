"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ProjectForm } from "@/components/forms/project-form";
import { ScrapingPackageConfigForm } from "@/components/forms/scraping-package-config-form";
import { RecipientForm } from "@/components/forms/recipient-form";
import NewsletterScheduleForm from "@/components/forms/newsletter-schedule-form";
import ScheduledNewsletters from "@/components/sections/scheduled-newsletters";
import NewsletterCard from "@/components/cards/newsletter-card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { Upload, FileText, Plus, Settings, History, Edit, X, Search, Calendar, Users, Mail, MailCheck, Edit2, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [scheduledNewsletters, setScheduledNewsletters] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("newsletter");
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [searchNewsletter, setSearchNewsletter] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);

      // Get project data
      const projectData = await apiClient.projects.getById(id);
      setProject(projectData);

      // Get personas
      const personasData = await apiClient.personas.getAll();
      setPersonas(personasData);

      // Get newsletters for this project (sent newsletters)
      const newslettersData = await apiClient.newslettersArchive.getAll(id, { status: 'sent' });
      setNewsletters(newslettersData);

      // Get scheduled newsletters for this project
      const scheduledNewslettersData = await apiClient.newslettersArchive.getAll(id, { status: 'scheduled' });
      setScheduledNewsletters(scheduledNewslettersData);

      // Get project schedule
      try {
        const scheduleData = await apiClient.projects.getSchedule(id);
        setSchedule(scheduleData);
      } catch (scheduleError) {
        console.log("No schedule found for this project:", scheduleError);
        setSchedule(null);
      }

      // Get recipients for this project
      const recipientsData = await apiClient.recipients.getAll(id);
      setRecipients(recipientsData);

    } catch (error) {
      console.error("Error loading project data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (formData) => {
    try {
      const updatedProject = await apiClient.projects.update(id, formData);
      setProject(updatedProject);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project: " + error.message);
    }
  };

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.subject?.toLowerCase().includes(searchNewsletter.toLowerCase()) ||
    newsletter.title?.toLowerCase().includes(searchNewsletter.toLowerCase())
  );

  const filteredRecipients = recipients.filter(recipient =>
    recipient.name?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    recipient.email?.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const handleCreateRecipient = async (formData) => {
    try {
      const newRecipient = await apiClient.recipients.create(id, formData);
      setRecipients([...recipients, newRecipient]);
      setShowRecipientModal(false);
    } catch (error) {
      console.error("Error creating recipient:", error);
      alert("Failed to create recipient: " + error.message);
    }
  };

  const handleUpdateRecipient = async (formData) => {
    try {
      const updatedRecipient = await apiClient.recipients.update(selectedRecipient.id, formData);
      const updatedRecipients = recipients.map(recipient =>
        recipient.id === selectedRecipient.id ? updatedRecipient : recipient
      );
      setRecipients(updatedRecipients);
      setShowRecipientModal(false);
      setSelectedRecipient(null);
    } catch (error) {
      console.error("Error updating recipient:", error);
      alert("Failed to update recipient: " + error.message);
    }
  };
  
  // Newsletter scheduling handlers
  const handleUpdateSchedule = async (formData) => {
    try {
      const updatedSchedule = await apiClient.projects.updateSchedule(id, formData);
      setSchedule(updatedSchedule);
      setShowScheduleModal(false);
      alert("Newsletter schedule updated successfully");
      
      // Refresh project data to get any newly scheduled newsletters
      loadProjectData();
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule: " + error.message);
    }
  };
  
  const handleCancelNewsletter = async (newsletter) => {
    if (!confirm(`Are you sure you want to cancel the newsletter "${newsletter.subject || newsletter.title}"?`)) {
      return;
    }
    
    try {
      await apiClient.newslettersArchive.cancel(newsletter.id);
      // Refresh scheduled newsletters
      const scheduledNewslettersData = await apiClient.newslettersArchive.getAll(id, { status: 'scheduled' });
      setScheduledNewsletters(scheduledNewslettersData);
      alert("Newsletter cancelled successfully");
    } catch (error) {
      console.error("Error cancelling newsletter:", error);
      alert("Failed to cancel newsletter: " + error.message);
    }
  };
  
  const handleRescheduleNewsletter = async (newsletter, newDate) => {
    try {
      await apiClient.newslettersArchive.reschedule(newsletter.id, { scheduled_for: newDate });
      // Refresh scheduled newsletters
      const scheduledNewslettersData = await apiClient.newslettersArchive.getAll(id, { status: 'scheduled' });
      setScheduledNewsletters(scheduledNewslettersData);
      setShowRescheduleModal(false);
      setSelectedNewsletter(null);
      alert("Newsletter rescheduled successfully");
    } catch (error) {
      console.error("Error rescheduling newsletter:", error);
      alert("Failed to reschedule newsletter: " + error.message);
    }
  };
  
  const handleViewNewsletter = (newsletter) => {
    setSelectedNewsletter(newsletter);
    // Here you would typically open a modal to view the newsletter content
    // For now, we'll just log it
    console.log("Viewing newsletter:", newsletter);
  };

  const handleDeleteRecipient = async (id) => {
    try {
      await apiClient.recipients.delete(id);
      setRecipients(recipients.filter(recipient => recipient.id !== id));
    } catch (error) {
      console.error("Error deleting recipient:", error);
      alert("Failed to delete recipient: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-light">{project.name}</h1>
          <p className="text-sm text-gray-400">{project.description}</p>
        </div>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-white text-black hover:bg-gray-200 font-light"
        >
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Recipients</p>
            <div className="text-2xl font-light">{recipients.length}</div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Newsletters</p>
            <div className="text-2xl font-light">{newsletters.length}</div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-light">Last Updated</p>
            <div className="text-2xl font-light">{formatDate(project.updated_at)}</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger
            value="recipients"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Recipients
          </TabsTrigger>
          <TabsTrigger
            value="newsletter"
            className="rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white font-light"
          >
            Newsletter Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-light">Recipients</h2>
              <p className="text-sm text-gray-400">
                Manage project recipients and assign personas
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedRecipient(null);
                setShowRecipientModal(true);
              }}
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </div>

          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search recipients..."
              className="pl-8 bg-[#111] border-gray-800 text-white"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipients.length === 0 ? (
              <div className="text-center py-12 col-span-full bg-[#111] rounded-lg border border-gray-800">
                <Mail className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-light mb-2">No Recipients Yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Add recipients to manage your audience
                </p>
                <Button
                  onClick={() => {
                    setSelectedRecipient(null);
                    setShowRecipientModal(true);
                  }}
                  className="bg-white text-black hover:bg-gray-200 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>
            ) : (
              filteredRecipients.map((recipient) => (
                <div key={recipient.id} className="bg-[#111] p-4 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-light text-white">{recipient.name}</h3>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRecipient(recipient);
                          setShowRecipientModal(true);
                        }}
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteRecipient(recipient.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{recipient.email}</p>
                  {recipient.company && (
                    <p className="text-xs text-gray-500 mb-2">{recipient.company}</p>
                  )}

                  {/* Persona preview */}
                  {recipient.persona_id && (
                    <div className="mt-2 mb-3 p-2 bg-[#1a1a1a] rounded border border-gray-800">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-300">
                          {personas.find(p => p.id === recipient.persona_id)?.name || "Unknown Persona"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* For backward compatibility - check persona field too */}
                  {!recipient.persona_id && recipient.persona && (
                    <div className="mt-2 mb-3 p-2 bg-[#1a1a1a] rounded border border-gray-800">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-300">
                          {personas.find(p => p.id === recipient.persona)?.name || "Unknown Persona"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <MailCheck className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-400">Newsletters: {recipient.newsletterCount || 0}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                      recipient.status === "active" ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                    }`}>
                      {recipient.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-light">Newsletter Settings</h2>
            <p className="text-sm text-gray-400">
              Configure newsletter delivery schedule and settings
            </p>
          </div>

          <div className="bg-[#111] rounded-lg border border-gray-800 p-6 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Newsletter Schedule</h3>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="bg-white text-black hover:bg-gray-200 font-light"
              >
                {schedule ? 'Edit Schedule' : 'Set Schedule'}
              </Button>
            </div>
            
            {schedule ? (
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
                    <div className="flex flex-wrap gap-2 mt-1">
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
                {schedule.frequency === 'monthly' && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Days of Month</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {schedule.days.map(day => (
                        <span 
                          key={day} 
                          className="inline-block px-2 py-1 bg-gray-800 text-white rounded text-xs"
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <p className="mb-4">No schedule configured</p>
                <Button 
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-white text-black hover:bg-gray-200 font-light"
                >
                  Set Schedule
                </Button>
              </div>
            )}
          </div>
          
          {/* Scheduled Newsletters Section */}
          <div className="mt-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-light">Sent Newsletters</h3>
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search newsletters..."
                    className="pl-8 bg-[#111] border-gray-800 text-white"
                    value={searchNewsletter}
                    onChange={(e) => setSearchNewsletter(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredNewsletters.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 bg-[#111] rounded-lg border border-gray-800">
                    No newsletters found
                  </div>
                ) : (
                  filteredNewsletters.map((newsletter) => (
                    <NewsletterCard
                      key={newsletter.id}
                      newsletter={newsletter}
                      onView={handleViewNewsletter}
                      onDelete={(newsletter) => {
                        if (confirm(`Are you sure you want to delete the newsletter "${newsletter.subject || newsletter.title}"?`)) {
                          apiClient.newslettersArchive.delete(newsletter.id)
                            .then(() => {
                              setNewsletters(newsletters.filter(n => n.id !== newsletter.id));
                              alert("Newsletter deleted successfully");
                            })
                            .catch(error => {
                              console.error("Error deleting newsletter:", error);
                              alert("Failed to delete newsletter: " + error.message);
                            });
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-light">Analytics Overview</h3>
              <div className="bg-[#111] rounded-lg border border-gray-800 p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Average Open Rate</p>
                  <p className="text-2xl font-light">68.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Average Click Rate</p>
                  <p className="text-2xl font-light">38.3%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-light">Total Subscribers</p>
                  <p className="text-2xl font-light">{project.recipients}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                >
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={showRecipientModal}
        onClose={() => {
          setShowRecipientModal(false);
          setSelectedRecipient(null);
        }}
        title={selectedRecipient ? `Edit Recipient` : `Add Recipient`}
      >
        <RecipientForm
          recipient={selectedRecipient}
          personas={personas}
          onSubmit={selectedRecipient ? handleUpdateRecipient : handleCreateRecipient}
          onCancel={() => {
            setShowRecipientModal(false);
            setSelectedRecipient(null);
          }}
        />
      </Modal>
      
      {/* Newsletter Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={schedule ? "Edit Newsletter Schedule" : "Set Newsletter Schedule"}
      >
        <NewsletterScheduleForm 
          projectId={id}
          initialData={schedule}
          onSubmit={handleUpdateSchedule}
        />
      </Modal>
      
      {/* Reschedule Newsletter Modal */}
      <Modal
        isOpen={showRescheduleModal && selectedNewsletter !== null}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedNewsletter(null);
        }}
        title="Reschedule Newsletter"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newDate = formData.get('scheduled_date') + 'T' + formData.get('scheduled_time');
          handleRescheduleNewsletter(selectedNewsletter, newDate);
        }} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scheduled_date" className="text-white">Date</Label>
            <Input
              type="date"
              id="scheduled_date"
              name="scheduled_date"
              defaultValue={selectedNewsletter?.scheduled_for?.split('T')[0] || new Date().toISOString().split('T')[0]}
              className="bg-[#111] border-gray-800 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduled_time" className="text-white">Time</Label>
            <Input
              type="time"
              id="scheduled_time"
              name="scheduled_time"
              defaultValue={selectedNewsletter?.scheduled_for?.split('T')[1]?.substring(0, 5) || '09:00'}
              className="bg-[#111] border-gray-800 text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setShowRescheduleModal(false);
                setSelectedNewsletter(null);
              }}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-white text-black hover:bg-gray-200 font-light"
            >
              Reschedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
