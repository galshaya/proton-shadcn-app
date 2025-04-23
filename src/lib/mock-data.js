// Mock data for the Proton CRM system
import { scrapingPackagesApi, personasApi, newsletterApi, healthApi } from '@/lib/apiClient';

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

// API functions - combines real API with mock data for parts not yet implemented
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

  // Scraping Packages - using real API
  getScrapingPackages: async () => {
    try {
      const packages = await scrapingPackagesApi.getAll();
      // Transform API response to match expected format
      return packages.map(pkg => ({
        id: pkg._id,
        name: pkg.name,
        description: pkg.description,
        status: pkg.status || 'active',
        schedule: pkg.schedule || { frequency: 'daily', time: '09:00' },
        schedule_interval: pkg.schedule_interval || '1h',
        max_articles_per_run: pkg.max_articles_per_run || 10,
        calculate_embeddings: pkg.calculate_embeddings !== false,
        extract_entities: pkg.extract_entities !== false,
        summarize: pkg.summarize !== false,
        lastRun: pkg.last_run,
        nextRun: pkg.next_run,
        createdAt: pkg.date_created || pkg.created_at || pkg.created_date,
        updatedAt: pkg.date_updated || pkg.updated_at || pkg.updated_date,
        itemsProcessed: pkg.articles_last_run || 0,
        totalArticles: pkg.article_count || 0,
        // Handle both sources and rss_feeds fields
        sources: pkg.sources || pkg.rss_feeds || [],
        stats: pkg.stats || {}
      }));
    } catch (error) {
      console.error('Error fetching scraping packages:', error);
      // Fallback to mock data if API fails
      return mockScrapingPackages;
    }
  },
  getProjectPackages: (projectId) => Promise.resolve(mockScrapingPackages.filter(p => p.projectId === projectId)),
  createPackage: async (data) => {
    try {
      console.log('Creating package with data:', data);

      // Transform data to match API format
      const apiData = {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        schedule_interval: data.schedule_interval || '1h', // Add schedule_interval
        max_articles_per_run: data.max_articles_per_run || 10, // Add max_articles_per_run
        calculate_embeddings: data.calculate_embeddings !== false, // Default to true
        extract_entities: data.extract_entities !== false, // Default to true
        summarize: data.summarize !== false, // Default to true
        rss_feeds: data.sources || [], // Use rss_feeds for compatibility with existing records
        keywords: data.filters?.keywords || []
      };

      console.log('Sending API data:', apiData);
      const response = await scrapingPackagesApi.create(apiData);
      console.log('API response:', response);

      // Transform response to match expected format
      return {
        id: response._id,
        name: response.name,
        description: response.description,
        status: response.status || 'active',
        schedule: response.schedule,
        schedule_interval: response.schedule_interval || '1h',
        max_articles_per_run: response.max_articles_per_run || 10,
        calculate_embeddings: response.calculate_embeddings !== false,
        extract_entities: response.extract_entities !== false,
        summarize: response.summarize !== false,
        lastRun: response.last_run,
        nextRun: response.next_run,
        createdAt: response.date_created || response.created_at || response.created_date,
        updatedAt: response.date_updated || response.updated_at || response.updated_date,
        itemsProcessed: response.articles_last_run || 0,
        totalArticles: response.article_count || 0,
        // Handle both sources and rss_feeds fields
        sources: response.sources || response.rss_feeds || [],
        stats: response.stats || {}
      };
    } catch (error) {
      console.error('Error creating scraping package:', error);
      // Fallback to mock implementation
      return Promise.resolve({
        id: "pkg_" + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
        lastRun: null,
        nextRun: null,
        itemsProcessed: 0,
        totalArticles: 0
      });
    }
  },
  updatePackage: async (id, data) => {
    try {
      console.log('Updating package with ID:', id, 'Data:', data);

      // Transform data to match API format
      const apiData = {
        name: data.name,
        description: data.description,
        status: data.status,
        schedule_interval: data.schedule_interval || '1h',
        max_articles_per_run: data.max_articles_per_run || 10,
        calculate_embeddings: data.calculate_embeddings !== false,
        extract_entities: data.extract_entities !== false,
        summarize: data.summarize !== false,
        rss_feeds: data.sources, // Use rss_feeds for compatibility with existing records
        keywords: data.filters?.keywords
      };

      console.log('Sending API data:', apiData);
      const response = await scrapingPackagesApi.update(id, apiData);
      console.log('API response:', response);

      // Transform response to match expected format
      return {
        id: response._id,
        name: response.name,
        description: response.description,
        status: response.status,
        schedule: response.schedule,
        schedule_interval: response.schedule_interval || '1h',
        max_articles_per_run: response.max_articles_per_run || 10,
        calculate_embeddings: response.calculate_embeddings !== false,
        extract_entities: response.extract_entities !== false,
        summarize: response.summarize !== false,
        lastRun: response.last_run,
        nextRun: response.next_run,
        createdAt: response.date_created || response.created_at || response.created_date,
        updatedAt: response.date_updated || response.updated_at || response.updated_date,
        itemsProcessed: response.articles_last_run || 0,
        totalArticles: response.article_count || 0,
        // Handle both sources and rss_feeds fields
        sources: response.sources || response.rss_feeds || [],
        stats: response.stats || {}
      };
    } catch (error) {
      console.error('Error updating scraping package:', error);
      // Fallback to mock implementation
      return Promise.resolve({
        id,
        ...data,
        updatedAt: new Date().toISOString()
      });
    }
  },
  deletePackage: async (id) => {
    try {
      console.log('Deleting package with ID:', id);

      // Call the API to delete the package
      const response = await scrapingPackagesApi.delete(id);
      console.log('Delete API response:', response);

      return { success: true, message: 'Package deleted successfully' };
    } catch (error) {
      console.error('Error deleting scraping package:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  runPackage: (id) => Promise.resolve({
    id,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    itemsProcessed: Math.floor(Math.random() * 50) + 10,
    totalArticles: Math.floor(Math.random() * 500) + 100,
    stats: {
      last_run_duration: Math.random() * 15 + 5,
      last_run_articles: Math.floor(Math.random() * 20) + 1
    }
  }),

  // Personas - using real API
  getPersonas: async () => {
    try {
      const personas = await personasApi.getAll();
      // Transform API response to match expected format
      return personas.map(persona => ({
        id: persona._id,
        name: persona.name,
        description: persona.description,
        // Handle both old and new schema
        ...(persona.inputs ? { inputs: persona.inputs } : { prompt: persona.prompt }),
        status: persona.status || 'active',
        createdAt: persona.created_at,
        email: persona.email || ''
      }));
    } catch (error) {
      console.error('Error fetching personas:', error);
      // Fallback to mock data if API fails
      return mockPersonas;
    }
  },
  createPersona: async (data) => {
    try {
      // Transform data to match API format
      const apiData = {
        name: data.name,
        description: data.description,
        prompt: data.prompt || 'Default prompt for this persona'
      };

      const response = await personasApi.create(apiData);

      // Transform response to match expected format
      return {
        id: response._id,
        name: response.name,
        description: response.description,
        prompt: response.prompt,
        status: 'active',
        createdAt: response.created_at
      };
    } catch (error) {
      console.error('Error creating persona:', error);
      // Fallback to mock implementation
      return Promise.resolve({
        id: "pers_" + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      });
    }
  },
  updatePersona: async (id, data) => {
    try {
      // Transform data to match API format
      const apiData = {
        name: data.name,
        description: data.description,
        prompt: data.prompt
      };

      const response = await personasApi.update(id, apiData);

      // Transform response to match expected format
      return {
        id: response._id,
        name: response.name,
        description: response.description,
        prompt: response.prompt,
        status: response.status || 'active',
        createdAt: response.created_at,
        updatedAt: response.updated_at
      };
    } catch (error) {
      console.error('Error updating persona:', error);
      // Fallback to mock implementation
      return Promise.resolve({
        id,
        ...data,
        updatedAt: new Date().toISOString()
      });
    }
  },
  deletePersona: async (id) => {
    try {
      // Note: The API doesn't currently support deleting personas
      // This is a placeholder for when that functionality is added
      return { success: true };
    } catch (error) {
      console.error('Error deleting persona:', error);
      return { success: false, error: error.message };
    }
  },

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

  // Health check
  checkHealth: async () => {
    try {
      return await healthApi.check();
    } catch (error) {
      console.error('Error checking API health:', error);
      return { status: 'error', error: error.message };
    }
  }
};