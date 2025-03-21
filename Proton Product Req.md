Proton Product Requirements

| DATE | `02.17.25` |  |  |
| :---- | :---- | :---- | :---- |
| PREPARED BY | **Gal Shaya** Associate Director, Tech   | **Peter Pawlick**Principal, Head of Experience | **Liam Forland** Strategist, Experience                 |
|  |  |  |  |
|  |  |  |  |

# 

\-+

## Document Information

* **Product Name**: Proton  
* **Document Status**: Draft  
* **Last Updated**: January 2025  
* **Document Owners**: XP Team 

## Executive Summary

Proton is an AI-powered content curation and delivery system designed to help consulting clients stay informed about relevant market developments after project completion. By extending Proton with a robust CRM-style frontend, internal users can manage project-specific content, customize newsletter delivery, and define role-based experiences seamlessly. This structure supports organization- or project-based management (e.g., Advent Health, Mastercard, Samsung), enabling granular control over documents, scraping packages, newsletter settings, and personalized recipient assignments.

## Problem Statement

### Current Situation

Post-project engagement with consulting clients typically ends abruptly, missing opportunities for continued value delivery and relationship building.

### Problem Definition

Clients need ongoing support to:

* Stay updated on relevant market developments  
* Understand the implications of industry changes  
* Maintain momentum from consulting engagement  
* Access insights relevant to their specific context

  ## Product Overview

  ### **Core Product Capabilities**

1. **Content Sourcing & Management**  
   * **Document Upload:**  
     Users can upload static data (e.g., PDFs, DOCX files) to the client Proton database, adding contextual depth for enhanced content curation.  
   * **Scraping Package Management:**  
     Users can choose and configure specific scraping packages to tailor content ingestion from diverse sources.  
   * **Content Package Management System:**  
     Organizes ingested content for efficient processing and subsequent analysis.  
2. **AI-Powered Analysis**  
   * **RAG (Retrieval Augmented Generation) System:**  
     Integrates AI to enhance content generation.  
   * **Context-Aware Curation:**  
     Analyzes both static documents and dynamically sourced content.  
   * **Semantic Search Capabilities:**  
     Enables efficient and targeted content retrieval.  
3. **Content Delivery**  
   * **Automated Email Newsletter System:**  
     Delivers personalized newsletters directly to clients.  
   * **Web-Based Content Management Interface:**  
     Offers real-time previews and editing capabilities.  
   * **Customizable Delivery Schedules & Templates:**  
     Empowers users to control timing, tone, and formatting of newsletters.  
4. **Enhanced CRM & User Management (New Frontend Capabilities)**  
   * **Project-Based Hierarchy:**  
     Internal users manage multiple projects (e.g., Advent Health, Mastercard, Samsung). Each project encapsulates its own documents, scraping packages, and newsletter settings.  
   * **Document Management:**  
     A dedicated interface for uploading, previewing, and managing documents within each project.  
   * **Scraping Package Configuration:**  
     A dashboard module to enable/disable and configure various scraping packages.  
   * **Newsletter Scheduling & Settings:**  
     A user-friendly control panel to set and adjust global newsletter settings (frequency, AI prompt configurations, content focus).  
   * **Role-Based Persona Management:**  
     * Every project comes with a default “General Persona” for baseline newsletter delivery.  
     * Users can add and customize additional personas—duplicating the default—adjusting tone, content filters, or other parameters.  
     * Recipients can then be assigned a persona via a dropdown selection to ensure tailored communication.

   ---

   ## Target Users

* **External Users:**  
  * Client stakeholders from previous consulting engagements  
  * New business contacts requiring industry insights  
* **Internal Users:**  
  * Proton team members managing client relationships  
* **Extended CRM Users:**  
  * Administrators and project managers using role-based persona definitions  
  * End users who require personalized content adjustments based on their role within the organization

  ---

  ## Technical Requirements

  ### **System Architecture**

**Frontend (Angular-based CRM Management Interface):**

* **Dashboard & Navigation:**  
  * **Project Dashboard:** Displays a list of projects (e.g., Advent Health, Mastercard, Samsung) with summary metrics (newsletter performance, document uploads, active scraping packages).  
  * **Navigation Tabs:** Within each project, tabs include: Dashboard, Documents, Content Packages, Newsletter Settings, Newsletter Personas & Recipients, and Analytics.  
* **Key Functionalities:**  
  * **Document Upload Module:**  
    Allows users to upload static files via drag-and-drop or file selection, with options for file preview and metadata entry.  
  * **Scraping Package Selection:**  
    Interactive controls (toggles, checklists, parameter forms) to enable/disable and configure scraping packages.  
  * **Newsletter Scheduling & Settings:**  
    A calendar/scheduler interface for selecting frequencies (daily, weekly, monthly, custom) and setting preferred dispatch times. Adjustments to global AI prompts and content focus are previewed in real time.  
  * **Persona & Recipient Management:**  
    Interface for viewing the default “General Persona,” adding new personas (via duplication with customization options), and assigning each recipient a preferred persona using dropdown menus.  
  * **Responsive Design:**  
    Optimized for both desktop and mobile devices.

**Backend:**

* **API:**  
  Python-based API to handle requests from the frontend.  
* **Database:**  
  MongoDB with vector embeddings for content and document management.  
* **Integrations:**  
  Secure file uploads, real-time notifications, email delivery system, document parsing, and AI analysis engines.

  ### **Integration Requirements:**

* Secure storage and transmission of documents.  
* Real-time status updates via Angular.  
* API endpoints to support configuration, scheduling, and personalized content adjustments.  
  ---

  ## Frontend User Journeys

  ### **1\. Project Navigation & Overview**

* **Step 1:**  
  The internal user logs in and lands on the central dashboard, which displays a list of projects (e.g., Advent Health, Mastercard, Samsung).  
* **Step 2:**  
  The user selects a project card (e.g., "Advent Health") to view detailed project information and management options.  
* **Step 3:**  
  A sidebar within the project view provides navigation to key modules: Documents, Scraping Packages, Newsletter Settings, and Newsletter Personas & Recipients.

  ### **2\. Document Upload Journey**

* **Step 1:**  
  Within a selected project, the user navigates to the "Documents" tab.  
* **Step 2:**  
  The user clicks “Upload New Document,” selecting a file from their device.  
* **Step 3:**  
  The user enters associated metadata (title, description, tags) to contextualize the document.  
* **Step 4:**  
  The document is uploaded to the project’s Proton database and indexed for context.  
* **Step 5:**  
  Confirmation is provided, and the document appears in the document library with options for previewing and editing.

  ### **3\. Scraping Package Selection Journey**

* **Step 1:**  
  The user accesses the "Content Packages" section within the selected project.  
* **Step 2:**  
  A list of available scraping packages is displayed with brief descriptions.  
* **Step 3:**  
  The user selects desired packages (via checkboxes or toggle switches) and configures any necessary parameters.  
* **Step 4:**  
  Changes are saved, and the system updates the project's content ingestion settings accordingly.

  ### **4\. Newsletter Settings Journey**

* **Step 1:**  
  The user navigates to the "Newsletter Settings" tab within the project.  
* **Step 2:**  
  Global newsletter settings are displayed, including frequency, AI prompt configurations, and content focus.  
* **Step 3:**  
  The user adjusts the settings using a calendar/scheduler interface and real-time preview features.  
* **Step 4:**  
  Upon saving, the updated settings are applied to future newsletter generation for the project.

  ### **5\. Newsletter Persona & Recipient Management Journey**

* **Step 1:**  
  The user selects the "Newsletter Personas & Recipients" tab within the project.  
* **Step 2:**  
  The default “General Persona” is displayed automatically as the baseline template.  
* **Step 3:**  
  The user may click “Add Persona” to duplicate the default, then customize parameters such as tone, content filters, and formatting.  
* **Step 4:**  
  In the recipients list, a dropdown menu next to each recipient allows the user to select which newsletter persona (default or custom) they will receive.  
* **Step 5:**  
  The system saves the personalized settings and applies these adjustments to subsequent newsletter distributions.  
  ---

  ## Success Metrics

  ### **Key Performance Indicators**

* **User Engagement:**  
  * Newsletter open rates  
  * Click-through rates  
  * Client feedback ratings  
* **Content Quality:**  
  * Relevance scores  
  * Client-reported insight value  
  * Content freshness  
* **Operational Efficiency:**  
  * Reduction in newsletter production time  
  * Improved content processing accuracy  
  * Lower configuration error rates

  ---

  ## Development Milestones

  ### **Phase 1: Core Infrastructure**

* Set up MongoDB with vector embeddings  
* Implement basic API structure  
* Develop the content scraping system  
* Create the foundational frontend framework

  ### **Phase 2: AI Integration**

* Implement the RAG system  
* Develop newsletter generation logic  
* Create content curation algorithms  
* Set up vector search capabilities

  ### **Phase 3: Delivery System**

* Build the email delivery system  
* Develop the web-based content management interface  
* Implement user controls and settings  
* Create monitoring and analytics modules

  ### **Phase 4: Enhanced CRM Frontend & User Journeys**

* **Project-Based Navigation:**  
  Develop the central project dashboard and detailed project views.  
* **Document Management Module:**  
  Build UI components for file uploads, metadata entry, and preview functionalities.  
* **Scraping Package Configuration Interface:**  
  Create interactive dashboards for package selection and configuration.  
* **Newsletter Scheduling & Settings:**  
  Integrate calendar-based scheduling with real-time previews.  
* **Persona & Recipient Management Module:**  
  Develop features for managing the default “General Persona,” adding customized personas, and assigning recipients via dropdown.  
* **User Experience Enhancements:**  
  Implement responsive design, error handling, and real-time notifications to ensure a seamless user journey.  
  ---

  ## Constraints & Limitations

* **Data Privacy & Security:**  
  All operations must ensure secure transmission and storage of client data.  
* **Minimal Manual Intervention:**  
  Automation should reduce the need for human oversight in content curation, document processing, and newsletter scheduling.  
* **Compliance:**  
  Content must be properly attributed and adhere to copyright regulations.  
* **Performance:**  
  Enhancements must not adversely impact system responsiveness or existing operational processes.  
  ---


  
---

