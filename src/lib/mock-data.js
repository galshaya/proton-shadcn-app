// Mock data for the Proton CRM system

export const mockProjects = [
  {
    id: "proj_1",
    name: "Marketing Campaign 2025",
    description: "Q1 marketing campaign for client engagement",
    status: "Active",
    createdAt: "2025-01-10T10:00:00Z",
    lastUpdated: "2025-01-15T10:00:00Z",
    documents: 5,
    recipients: 156,
    nextNewsletter: "2025-01-20T09:00:00Z"
  },
  {
    id: "proj_2",
    name: "Product Launch Q2",
    description: "Product launch campaign for Q2 2025",
    status: "Active",
    createdAt: "2025-01-08T15:30:00Z",
    lastUpdated: "2025-01-14T15:30:00Z",
    documents: 3,
    recipients: 87,
    nextNewsletter: "2025-01-19T10:00:00Z"
  },
  {
    id: "proj_3",
    name: "Customer Feedback 2025",
    description: "Customer feedback and satisfaction survey",
    status: "Archived",
    createdAt: "2025-01-05T09:15:00Z",
    lastUpdated: "2025-01-12T09:15:00Z",
    documents: 2,
    recipients: 203,
    nextNewsletter: "2025-01-25T14:00:00Z"
  }
];

export const mockDocuments = [
  {
    id: "doc_1",
    name: "Q1 Marketing Strategy.pdf",
    type: "application/pdf",
    size: "2.4 MB",
    url: "https://example.com/documents/strategy.pdf",
    projectId: "proj_1",
    uploadedAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "doc_2",
    name: "Product Roadmap.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: "1.8 MB",
    url: "https://example.com/documents/roadmap.xlsx",
    projectId: "proj_2",
    uploadedAt: "2025-01-14T15:30:00Z",
    updatedAt: "2025-01-14T15:30:00Z"
  },
  {
    id: "doc_3",
    name: "Market Research Results.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: "3.2 MB",
    url: "https://example.com/documents/research.docx",
    projectId: "proj_1",
    uploadedAt: "2025-01-13T09:15:00Z",
    updatedAt: "2025-01-13T09:15:00Z"
  },
  {
    id: "doc_4",
    name: "Competitive Analysis.pdf",
    type: "application/pdf",
    size: "4.5 MB",
    url: "https://example.com/documents/analysis.pdf",
    projectId: "proj_1",
    uploadedAt: "2025-01-12T14:20:00Z",
    updatedAt: "2025-01-12T14:20:00Z"
  },
  {
    id: "doc_5",
    name: "Content Calendar.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: "1.2 MB",
    url: "https://example.com/documents/calendar.xlsx",
    projectId: "proj_1",
    uploadedAt: "2025-01-10T11:45:00Z",
    updatedAt: "2025-01-10T11:45:00Z"
  }
];

export const mockRecipients = [
  {
    id: "rec_1",
    name: "John Doe",
    email: "john@example.com",
    persona: "Executive",
    status: "active",
    projectId: "proj_1",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z"
  },
  {
    id: "rec_2",
    name: "Jane Smith",
    email: "jane@example.com",
    persona: "Manager",
    status: "active",
    projectId: "proj_1",
    createdAt: "2025-01-10T10:05:00Z",
    updatedAt: "2025-01-10T10:05:00Z"
  },
  {
    id: "rec_3",
    name: "Robert Johnson",
    email: "robert@example.com",
    persona: "Executive",
    status: "active",
    projectId: "proj_1",
    createdAt: "2025-01-11T09:30:00Z",
    updatedAt: "2025-01-11T09:30:00Z"
  },
  {
    id: "rec_4",
    name: "Emily Davis",
    email: "emily@example.com",
    persona: "Manager",
    status: "inactive",
    projectId: "proj_1",
    createdAt: "2025-01-11T09:45:00Z",
    updatedAt: "2025-01-11T09:45:00Z"
  }
];

export const mockPersonas = [
  {
    id: "pers_1",
    name: "Executive",
    description: "Senior executives and decision makers",
    status: "active",
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-01-05T10:00:00Z"
  },
  {
    id: "pers_2",
    name: "Manager",
    description: "Middle management and team leaders",
    status: "active",
    createdAt: "2025-01-06T11:30:00Z",
    updatedAt: "2025-01-06T11:30:00Z"
  },
  {
    id: "pers_3",
    name: "Technical",
    description: "Technical staff and developers",
    status: "inactive",
    createdAt: "2025-01-07T14:20:00Z",
    updatedAt: "2025-01-07T14:20:00Z"
  }
];

export const mockScrapingPackages = [
  {
    id: "pkg_1",
    name: "Tech News Scraper",
    description: "Scrapes top tech news sites weekly",
    status: "active",
    schedule: "0 0 * * 1", // Every Monday at midnight
    lastRun: "2025-01-15T00:00:00Z",
    nextRun: "2025-01-22T00:00:00Z",
    projectId: "proj_1",
    createdAt: "2025-01-08T10:00:00Z",
    updatedAt: "2025-01-15T00:05:00Z"
  },
  {
    id: "pkg_2",
    name: "Industry Reports",
    description: "Daily industry report collection",
    status: "active",
    schedule: "0 9 * * *", // Every day at 9 AM
    lastRun: "2025-01-15T09:00:00Z",
    nextRun: "2025-01-16T09:00:00Z",
    projectId: "proj_2",
    createdAt: "2025-01-08T15:30:00Z",
    updatedAt: "2025-01-15T09:05:00Z"
  }
];

export const mockNewsletters = [
  {
    id: "news_1",
    subject: "Weekly Tech Update: January 20, 2025",
    content: "<h1>Weekly Tech Update</h1><p>Here's your weekly tech news summary...</p>",
    status: "Scheduled",
    scheduledFor: "2025-01-20T09:00:00Z",
    sentAt: null,
    projectId: "proj_1",
    recipients: 156,
    stats: {
      openRate: 0,
      clickRate: 0
    },
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "news_2",
    subject: "Product Launch Preview: January 5, 2025",
    content: "<h1>Product Launch Preview</h1><p>Get ready for our upcoming product launch...</p>",
    status: "Sent",
    scheduledFor: "2025-01-05T10:00:00Z",
    sentAt: "2025-01-05T10:00:00Z",
    projectId: "proj_1",
    recipients: 156,
    stats: {
      openRate: 72.4,
      clickRate: 45.6
    },
    createdAt: "2025-01-03T15:30:00Z",
    updatedAt: "2025-01-05T10:05:00Z"
  },
  {
    id: "news_3",
    subject: "Market Insights: January 12, 2025",
    content: "<h1>Market Insights</h1><p>Latest market trends and analysis...</p>",
    status: "Sent",
    scheduledFor: "2025-01-12T10:00:00Z",
    sentAt: "2025-01-12T10:00:00Z",
    projectId: "proj_1",
    recipients: 156,
    stats: {
      openRate: 68.2,
      clickRate: 37.9
    },
    createdAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-12T10:05:00Z"
  }
];

export const mockActivity = [
  {
    id: "act_1",
    type: "DocumentUpload",
    typeIcon: "📄",
    projectName: "Marketing Campaign 2025",
    timestamp: "2025-01-15T10:00:00Z",
    details: "New document uploaded: Q1 Marketing Strategy.pdf"
  },
  {
    id: "act_2",
    type: "NewsletterSent",
    typeIcon: "📧",
    projectName: "Marketing Campaign 2025",
    timestamp: "2025-01-12T10:00:00Z",
    details: "Newsletter sent to 156 recipients"
  },
  {
    id: "act_3",
    type: "PersonaModified",
    typeIcon: "👤",
    projectName: "Marketing Campaign 2025",
    timestamp: "2025-01-11T15:30:00Z",
    details: "Updated persona settings for Executive group"
  }
];

export const mockMetrics = {
  totalProjects: 3,
  totalRecipients: 446,
  totalDocuments: 10,
  totalPackages: 5,
  newslettersSent: 12,
  newslettersOpened: 8
};

// Mock data for scraping packages
const scrapingPackages = [
  {
    id: 1,
    name: "Tech News Scraper",
    description: "Scrapes top tech news sites weekly",
    status: "active",
    schedule: "Weekly",
    lastRun: "2025-01-15T10:00:00Z",
    nextRun: "2025-01-22T10:00:00Z",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Industry Reports",
    description: "Daily industry report collection",
    status: "active",
    schedule: "Daily",
    lastRun: "2025-01-15T09:00:00Z",
    nextRun: "2025-01-16T09:00:00Z",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
  },
  {
    id: 3,
    name: "Market Analysis",
    description: "Monthly market analysis collection",
    status: "inactive",
    schedule: "Monthly",
    lastRun: "2025-01-01T08:00:00Z",
    nextRun: "2025-02-01T08:00:00Z",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// Mock API functions
export const mockApi = {
  // Projects
  getProjects: () => Promise.resolve(mockProjects),
  getProject: (id) => Promise.resolve(mockProjects.find(p => p.id === id)),
  createProject: (data) => Promise.resolve({ id: "4", ...data, createdAt: new Date().toISOString() }),
  updateProject: (id, data) => Promise.resolve({ id, ...data, updatedAt: new Date().toISOString() }),
  deleteProject: (id) => Promise.resolve({ success: true }),

  // Documents
  getProjectDocuments: (projectId) => {
    // Return all documents for project ID 1, otherwise filter
    if (projectId === "proj_1") {
      return Promise.resolve(mockDocuments.filter(d => d.projectId === projectId));
    }
    return Promise.resolve([]);
  },
  uploadDocument: (projectId, file) => Promise.resolve({
    id: Math.random().toString(36).substring(2, 9),
    name: file.name,
    type: file.type,
    size: "1.5 MB",
    url: URL.createObjectURL(file),
    projectId,
    uploadedAt: new Date().toISOString()
  }),
  deleteDocument: (id) => Promise.resolve({ success: true }),

  // Recipients
  getProjectRecipients: (projectId) => {
    // Return all recipients for project ID 1, otherwise return an empty array
    if (projectId === "proj_1") {
      return Promise.resolve(mockRecipients);
    }
    return Promise.resolve([]);
  },
  addRecipient: (projectId, data) => Promise.resolve({
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    projectId,
    createdAt: new Date().toISOString()
  }),
  updateRecipient: (projectId, recipientId, data) => Promise.resolve({
    id: recipientId,
    ...data,
    projectId,
    updatedAt: new Date().toISOString()
  }),
  deleteRecipient: (projectId, recipientId) => Promise.resolve({ success: true }),

  // Newsletters
  getProjectNewsletters: (projectId) => {
    // Return all newsletters for project ID 1, otherwise return an empty array
    if (projectId === "proj_1") {
      return Promise.resolve(mockNewsletters);
    }
    return Promise.resolve([]);
  },
  createNewsletter: (projectId, data) => Promise.resolve({
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    projectId,
    createdAt: new Date().toISOString()
  }),
  updateNewsletter: (id, data) => Promise.resolve({
    id,
    ...data,
    updatedAt: new Date().toISOString()
  }),
  sendNewsletter: (id) => Promise.resolve({
    id,
    status: "Sent",
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  
  // Scraping Packages
  getScrapingPackages: () => Promise.resolve(mockScrapingPackages),
  getProjectPackages: (projectId) => Promise.resolve(mockScrapingPackages.filter(p => p.projectId === projectId)),
  createPackage: (data) => Promise.resolve({
    id: "pkg_" + Math.random().toString(36).substring(2, 9),
    ...data,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: null
  }),
  updatePackage: (id, data) => Promise.resolve({
    id,
    ...data,
    updatedAt: new Date().toISOString()
  }),
  deletePackage: (id) => Promise.resolve({ success: true }),
  runPackage: (id) => Promise.resolve({
    id,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }),

  // Personas
  getPersonas: () => Promise.resolve(mockPersonas),
  createPersona: (data) => Promise.resolve({
    id: "pers_" + Math.random().toString(36).substring(2, 9),
    ...data,
    createdAt: new Date().toISOString()
  }),
  updatePersona: (id, data) => Promise.resolve({
    id,
    ...data,
    updatedAt: new Date().toISOString()
  }),
  deletePersona: (id) => Promise.resolve({ success: true }),

  // Recipients for scraping packages (not tied to a project)
  getRecipients: () => Promise.resolve(
    mockRecipients.map(recipient => ({
      ...recipient,
      persona: recipient.persona === "Executive" ? "pers_1" : (recipient.persona === "Manager" ? "pers_2" : "pers_3")
    }))
  ),
  createRecipient: (data) => Promise.resolve({
    id: "rec_" + Math.random().toString(36).substring(2, 9),
    ...data,
    createdAt: new Date().toISOString()
  }),
  updateRecipient: (id, data) => Promise.resolve({
    id,
    ...data,
    updatedAt: new Date().toISOString()
  }),
  deleteRecipient: (id) => Promise.resolve({ success: true }),
}; 