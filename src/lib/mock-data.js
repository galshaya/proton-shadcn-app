// Mock data for the Proton CRM system

export const mockProjects = [
  {
    id: "1",
    name: "Marketing Campaign 2025",
    description: "Q1 marketing campaign for client engagement",
    status: "Active",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
    documentCount: 5,
    recipientCount: 12,
    nextNewsletterDate: "2024-03-01T09:00:00Z"
  },
  {
    id: "2",
    name: "Product Launch Q2",
    description: "Product launch campaign for Q2 2024",
    status: "Active",
    createdAt: "2024-02-19T15:30:00Z",
    updatedAt: "2024-02-19T15:30:00Z",
    documentCount: 3,
    recipientCount: 8,
    nextNewsletterDate: "2024-03-15T10:00:00Z"
  },
  {
    id: "3",
    name: "Customer Feedback 2024",
    description: "Customer feedback and satisfaction survey",
    status: "Archived",
    createdAt: "2024-02-18T09:15:00Z",
    updatedAt: "2024-02-18T09:15:00Z",
    documentCount: 2,
    recipientCount: 15,
    nextNewsletterDate: null
  }
];

export const mockDocuments = [
  {
    id: "1",
    name: "Q1 Marketing Strategy.pdf",
    type: "PDF",
    url: "https://example.com/documents/strategy.pdf",
    projectId: "1",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "2",
    name: "Product Roadmap.xlsx",
    type: "Excel",
    url: "https://example.com/documents/roadmap.xlsx",
    projectId: "2",
    createdAt: "2024-02-19T15:30:00Z",
    updatedAt: "2024-02-19T15:30:00Z"
  }
];

export const mockRecipients = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    persona: "Executive",
    status: "Active",
    projectId: "1",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    persona: "Manager",
    status: "Active",
    projectId: "1",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z"
  }
];

export const mockScrapingPackages = [
  {
    id: "1",
    name: "Tech News Scraper",
    description: "Scrapes top tech news sites weekly",
    status: "Active",
    schedule: "0 0 * * 1", // Every Monday at midnight
    lastRun: "2024-02-19T00:00:00Z",
    nextRun: "2024-02-26T00:00:00Z",
    projectId: "1",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "2",
    name: "Industry Reports",
    description: "Daily industry report collection",
    status: "Active",
    schedule: "0 9 * * *", // Every day at 9 AM
    lastRun: "2024-02-20T09:00:00Z",
    nextRun: "2024-02-21T09:00:00Z",
    projectId: "2",
    createdAt: "2024-02-19T15:30:00Z",
    updatedAt: "2024-02-19T15:30:00Z"
  }
];

export const mockNewsletters = [
  {
    id: "1",
    subject: "Weekly Tech Update",
    content: "<h1>Weekly Tech Update</h1><p>Here's your weekly tech news summary...</p>",
    status: "Scheduled",
    scheduledFor: "2024-03-01T09:00:00Z",
    sentAt: null,
    projectId: "1",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "2",
    subject: "Product Launch Preview",
    content: "<h1>Product Launch Preview</h1><p>Get ready for our upcoming product launch...</p>",
    status: "Sent",
    scheduledFor: "2024-02-15T10:00:00Z",
    sentAt: "2024-02-15T10:00:00Z",
    projectId: "2",
    createdAt: "2024-02-19T15:30:00Z",
    updatedAt: "2024-02-19T15:30:00Z"
  }
];

export const mockActivity = [
  {
    id: "1",
    type: "DocumentUpload",
    typeIcon: "📄",
    projectName: "Marketing Campaign 2025",
    timestamp: "2024-02-20T10:00:00Z",
    details: "New document uploaded: Q1 Marketing Strategy.pdf"
  },
  {
    id: "2",
    type: "NewsletterSent",
    typeIcon: "📧",
    projectName: "Product Launch Q2",
    timestamp: "2024-02-15T10:00:00Z",
    details: "Newsletter sent to 8 recipients"
  },
  {
    id: "3",
    type: "PersonaModified",
    typeIcon: "👤",
    projectName: "Marketing Campaign 2025",
    timestamp: "2024-02-14T15:30:00Z",
    details: "Updated persona settings for Executive group"
  }
];

export const mockMetrics = {
  totalProjects: 3,
  totalRecipients: 35,
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
    status: "Active",
    schedule: "Weekly",
    lastRun: "2024-03-20T10:00:00Z",
    nextRun: "2024-03-27T10:00:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Industry Reports",
    description: "Daily industry report collection",
    status: "Active",
    schedule: "Daily",
    lastRun: "2024-03-21T09:00:00Z",
    nextRun: "2024-03-22T09:00:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-21T09:00:00Z",
  },
  {
    id: 3,
    name: "Market Analysis",
    description: "Monthly market analysis collection",
    status: "Inactive",
    schedule: "Monthly",
    lastRun: "2024-02-15T08:00:00Z",
    nextRun: "2024-03-15T08:00:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
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
  getProjectDocuments: (projectId) => Promise.resolve(mockDocuments.filter(d => d.projectId === projectId)),
  uploadDocument: (projectId, file) => Promise.resolve({
    id: "3",
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file),
    projectId,
    createdAt: new Date().toISOString()
  }),
  deleteDocument: (projectId, documentId) => Promise.resolve({ success: true }),

  // Recipients
  getProjectRecipients: (projectId) => Promise.resolve(mockRecipients.filter(r => r.projectId === projectId)),
  addRecipient: (projectId, data) => Promise.resolve({
    id: "3",
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

  // Scraping Packages
  getProjectPackages: (projectId) => Promise.resolve(mockScrapingPackages.filter(p => p.projectId === projectId)),
  createPackage: (projectId, data) => Promise.resolve({
    id: "3",
    ...data,
    projectId,
    createdAt: new Date().toISOString()
  }),
  updatePackage: (projectId, packageId, data) => Promise.resolve({
    id: packageId,
    ...data,
    projectId,
    updatedAt: new Date().toISOString()
  }),
  deletePackage: (projectId, packageId) => Promise.resolve({ success: true }),

  // Newsletters
  getProjectNewsletters: (projectId) => Promise.resolve(mockNewsletters.filter(n => n.projectId === projectId)),
  createNewsletter: (projectId, data) => Promise.resolve({
    id: "3",
    ...data,
    projectId,
    createdAt: new Date().toISOString()
  }),
  updateNewsletter: (projectId, newsletterId, data) => Promise.resolve({
    id: newsletterId,
    ...data,
    projectId,
    updatedAt: new Date().toISOString()
  }),
  deleteNewsletter: (projectId, newsletterId) => Promise.resolve({ success: true }),

  // Activity
  getRecentActivity: () => Promise.resolve(mockActivity),

  // Metrics
  getMetrics: () => Promise.resolve(mockMetrics),

  // Scraping Package functions
  getScrapingPackages: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return scrapingPackages;
  },

  getScrapingPackage: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return scrapingPackages.find((pkg) => pkg.id === id);
  },

  createScrapingPackage: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPackage = {
      id: scrapingPackages.length + 1,
      ...data,
      lastRun: null,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    scrapingPackages.push(newPackage);
    return newPackage;
  },

  updateScrapingPackage: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = scrapingPackages.findIndex((pkg) => pkg.id === id);
    if (index === -1) throw new Error("Package not found");

    const updatedPackage = {
      ...scrapingPackages[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    scrapingPackages[index] = updatedPackage;
    return updatedPackage;
  },

  deleteScrapingPackage: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = scrapingPackages.findIndex((pkg) => pkg.id === id);
    if (index === -1) throw new Error("Package not found");
    scrapingPackages.splice(index, 1);
  },
}; 