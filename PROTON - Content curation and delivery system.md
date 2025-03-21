# **PROTON** {#proton}

## **AI-powered content curation and delivery system** {#ai-powered-content-curation-and-delivery-system}

Proton CRM Product Specification Document  
Date: 20.02.2025  
Project name: Proton CRM Product Specification Document  
Client: Proto

[**PROTON	1**](#proton)

[AI-powered content curation and delivery system	1](#ai-powered-content-curation-and-delivery-system)

[Introduction	3](#introduction)

[Purpose	3](#purpose)

[Scope	4](#scope)

[Target audience	4](#target-audience)

[Overview	4](#overview)

[Core Pages	4](#core-pages)

[Login	4](#login)

[Home	4](#home)

[Projects	4](#projects)

[Single project	4](#single-project)

[Project document archive	5](#project-document-archive)

[Project newsletter settings	5](#project-newsletter-settings)

[Persona & Recipient Management	5](#persona-&-recipient-management)

[Edit persona	5](#edit-persona)

[Scraping packages archive	5](#scraping-packages-archive)

[Scraping package configuration	5](#scraping-package-configuration)

[Global settings	5](#global-settings)

[Core Modules	6](#core-modules)

[Users	6](#users)

[Search Bar	6](#search-bar)

[Login page	6](#login-page)

[Authentication	6](#authentication)

[Credential Fields	6](#credential-fields)

[Actions & Options	6](#actions- &-options)

[Error Handling	7](#error-handling)

[Styling & UX	7](#styling- &-ux)

[Security Considerations	7](#security-considerations)

[Post-Login Flow	7](#post-login-flow)

[Forgot password process	7](#forgot-password-process)

[Home Page	7](#home-page)

[Header & Navigation	7](#header- &-navigation)

[Search bar	8](#search-bar-1)

[Purpose	8](#purpose-1)

[UI Behavior	8](#ui-behavior)

[Key Metrics & Stats	9](#key-metrics- &-stats)

[Recent Projects Section	10](#recent-projects-section)

[Recent Activity Feed	11](#recent-activity-feed)

[Projects page	12](#projects-page)

[Purpose	12](#purpose-2)

[UI Layout & Components	12](#ui-layout- &-components)

[Key Functionalities	13](#key-functionalities)

[Data Model & Fields	13](#data-model- &-fields)

[Error Handling & Validation	14](#error-handling- &-validation)

[Security & Permissions	15](#security- &-permissions)

[Future Enhancements	15](#future-enhancements)

[Single Project page	15](#single-project-page)

[Purpose	15](#purpose-3)

[UI Layout & Sections	16](#ui-layout- &-sections)

[Key Functionalities	17](#key-functionalities-1)

[Data Model	17](#data-model)

[Security & Permissions	19](#security- &-permissions-1)

[Validations & Error Handling	19](#validations- &-error-handling)

[UI Reference	19](#ui-reference)

[Future Enhancements	19](#future-enhancements-1)

## **UI Components and Interactions** {#ui-components-and-interactions}

### **Common Components** {#common-components}

#### **Modals and Dialogs** {#modals-and-dialogs}

##### **Create/Edit Project Modal**
- **Purpose**: Create new projects or edit existing ones
- **Fields**:
  - Project Name (required)
  - Description (required)
  - Status (Active/Archived)
- **Actions**:
  - Save
  - Cancel
- **Validation**:
  - Name must be unique
  - Required fields must be filled
  - Description max length: 500 characters

##### **Upload Document Modal**
- **Purpose**: Upload new documents to a project
- **Features**:
  - Drag and drop support
  - File type validation
  - Size limit (10MB)
  - Progress indicator
- **Actions**:
  - Upload
  - Cancel
- **Validation**:
  - File size check
  - File type check
  - Duplicate name check

##### **Add/Edit Recipient Modal**
- **Purpose**: Add new recipients or edit existing ones
- **Fields**:
  - Name (required)
  - Email (required)
  - Persona (required)
  - Status (Active/Inactive)
- **Actions**:
  - Save
  - Cancel
- **Validation**:
  - Email format
  - Required fields
  - Unique email per project

##### **Configure Scraping Package Modal**
- **Purpose**: Set up or modify scraping packages
- **Fields**:
  - Package Name (required)
  - Description (required)
  - Schedule (required)
  - Status (Active/Inactive)
- **Actions**:
  - Save
  - Test Run
  - Cancel
- **Validation**:
  - Required fields
  - Valid schedule format
  - Unique name

#### **Tables and Lists** {#tables-and-lists}

##### **Projects Table**
- **Columns**:
  - Name
  - Description
  - Status
  - Last Updated
  - Actions
- **Features**:
  - Sortable columns
  - Pagination
  - Search/filter
  - Bulk actions
- **Row Actions**:
  - Edit
  - Archive
  - View Details

##### **Documents List**
- **Display Mode**:
  - Grid view
  - List view
- **Item Information**:
  - File name
  - Type
  - Size
  - Upload date
  - Actions
- **Features**:
  - Sort by date
  - Filter by type
  - Search
- **Item Actions**:
  - Download
  - Delete
  - Preview

##### **Recipients Table**
- **Columns**:
  - Name
  - Email
  - Persona
  - Status
  - Actions
- **Features**:
  - Sortable columns
  - Filter by status
  - Search
  - Bulk actions
- **Row Actions**:
  - Edit
  - Remove
  - Change Status

#### **Forms and Inputs** {#forms-and-inputs}

##### **Newsletter Configuration Form**
- **Fields**:
  - Subject Line
  - Schedule
  - Recipients Selection
  - Content Template
- **Features**:
  - Rich text editor
  - Template selection
  - Preview
  - Schedule picker
- **Validation**:
  - Required fields
  - Valid date/time
  - At least one recipient

##### **Persona Configuration Form**
- **Fields**:
  - Name
  - Description
  - Tone Settings
  - Content Preferences
- **Features**:
  - Tone selector
  - Keyword input
  - Content type selection
- **Validation**:
  - Required fields
  - Valid tone selection
  - Valid preferences

#### **Navigation Components** {#navigation-components}

##### **Main Navigation**
- **Items**:
  - Home
  - Projects
  - Scraping Packages
  - Settings
- **Features**:
  - Active state indication
  - Collapsible on mobile
  - Quick actions menu

##### **Project Navigation**
- **Items**:
  - Overview
  - Documents
  - Recipients
  - Newsletters
  - Settings
- **Features**:
  - Breadcrumb navigation
  - Tab-based navigation
  - Quick actions

#### **Status Indicators** {#status-indicators}

##### **Project Status**
- **States**:
  - Active (green)
  - Archived (gray)
  - Pending (yellow)
- **Features**:
  - Color coding
  - Status text
  - Hover tooltip

##### **Newsletter Status**
- **States**:
  - Scheduled (blue)
  - Sent (green)
  - Failed (red)
  - Draft (gray)
- **Features**:
  - Color coding
  - Status text
  - Progress indicator

##### **Recipient Status**
- **States**:
  - Active (green)
  - Inactive (gray)
  - Unsubscribed (red)
- **Features**:
  - Color coding
  - Status text
  - Last activity date

### **Interactive Features** {#interactive-features}

#### **Drag and Drop** {#drag-and-drop}
- **Supported Areas**:
  - Document upload
  - Recipient reordering
  - Project card reordering
- **Visual Feedback**:
  - Drop zone highlighting
  - Drag preview
  - Success/error animations

#### **Real-time Updates** {#real-time-updates}
- **Features**:
  - Live status changes
  - Progress indicators
  - Toast notifications
- **Update Types**:
  - Document upload progress
  - Newsletter sending status
  - Scraping job status

#### **Search and Filter** {#search-and-filter}
- **Global Search**:
  - Projects
  - Documents
  - Recipients
- **Advanced Filters**:
  - Date range
  - Status
  - Type
  - Persona

#### **Bulk Actions** {#bulk-actions}
- **Supported Operations**:
  - Delete multiple items
  - Update status
  - Export data
- **UI Elements**:
  - Checkbox selection
  - Action toolbar
  - Confirmation dialog

### **Responsive Design** {#responsive-design}

#### **Breakpoints** {#breakpoints}
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

#### **Mobile Adaptations** {#mobile-adaptations}
- **Navigation**:
  - Hamburger menu
  - Bottom navigation
  - Swipe gestures
- **Tables**:
  - Card view
  - Horizontal scroll
  - Expandable rows
- **Forms**:
  - Full-width inputs
  - Stacked layout
  - Touch-friendly controls

#### **Tablet Optimizations** {#tablet-optimizations}
- **Layout**:
  - Split view
  - Side-by-side panels
  - Adaptive grid
- **Navigation**:
  - Collapsible sidebar
  - Tab navigation
  - Quick actions menu

### **Accessibility** {#accessibility}

#### **Keyboard Navigation** {#keyboard-navigation}
- **Focus Management**:
  - Logical tab order
  - Focus indicators
  - Skip links
- **Shortcuts**:
  - Global actions
  - Navigation
  - Common operations

#### **Screen Reader Support** {#screen-reader-support}
- **ARIA Labels**:
  - Interactive elements
  - Status messages
  - Form controls
- **Semantic HTML**:
  - Proper heading structure
  - Landmark regions
  - Live regions

#### **Color and Contrast** {#color-and-contrast}
- **Color Usage**:
  - Status indicators
  - Interactive elements
  - Text hierarchy
- **Contrast Ratios**:
  - Text: 4.5:1
  - Large text: 3:1
  - UI components: 3:1

### **Error Handling** {#error-handling}

#### **Form Validation** {#form-validation}
- **Real-time Validation**:
  - Field-level feedback
  - Error messages
  - Success states
- **Submission Validation**:
  - Form-level errors
  - Required fields
  - Format validation

#### **API Error Handling** {#api-error-handling}
- **Error States**:
  - Network errors
  - Validation errors
  - Server errors
- **User Feedback**:
  - Error messages
  - Retry options
  - Fallback content

#### **Offline Support** {#offline-support}
- **Features**:
  - Offline indicators
  - Data persistence
  - Sync status
- **User Experience**:
  - Clear messaging
  - Recovery options
  - Progress tracking

## **Introduction** {#introduction}

### **Purpose** {#purpose}

The purpose of this document is to provide a comprehensive technical specification for the Proton AI-powered content curation and delivery system. This system is designed to enhance the ongoing engagement of consulting clients by providing tailored content post-project completion, utilizing advanced AI capabilities integrated within a robust CRM interface.

### **Scope** {#scope}

Proton is an AI-powered content curation and delivery system with comprehensive CRM capabilities. Its purpose is to keep past consulting clients informed and engaged by automating the delivery of relevant, industry-specific content, and by managing client interactions and enabling content customization.

### **Target audience** {#target-audience}

This CRM is intended for Proto's internal teams who oversee content curation, client project engagements, and the creation of tailored personas for newsletters and other outreach. By centralizing these tasks, the system streamlines document uploads, scraping configurations, and persona-based content delivery, ensuring each client receives insights customized to their needs and roles

### **Overview** {#overview}

The document will detail the functionalities intended for the Proton CRM system, describe the interactions users will have with the platform, and outline the technical infrastructure required to support these operations .This document outlines the scope of work required for the CRM development team.

## **Core Pages** {#core-pages}

### **Login** {#login}

* The admin login page has a clean design with fields for email and password, It can contain security features like CAPTCHA.  
* UI Reference: Missing

### **Home** {#home}

* Dashboard view provides an overview of projects, recipients, packages, and newsletters, with detailed information about recent project activity.  
* UI Reference: "Home" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0).

### **Projects** {#projects}

* A project archive that allows you to create new projects with summarized project information.  
* UI Reference: Missing.

### **Single project** {#single-project}

* Gives detailed information of a single project. Has the ability to edit a project, view project dashboards, view metrics (documents, scraping packages, recipients, next newsletter date).  
* UI Reference: "Projects" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0).

#### **Project document archive** {#project-document-archive}

* Provides an overview of all uploaded documents and enables file management, including uploading, downloading, and deleting files.  
* UI Reference: Missing

#### **Project newsletter settings** {#project-newsletter-settings}

* Displays the newsletter settings for current projects and allows users to edit and save them.  
* UI Reference: Missing

#### **Persona & Recipient Management** {#persona- &-recipient-management}

* Displays an archive of personas and recipients with the ability to create, edit and delete them.  
* UI Reference: "Persona & Recipient" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0).

#### **Edit persona** {#edit-persona}

* Allows for the modification of persona information, tone & prompt preferences, and the uploading of documents and packages.  
* UI Reference: "Edit persona" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0).

### **Scraping packages archive** {#scraping-packages-archive}

* Presents a repository of Scraping packages that can be edited, activated and deactivated.  
* UI Reference: Missing.

### **Scraping package configuration** {#scraping-package-configuration}

* Enables users to set up and manage automated data ingestion sources for a specific target audience.  
* UI Reference: Missing.

### **Global settings** {#global-settings}

* Modify organisation name, time zone, AI module selection, SMTP configuration, and security and privacy settings in General settings.  
* UI Reference: "Global settings" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0).

## **Core Modules** {#core-modules}

### **Users** {#users}

* The user is typically an internal staff member with assigned permissions (e.g., Admin, Editor) who manages project-related tasks such as uploading documents, configuring scraping packages, and scheduling newsletters. They aim to keep each project's data organized and ensure smooth delivery of relevant updates to various recipients.  
* UI Reference: "Home" screen in [wireframes](https://www.figma.com/design/O56Uaw3NQQvS2wLZK1n0Dy/Proton-Wireframes-0213?node-id=0-1&p=f&t=8jgp2AXxUuAbwcNU-0), located in the header. A profile page is missing.


### **Search Bar** {#search-bar}

* **Search bar:** A search box with auto-suggestions to find projects, documents, or recipients.

## **Login page** {#login-page}

### **Authentication** {#authentication}

* The CEM login page is the entry page where users are prompted to enter their login credentials (email or username and password). It includes a "Remember Me" checkbox and a link to reset passwords. Upon successful login, users are directed to the home page dashboard.

### **Credential Fields** {#credential-fields}

* **Username or Email Field**: A text field for the user's unique identifier.  
* **Password Field**: An obscured input for password entry.

### **Actions & Options** {#actions- &-options}

* **Login Button**: Submits the credentials to the authentication service.  
* **Remember Me** (optional): A checkbox so users can remain logged in for a period of 10 days.  
* **Forgot Password** Link: Initiates a password reset flow (e.g., email-based recovery).

### **Error Handling** {#error-handling}

* If the user enters invalid credentials, an error message (e.g., "Incorrect username or password") is displayed in the modal.  
* Security best practices dictate limiting the number of login attempts to 4 times and including a CAPTCHA if unusual activity is detected.

### **Styling & UX** {#styling- &-ux}

* A clean, minimal layout with clear labels and spacing.  
* Prominent call-to-action (Login Button) to reduce user confusion.  
* Branding elements (logo, color scheme) for a consistent user experience.

### **Security Considerations** {#security-considerations}

* **HTTPS/TLS** enforced to protect credentials in transit.

### **Post-Login Flow** {#post-login-flow}

* On successful login, users are redirected to the **CEM** home page dashboard, where they can see their projects, data summaries, and navigation menus.

### **Forgot password process** {#forgot-password-process}

* **User Trigger:** The user clicks the "Forgot Password" link within the login modal.  
* **Email Prompt:** A secondary prompt appears, asking the user to enter their registered email address.  
* **Secure Reset Link:** An email is sent containing a unique, time-limited link.  
* **Password Reset Form:** Clicking the link directs the user to a page where they can enter and confirm a new password.  
* **Confirmation:** After submission, the system updates their credentials, and the user can log in with the newly set password. The user will be provided with a login link.

## **Home Page** {#home-page}

### **Header & Navigation** {#header- &-navigation}

* **Branding/Logo:** Appears at the top-left, identifying the CEM platform.  
* **Primary Navigation Links:**  
  * **Home:** Returns to this main dashboard.  
  * **Projects:** View and manage all active or archived projects.  
  * **Scraping Packages:** Configure and manage data-gathering modules.  
  * **Global Settings:** Adjust organization-wide preferences (e.g., time zone, email server, default AI settings).  
* **User Profile:** The user profile picture is displayed at the top-right. The signout link appears when hovering over the user profile picture.  
* **Search bar:** An interactive input field that sends queries to the backend for matching projects, documents, or recipients, supporting real-time suggestions (e.g., auto-complete or typeahead) to help users quickly locate specific items

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| brandLogo | String (URL) | The image or icon URL used to display the platform's logo in the header. |
| brandName | String | A textual label (e.g., "CEM Dashboard"), typically adjacent to the logo. |
| navLinks | Array of Objects | A collection of navigation items displayed in the header; each object includes a name, icon, and target route. |
| userName | String | The logged-in user's display name. |
| userRole | String | The role of the currently authenticated user (Admin or Editor), used for conditional rendering of links. |
| logoutLink | String (URL/Route) | The endpoint or route used to log out. |
| searchBar | Object / String (UI) | Configuration and placeholder text for the search field, enabling quick lookup of projects, documents, or recipients. |

### **Search bar** {#search-bar-1}

### **Purpose** {#purpose-1}

* The search bar allows users to type queries and receive **on-the-fly** suggestions (e.g., matching project names or document titles).  
* No separate results page is opened; suggestions appear in a dropdown beneath the input field.

### **UI Behavior** {#ui-behavior}

* **Autocomplete Dropdown:**  
  * As the user types (e.g., each key press), the frontend triggers a debounce (to limit requests) and then sends a query to retrieve matching items.  
  * A list of suggestions appears below the search field, showing a limited set (e.g., top 5\) of relevant matches.  
  * Clicking on a suggestion (or pressing Enter on a highlighted one) navigates the user directly to that item's detail page (if applicable) or fills the input with the chosen suggestion.  
* **Styling & Accessibility:**  
  * Dropdown remains visible until the user clicks away or clears the input.  
  * Keyboard navigation (up/down arrows) cycles through suggestions, pressing Enter selects one.

### 

### **Key Metrics & Stats** {#key-metrics- &-stats}

* **Total Projects:** Displays the number of active projects in the system.  
* **Total Recipients:** Displays the total number of newsletter subscribers across all projects.  
* **Total Documents:** Displays the total number of documents across all projects.  
* **Total Packages:** Displays the total number of scraping packages are configured across all projects.  
* **Newsletters Sent:** Tracks the cumulative number of newsletters delivered.  
* **Newsletter opened:** Tracks Tracks the cumulative number of newsletters opened in mail clients (e.g., Gmail or Outlook).

For the summary dashboard this data will be needed:

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| totalProjects | Number | Total count of active (non-archived) projects in the system |
| totalProjectsIcon | String (URL) | The icon URL used to display the project's icon in the relevant item. |
| totalRecipients | Number | Total number of recipients across all projects |
| totalRecipientsIcom | String (URL) | The icon URL used to display the recipients icon in the relevant item. |
| totalDocuments | Number | Sum of all uploaded files stored for all projects |
| totalDocumentsIcon | String (URL) | The icon URL used to display the documents icon in the relevant item. |
| totalPackages | Number | Count of all configured scraping packages |
| totalPackagesIcon | String (URL) | The icon URL used to display the Packages icon in the relevant item. |
| newslettersSent | Number | Cumulative number of newsletters dispatched to date |
| newslettersSentIcon | String (URL) | The icon URL used to display the newsletters icon in the relevant item. |

### **Recent Projects Section** {#recent-projects-section}

* **Project Cards:** Displays a short list of the most recently updated or most relevant projects, each card showing a brief description, last update timestamp, number of documents, and the next scheduled newsletter.  
* **View All Projects Link:** A button or link that directs to the full Projects list for in-depth management.

The following data is required for the summary dashboard header:

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| sectionTitle | String | The heading displayed above the list of recent projects (e.g., "Recent Projects"). |
| viewAllProjectsButton | String (URL/Route) | The link or route that, when clicked, navigates to the full project list or Projects page (e.g., `/projects`). |

The following data is required for the Recent Projects dashboard card:

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| recentProjectsTitle | String | The heading displayed above the list of recent projects (e.g., "Recent Projects"). |
| viewAllProjectsButton | String (URL/Route) | The link or route that, when clicked, navigates to the full project list or Projects page (e.g., `/projects`). |
| projectId | String | A unique identifier (e.g., UUID) for the project. |
| projectName | String | The project's displayed name/title. |
| description | String | A brief summary of the project's purpose or focus. |
| lastUpdated | Date/DateTime | A timestamp that captures the most recent update to the project. |
| documentCount | Number | The number of documents associated with this project. |
| nextNewsletterDate | Date/DateTime | The scheduled date and/or time for the next newsletter send related to this project, if any. |

### **Recent Activity Feed** {#recent-activity-feed}

* **Activity Log:** Lists real-time updates on new activity of this type:  
  * Project additions, edit or delete  
  * Document uploads or delete.  
  * Recently sent newsletters.  
  * Persona additions, edit or delete.  
  * Scraping package configuration, activated, deactivated, edit or delete.  
* **Timestamp & Detail:** Each entry shows when the activity occurred and any relevant summary (e.g., "New document uploaded to 'Marketing Campaign 2025'").

The following data is required for the Recent Activity header:

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| recentActivityTitle | String | The heading shown above the list of recent activities (e.g., "Recent Activity"). |
| viewAllActivityButton | String (URL/Route) | A link or route that navigates to a more comprehensive activity log or audit trail page. |

The following data is required for the Recent Activity card:

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| activityType | String | The type of system event (e.g., "DocumentUpload," "NewsletterSent," "PersonaModified"). |
| activityTypeIcon | String (URL) | A path or class name for the icon displayed next to the activity (e.g., "icon-upload," "icon-envelope"). |
| projectName | String | The name of the project associated with the event. (If not project-related, this could be null or omitted.) |
| timestamp | Date/DateTime | A date/time indicating when the activity occurred. |
| details | String | A brief description or summary (e.g., "Newsletter sent to 1,234 recipients," "New document uploaded: Q1 Report"). |

## **Projects page** {#projects-page}

### **Purpose** {#purpose-2}

The **Projects Page** serves as an archive and management hub for all projects within the Proton CRM. From this page, authorized users can:

* **View** a list of all existing projects (both active and archived).  
* **Create** new projects.  
* **Edit** or **delete** existing projects.  
* **Activate** or **deactivate** a project.  
* **Access** each project's detailed view (the **Single Project** page).

### **UI Layout & Components** {#ui-layout- &-components}

* **Header & Navigation**  
  * Inherits the main header (logo, nav links, user profile) from the CRM layout.  
  * "Projects" is highlighted or selected in the primary navigation, indicating the current page.  
* **Projects Table / Grid**  
  * Presents each project in either a list or cards mode.  
  * Commonly shown columns/fields: Project Name, Description, Last Updated, Status (e.g., Active/Archived), and a quick action menu (Edit, Activate/deactivate, Archive or View).  
* **Create New Project Button**  
  * A button (e.g., "+ Create Project") that opens a module for creating a new project.  
  * Project creation contains the project's title and subtitle

**Pagination**

* **Display Conditions**  
  * If there are more than 50 projects in **List Mode**, pagination controls appear (e.g., "Page 1 of 5").  
  * If there are more than 25 projects in **Card Mode**, pagination controls appear under the grid.  
* **UI/UX Details**  
  * The pagination bar at the bottom of the project listings shows the current page and has arrows for navigation. The design is responsive, so on smaller screens page numbers might be replaced with a dropdown or Previous/Next buttons.

### **Key Functionalities** {#key-functionalities}

* **List All Projects**  
  * Displays basic project details at a glance.  
  * Allows sorting by date created, name, or last updated.  
* **Create Project**  
  * Opens a form or modal requesting the project's **name** and **description**.  
  * Edits are reflected immediately in the listing and in the single project view.  
* **Archive a Project**  
  * Offers an option to archive or remove a project entirely.  
  * Ensures confirmation dialogs to prevent accidental deletion.  
* **Navigate to Single Project**  
  * Clicking on a project in the list/card directs the user to the **Single Project** page, where they can view documents, manage scraping packages, configure newsletters, etc.  
* **Status Indicators**  
  * Each project can display a label or color-coded badge indicating whether it is active or archived.

### **Data Model & Fields** {#data-model- &-fields}

Below is a **data fields** table for rendering each project in the **Projects Page** list. It includes typical properties you might retrieve from the backend.

| Data Name | Data Type | Data Description | validation |
| :---- | :---- | :---- | :---- |
| ProjectId | String | A unique identifier (e.g., UUID) for the project. | \- **Generated** by the system (no user input). \- Must be unique across all projects. |
| dateCreated | Date/DateTime | When the project was initially created (auto-generated by system). | \- **Generated** by system on creation(no user input). |
| lastUpdated | Date/DateTime | Timestamp for the most recent update to the project's data or settings. | \- **Updated** automatically whenever the project record is modified. |
| status | String (Enum) | Indicates the project's state (e.g., "Active," "Archived") | \- **Generated** by system on creation(no user input). \- The default setting is Active. |
| projectName | String | The project's displayed name/title. | \- **Required** (cannot be empty). \- **Max length**: 100 characters (customizable). \- Must be unique among active projects, if that is a business requirement. |
| description | String | A brief summary of the project's purpose or focus. | \- **Required** (cannot be empty). \- **Max length**: 500 characters. |

### **Error Handling & Validation** {#error-handling- &-validation}

* **Unique Project Names**: The system should be able to detect duplicate names. If the suggested project name is already in use, the system should display an error message: "That project name is already taken. Please choose a different one."   
* **Mandatory Fields**: If the mandatory fields projectName and/or description are not completed, The system will generate an error message that reads "Please fill out this required field.".  
* **Permissions**: Certain roles (e.g., Admin, Editor) may have full access. Others might only create or modify projects

### **Security & Permissions** {#security- &-permissions}

* **Role-Based Access**:  
  * ***Admin*** can see and edit all projects.  
  * ***Editors*** can modify projects they own or are granted access to.  
* **Archived Projects**:  
  * Typically remain visible in the system but flagged as archived.  
  * May not appear in active project listings unless a "Show archived" filter is enabled.

### **Future Enhancements** {#future-enhancements}

* **Bulk Actions**: Archive or delete multiple projects simultaneously.  
* **Advanced Filters**: Filter by date range, owner, or tags.  
* **Analytics**: Include metrics such as open rate or newsletters sent for each project directly in the project list.

## **Single Project page** {#single-project-page}

### **Purpose** {#purpose-3}

The **Single Project Page** provides a detailed overview of one specific project, consolidating key metrics, configuration options, and quick access to related functionalities such as documents, scraping packages, recipients, and newsletter settings. It allows authorized users to **edit project details**, monitor relevant data, and perform project-specific actions.

---

### **UI Layout & Sections** {#ui-layout- &-sections}

* **Header & Project Overview**  
  * **Project Title & Description**: Displays the project name, a short summary, and an edit icon or button for modifying these details.  
  * **Key Metrics**: Quick stats:  
    * number of documents  
    * scheduled date for the next newsletter.  
    * total recipients  
    * Date of last update of these project parameter  
      * Project name  
      * Project description  
      * File uploaded or deleted  
      * Change to projects newsletter setup  
      * Change to projects recipients list  
      * Change to projects persona configuration  
* **Navigation Tabs**  
  * **Documents**: A link or tab to view and manage all uploaded documents for this project.  
  * **Scraping Packages**: A tab where users can see and configure scraping packages unique to this project.  
  * **Newsletter Settings**: A tab to edit newsletter frequency and dispatch timing.  
  * **Personas & Recipients**: A tab to manage personas, assign them to recipients, and add or   
* **Edit Project Modal or Drawer**  
  * Triggered by an "Edit" button within the **Project Overview** section.  
  * Allows updating **project name**, **description**, **status** (active/archived), and possibly advanced fields like tags or metadata.

### **Key Functionalities** {#key-functionalities-1}

* **View & Edit Project Details**  
  * Users can see the project name, description, and key stats at the top of the page.  
  * An "Edit" action lets authorized users update these fields.  
* **Quick Metrics**  
  * **Documents**: Count of how many files are currently uploaded.  
  * **Scraping Packages**: Number of active data-ingestion configurations.  
  * **Recipients**: Number of individuals subscribed under this project.  
  * **Next Newsletter Date**: Scheduled date/time of the next newsletter dispatch.  
* **Navigation to Sub-Pages**  
  * **Documents**: Lists all documents. Users can view, upload, or delete files here.  
  * **Scraping Packages**: Lists all scraping packages linked to this project with controls to toggle active/inactive or configure details.  
  * **Newsletter Settings**: Provides a form to change sending frequency, set AI prompts, and update the next send time.  
  * **Personas & Recipients**: Manages role-based personas and allows assigning them to recipients.  
* **Delete or Archive Project**  
  * An option to archive the entire project.  
  * Archiving a project triggers a confirmation dialogue.

### **Data Model** {#data-model}

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| **projectId** | String | Unique identifier for the project (e.g., UUID). |
| **projectName** | String | Human-readable title (e.g., "Marketing Campaign 2025"). |
| **description** | String | A short summary of the project's scope. |
| **status** | String (Enum) | Indicates if the project is "Active" or "Archived." |
| **dateCreated** | Date/DateTime | Timestamp of when the project was created. |
| **lastUpdated** | Date/DateTime | Most recent timestamp reflecting updates to this project. |
| **documentCount** | Number | Count of documents in this project. |
| **activePackages** | Number | Number of scraping packages currently active for this project. |
| **recipientCount** | Number | Number of recipients assigned to this project. |
| **nextNewsletterDate** | Date/DateTime | Scheduled send date/time for the next newsletter. |

### 

### 

### **Documents tab**

**Purpose:** The Documents section is a file management interface that allows users to upload, download, edit metadata, and delete documents related to the project.

#### **UI Layout & Structure**

The Documents Section is designed as an items repeater, meaning that each document is displayed as a repeating UI component in a list or grid view.

**Each document entry in the repeater includes the following fields:**

| Data Name | Data Type | Data Description |
| :---- | :---- | :---- |
| **documentId** | String | A unique identifier (e.g., UUID) for the project. |
| **documentName** | String | Human-readable title (e.g., "Marketing Campaign 2025 users analysis"). |
| **documentType** | String | File format (e.g., PDF, Word, Excel, CSV, Image) |
| **uploadDate** | Date/DateTime  | Timestamp when the file was uploaded |
| **Download button** | Image | Allows to download the file to the local storage |
| **Delete button** | image | Enables the removal of the file from both the project and the system. |

### 

#### **Functionalities**

**Each document in the items repeater supports the following actions:**

##### Download Documents

* Click the "Download" Button \- The system retrieves the document and downloads it to the user's device.

##### Delete Documents

* Click the "Delete" Button \- Triggers a confirmation dialog to prevent accidental deletions.

##### Upload New Documents

* Upload Button \- Opens a module that contains a file picker for users to upload one file.  
* Drag & Drop Support \- Users can drag and drop files directly into the upload area.  
* File Size Limit \- Restrict uploads to a maximum size of 10 mb


### **Newsletter settings tab**

The **Project Newsletter Tab** in Proton CRM allows users to manage the **newsletter scheduling, dispatch history** and **analytics tracking**.

#### **UI Elements**

The **Newsletter Tab** consists of the following key sections:

1. **Newsletter Scheduling & Frequency** \- Controls for **when and how often** newsletters are sent.  
2. **Scheduled Newsletters** \- Newsletters that have been scheduled along with their corresponding **scheduled times** are displayed in a list.  
3. **Newsletter Archive (Sent Newsletters List)** \- Displays the history of **past newsletters** with key engagement metrics.  
4. **Newsletter Analytics Overview** \- Provides **performance metrics** such as open and click rates.  
5. **Download Reports** \- Allows users to export newsletter analytics.

   ---

#### **Newsletter Scheduling & Frequency**

**Purpose**: Users can configure how often newsletters are sent and set delivery times.

##### UI Elements

**Delivery Frequency Selection** → Users can choose from:

* **Daily**  
* **Weekly**  
* **Monthly**  
* **Custom** (user-defined intervals)  **Time Picker** \- Select the **specific time** the newsletter should be dispatched (e.g., 9:00 AM).  
* **Day of Week Selector** \- Available for **weekly and custom** schedules (e.g., Monday).  
*  **Save Settings Button** \- Saves the user's selections.

##### Data Table

| Field | Type | Description |
| :---- | :---- | :---- |
| **Frequency** | Enum (Daily/Weekly/Monthly/Custom) | How often the newsletter is sent |
| **Send Time** | Time | The time newsletters are dispatched |
| **Day of Week** | Enum (Monday-Sunday) | The specific day for **weekly** or **custom** schedules |
| **Next Scheduled Date** | Date/Time | The next planned newsletter dispatch |

#### **Scheduled newsletters**

The **Scheduled newsletters** will be positioned at the **middle of the Newsletter Tab**, above the **Sent Newsletters** list.

##### UI Elements

* **Next Newsletter Title** \- Displays the **subject line** of the upcoming newsletter.  
*  **Scheduled Send Date & Time** \- Shows when the newsletter will be sent.  
*  **Recipient Count** \- Number of recipients scheduled to receive it.  
* **Preview Newsletter** (Button) \- Opens a **preview modal** of the email content.  
* **Generate Content** (Button) \- **Generates content** with the AI module with the project's scraping module  for each persona.  
*  **Cancel** (Button) \- Allows users to **cancel** the scheduled newsletter.  
*  **Reschedule** (Button) \- Allows users to **change the send date** of the scheduled newsletter.

##### Data Table

#### 

| Field | Type | Description |
| :---- | :---- | ----- |
| **Newsletter ID**	 | UUID | Unique identifier for the newsletter |
| **Subject Line**	 | String | Title of the newsletter email |
| **Scheduled Send Date**	 | Date/Time | Planned send time |
| **Total Recipients**	 | Integer | Count of recipients receiving this newsletter |
| **Status** | Enum (Scheduled/Rescheduled/Canceled) | Status of the newsletter |
| **Actions** | Buttons | Preview  / Edit  / Cancel |

#### 

#### **Sent Newsletters** 

**Purpose**: Displays a **list of previously sent newsletters** with engagement statistics.

##### UI Elements

* **Search Bar** \- Allows users to search for newsletters by **subject line.**  
* **Sent Newsletter List** \- Displays these key details: **sent date, recipient count, open rate, and click rate**.

##### Data Table

| Field | Type | Description |
| :---- | :---- | ----- |
| **Newsletter ID** | UUID | Unique identifier for each newsletter |
| **Subject Line** | String | The email subject line |
| **Sent Date** | Date/Time | When the newsletter was sent |
| **Recipients Count** | Integer | Total number of recipients |
| **Open Rate (%)** | Number | Percentage of recipients who opened the newsletter |
| **Click Rate (%)** | Number | Percentage of recipients who clicked on a link |

#### **Newsletter Analytics Overview**

**Purpose**: Tracks **open rates, click rates, and subscriber trends** to measure campaign effectiveness.

#### **UI Elements**

* **Average Open Rate Display** \- Shows the average open percentage across all newsletters in the project.  
* **Average Click Rate Display** \- Displays the percentage of recipients who clicked a link.  
* **Total Subscribers Counter** \- Displays the total number of **subscribers**.

#### **Data Table**

#### 

| Field | Type | Description |
| :---- | :---- | :---- |
| **Average Open Rate (%)** | Number | The percentage of recipients who opened newsletters by mail client (e.g, Gmail or Outlook) |
| **Average Click Rate (%)** | Number | The percentage of recipients who clicked links |
| **Total Subscribers** | Number | The percentage of recipients who unsubscribed |

#### **Download Reports**

**Purpose**: Users can export newsletter performance reports for further analysis.

##### UI Elements

**Download Report Button** \- Generates a **CSV file** containing newsletter engagement metrics.

###### *Report Includes:*

* **Sent Newsletter List** (with open & click rates)  
* **Subscriber Growth Trends**  
* **Engagement Over Time** (heatmap of when users open emails)  
* **Device & Location Metrics** (if available)

### **Personas & Recipients tab**

The **Personas & Recipients Tab** allows users to manage **recipient lists and persona-based content customization** for a project. It provides tools to assign recipients to personas, adjust AI-driven tone and content settings, and track engagement metrics.

#### **UI Elements**

**Personas Section**

* **Add Persona Button** \- Opens a modal to create a new persona.  
* **Personas List** \- Displays **existing personas** with recipient counts and last modified timestamps.  
* **Edit Persona** (Button) **\-** Opens a persona editing modal.

**Recipients Section**

* **Add Recipients Button** \- Allows users to add new recipients manually or via CSV upload.  
* **Search & Filters** \- Search by **name, email, persona, or status**.  
*  **Recipients List** \- Displays all **assigned recipients**, including their persona classification.

#### **Data Table \- Personas Section**

| Field | Type | Description |
| :---- | :---- | :---- |
| **Persona ID** | UUID | Unique identifier for the persona |
| **Persona Name** | String | Name of the persona (e.g., "Executives") |
| **Recipients Count**	 | Integer | Total number of recipients assigned to this persona |
| **AI Tone Setting** | Array | Defines AI-generated content tone (e.g., Formal/Casual/Custom) |
| **Prompt Adjustments** | String | Custom AI instructions for content generation |
| **Last Modified** | Date/Time | Last update timestamp |
| **Action** | Button | Edit Persona |

#### **Data Table \- בs Section**

| Field | Type | Description |
| :---- | :---- | :---- |
| **Recipient ID** | UUID | Unique identifier for the recipient |
| **Name Name** | String | Full name of the recipient |
| **Email** | String | Recipient's email address |
| **Persona Assigned** | String | The persona linked to the recipient |
| **Status** | Enum (Active/Inactive) | Indicates recipient subscription status |
| **Subscription Date** | Date/Time | When the recipient subscribed |
| **Action** | Button | Edit / / Remove |

### **Security & Permissions** {#security- &-permissions-1}

* **Role-Based Access**:  
  * **Admins**: Full view and edit privileges.  
  * **Editors**: Limited to updating or viewing certain fields if assigned to the project.

### **Validations & Error Handling** {#validations- &-error-handling}

* **Required Fields**: Must have a non-empty project name if editing.  
* **Status Updates**: If archiving a project, confirm that the user has admin privileges or the correct role.  
* **Not Found**: If the project ID is invalid or removed, return a `404 Not Found` response.

### **UI Reference** {#ui-reference}

This page typically appears after clicking a project card or list item from the **Projects Page** or from a **Recent Projects** section on the **Home Page**. The existing wireframes (under "Projects" or "Single Project" references) may detail how each subsection is presented (tabs or expanded sections).

### **Future Enhancements** {#future-enhancements-1}

* **Inline Document Previews**: Quick preview or search within documents from the Single Project interface.  
* **Project-Level Analytics**: Real-time stats on newsletter performance, open/click rates, or user engagement on a dedicated dashboard.  
* **Project Team Management**: Additional assignment of internal team roles to each project.

**Summary**  
The **Single Project Page** centralizes all project-specific information, enabling users to quickly manage the project's details, documents, scraping setups, newsletters, and recipients. Its intuitive layout, combined with direct navigation to deeper configuration tabs, helps streamline the overall management lifecycle for each client or internal initiative.

## **Scraping packages**

### **Purpose**

The **Scraping Packages Archive** page provides a centralized location where users can view all scraping packages in the system (across all projects or globally). Users can create new scraping packages and edit, activate, or deactivate existing ones. This helps maintain an organized repository of automated data ingestion configurations that feed content into Proton CRM.

### **UI Layout & Components**

* **Header & Navigation**

  * Inherits the same main header (logo, navigation, user profile) used throughout Proton CRM.  
  * A "Scraping Packages" link is highlighted or selected in the navigation to indicate the current page.  
* **Scraping Packages Table (or Grid)**

  * Displays each scraping package with basic details: Name, Description, Status (active/inactive), Last Run Time, and Next Scheduled Run (if applicable).  
  * May feature pagination when the total number of packages exceeds a configured threshold (e.g., 25 or 50).  
  * A search bar or filtering tool may appear at the top to find packages by name, status, or relevant keywords.  
* **Create New Package Button**

  * Allows users to create a new scraping package (opens a form or modal).  
  * The user can specify core fields such as name, source URLs, or scraping rules.  
* **Action Buttons (per package)**

  * **Edit** – Opens a configuration form for the selected scraping package.  
  * **Activate/Deactivate** – Toggles the status of the scraping package.  
  * **Delete** – Permanently removes the scraping package from the system (with a confirmation dialog).

### **Key Functionalities**

* **List All Packages:** Show a quick overview of all existing packages, both active and inactive.  
* **Activate/Deactivate:** Toggle a package's ability to run. Deactivated packages do not fetch or ingest new data.  
* **Edit Scraping Package:** Modify any part of the package configuration (e.g., name, data source, rules).  
* **Create New Scraping Package:** Launch a form or modal to define a new package (e.g., define data source URLs, set scheduling).  
* **Delete Scraping Package:** Remove a package entirely (requires confirmation).

### **Data Model & Fields**

Below is an example of possible fields for each scraping package in the archive. (Note that the original document does not detail these fields explicitly; this table follows the style used elsewhere in the specification.)

| Field Name | Type | Description | Validation |
| :---- | :---- | :---- | :---- |
| **packageId** | String (UUID) | A unique identifier for the scraping package. | Auto-generated by the system. |
| **packageName** | String | A user-facing name or title for the scraping package (e.g., "Tech News Scraper"). | Required; must be unique among packages |
| **description** | String | A brief explanation of the package's purpose (e.g., "Scrapes top tech news sites weekly."). | Required |
| **status** | Enum | Active/Inactive, specifying whether the package is currently scraping data or paused. | Default: Active |
| **schedule** | Enum or String | Defines how often the scraping package runs (e.g., daily, weekly, monthly, or cron-like expression). | Required |
| **lastRun** | Date/DateTime | Timestamp of the most recent scraping job completion. | Auto-updated by system |
| **nextRun** | Date/DateTime | Timestamp of the next scheduled scraping job. | Auto-updated by system |
| **createdAt** | Date/DateTime | Timestamp when the package was created. | Auto-generated by system |
| **updatedAt** | Date/DateTime | Timestamp for the most recent modification. | Auto-updated by system |

### **Error Handling & Validation**

* **Unique Package Names:** If a user attempts to create or rename a package with a name that already exists, display an error (e.g., "This package name is already taken.").  
* **Required Fields:** If mandatory fields (such as `packageName` or `description`) are left blank, prompt the user to fill them in before saving.  
* **Confirmation on Delete:** Users must confirm deletion (e.g., "Are you sure you want to delete this package?").

### **Future Enhancements**

* **Bulk Actions:** Ability to activate/deactivate or delete multiple packages at once.  
* **Enhanced Filtering & Tagging:** Filter packages by category or attach tags for easier organization.  
* **Run History Logs:** Show the full log of scraping attempts, including success/failure states, data volumes ingested, etc.

## **Scraping Packages Archive**

### **Purpose**

The **Scraping Packages Archive** page provides a centralized location where users can view all scraping packages in the system (across all projects or globally). Users can create new scraping packages and edit, activate, or deactivate existing ones. This helps maintain an organized repository of automated data ingestion configurations that feed content into Proton CRM.

### **UI Layout & Components**

* **Header & Navigation**

  * Inherits the same main header (logo, navigation, user profile) used throughout Proton CRM.  
  * A "Scraping Packages" link is highlighted or selected in the navigation to indicate the current page.  
* **Scraping Packages Table (or Grid)**

  * Displays each scraping package with basic details: Name, Description, Status (active/inactive), Last Run Time, and Next Scheduled Run (if applicable).  
  * May feature pagination when the total number of packages exceeds a configured threshold (e.g., 25 or 50).  
  * A search bar or filtering tool may appear at the top to find packages by name, status, or relevant keywords.  
* **Create New Package Button**

  * Allows users to create a new scraping package (opens a form or modal).  
  * The user can specify core fields such as name, source URLs, or scraping rules.  
* **Action Buttons (per package)**

  * **Edit** – Opens a configuration form for the selected scraping package.  
  * **Activate/Deactivate** – Toggles the status of the scraping package.  
  * **Delete** – Permanently removes the scraping package from the system (with a confirmation dialog).

### **Key Functionalities**

* **List All Packages:** Show a quick overview of all existing packages, both active and inactive.  
* **Activate/Deactivate:** Toggle a package's ability to run. Deactivated packages do not fetch or ingest new data.  
* **Edit Scraping Package:** Modify any part of the package configuration (e.g., name, data source, rules).  
* **Create New Scraping Package:** Launch a form or modal to define a new package (e.g., define data source URLs, set scheduling).  
* **Delete Scraping Package:** Remove a package entirely (requires confirmation).

### **Data Model & Fields**

Below is an example of possible fields for each scraping package in the archive. (Note that the original document does not detail these fields explicitly; this table follows the style used elsewhere in the specification.)

| Field Name | Type | Description | Validation |
| :---- | :---- | :---- | :---- |
| **packageId** | String (UUID) | A unique identifier for the scraping package. | Auto-generated by the system. |
| **packageName** | String | A user-facing name or title for the scraping package (e.g., "Tech News Scraper"). | Required; must be unique among packages |
| **description** | String | A brief explanation of the package's purpose (e.g., "Scrapes top tech news sites weekly."). | Required |
| **status** | Enum | Active/Inactive, specifying whether the package is currently scraping data or paused. | Default: Active |
| **schedule** | Enum or String | Defines how often the scraping package runs (e.g., daily, weekly, monthly, or cron-like expression). | Required |
| **lastRun** | Date/DateTime | Timestamp of the most recent scraping job completion. | Auto-updated by system |
| **nextRun** | Date/DateTime | Timestamp of the next scheduled scraping job. | Auto-updated by system |
| **createdAt** | Date/DateTime | Timestamp when the package was created. | Auto-generated by system |
| **updatedAt** | Date/DateTime | Timestamp for the most recent modification. | Auto-updated by system |

### 

### **Error Handling & Validation**

* **Unique Package Names:** If a user attempts to create or rename a package with a name that already exists, display an error (e.g., "This package name is already taken.").  
* **Required Fields:** If mandatory fields (such as `packageName` or `description`) are left blank, prompt the user to fill them in before saving.  
* **Confirmation on Delete:** Users must confirm deletion (e.g., "Are you sure you want to delete this package?").

### **Security & Permissions**

* **Role-Based Access:**  
  * **Admins:** Full access to view, create, edit, and delete any package.  
  * **Editors:** May be restricted to read-only or partial edit rights, depending on the organization's policy.  
* **Data Privacy:** If scraping packages involve credentials or private APIs, secure storage and masked display of such credentials is recommended (not shown in plain text).

### **Future Enhancements**

* **Bulk Actions:** Ability to activate/deactivate or delete multiple packages at once.  
* **Enhanced Filtering & Tagging:** Filter packages by category or attach tags for easier organization.  
* **Run History Logs:** Show the full log of scraping attempts, including success/failure states, data volumes ingested, etc.

## 

## **Scraping Package Configuration**

### **Purpose**

The **Scraping Package Configuration** page (or form) is where users specify exactly how a package scrapes data, what sources it uses, which schedule it follows, and any special rules for filtering or parsing the content. While the Archive lists packages, this page handles the detailed setup and maintenance of each package.

### **UI Layout & Components**

* **Header / Page Title**

  * Typically shows the package's name (e.g., "Configure: Tech News Scraper").  
* **Configuration Form Sections**

  * **Basic Info:** Name, description, active/inactive toggle.  
  * **Data Sources URL:** One or more source URLs or API endpoints the scraper targets.  
  * **Document Upload:** Section to upload and manage supplemental files that may aid the scraping logic or store domain data.  
  * **Schedule Settings:** Frequency of the scraping job (daily, weekly, monthly, custom cron).  
  * **Advanced Rules:** Keywords to include/exclude, language filtering, or region-based filters.

**Document Upload & Management**

* **Upload Button:** Allows adding one or more files (e.g., PDF, TXT, CSV) directly to the scraping package configuration.  
* **Document List (Items Repeater):** Displays uploaded files with file name, upload date, and possible actions (Download, Delete).  
* **File Size Limit:** Each document might be restricted to a maximum size (e.g., 10 MB).  
* **Allowed File Types:** (As needed) e.g., PDF, DOCX, CSV, TXT.  
    
* **Actions & Buttons**

  * **Save / Update Configuration** – Saves all form changes.  
  * **Test Run** – (Optional) Manually triggers a single scraping run to validate the config.  
  * **Cancel** – Discards changes and returns to the previous screen (e.g., the archive).

### **Key Functionalities**

* **Set or Edit Name & Description:** Clearly identify the scraping package's purpose.  
* **Set Sources, Endpoint or Document:** Enter or edit one or multiple URLs, possibly with additional credentials if needed (e.g., API keys).  
* **Set Document:** Enter or edit one or multiple documents.  
* **Define Schedule:** Use a dropdown or text-based scheduler (e.g., cron syntax) to determine run intervals.  
* **Add Filter/Parsing Rules:** Indicate which types of content should be extracted or ignored.  
* **Activate/Deactivate the Package:** Toggle whether the package should run automatically.  
* **Manual Test Run (if supported):** Let users immediately try the scraping process to confirm correct setup.

### **Data Model & Fields**

Although each organization might have different data points to store, below is a typical set of fields for a single scraping package's configuration.

| Field Name | Type | Description | Validation |
| :---- | :---- | :---- | :---- |
| **packageId** | String (UUID) | Unique identifier for the scraping package. | Auto-generated, read-only. |
| **packageName** | String | User-facing title or label. | Required, unique among packages. |
| **description** | String | Brief explanation of the package's purpose. | Required. |
| **status** | Enum | Indicates Active / Inactive. | Default: Active. |
| **sourceURLs** | Array of Strings | One or more URLs to be scraped. | Must be valid URLs; at least one required. |
| **uploadedDocuments** | Array of Objects | Files attached for reference or specialized scraping instructions. Each object has at least `documentId`, `documentName`, `uploadDate`. | File size/type limits as defined by admin. |
| **schedule** | String / Enum | Defines frequency (daily, weekly, monthly, custom). Could also be cron-like expression. | Required. |
| **filters** | Object or String | Additional logic or filtering (e.g., only parse articles in English or containing certain keywords). | Optional. |
| **credentials** | Object (secure) | If applicable, API keys or basic auth credentials. Must be stored securely (e.g., encrypted at rest). | Protected, not displayed plainly. |
| **lastRun** | Date/DateTime | When the package last executed. | Auto-updated by system. |
| **nextRun** | Date/DateTime | Next scheduled run (calculated based on schedule). | Auto-updated by system. |
| **createdAt** | Date/DateTime | Creation timestamp. | Auto-generated, read-only. |
| **updatedAt** | Date/DateTime | Timestamp of the most recent configuration change. | Auto-updated by system. |

### **Error Handling & Validation**

* **Required Fields:** `packageName`, `description`, and `sourceURLs` cannot be blank.  
* **URL Validation:** If any `sourceURLs` entry is invalid, display an error message (e.g., "Please provide a valid URL").  
* **Schedule Validation:** If the user enters a custom schedule, ensure it follows the cron format or is recognized by the scheduling system.  
* **Unique Name Check:** If a user attempts to rename the package to a name that already exists, display an error.  
* **Credentials Security:** If credentials are incorrect or missing, provide a distinct warning or error message (e.g., "Invalid API key").

### **Security & Permissions**

* **Audit Logs:** Track changes to schedules, source URLs, or credentials.

### **Future Enhancements**

* **Multiple Source Schedules:** Support different frequencies for different URLs within the same package.  
* **Custom Transformers/Parsers:** Let users define transformations or parsing steps (e.g., using a simple script or JSONPath).  
* **Real-Time Monitoring & Error Reports:** Provide logs or email alerts if a scraping run fails.

## **Conclusion**

This specification document outlines the core functionality, data models, and user experience flows for the Proton CRM system. By consolidating project, persona, and content management within a single interface—and now extending these capabilities with robust scraping, document handling, and newsletter features—Proton aims to streamline the entire client engagement cycle. As the platform evolves, future enhancements and real-world feedback will guide iterative refinements, ensuring Proton remains a flexible, efficient, and scalable solution for content curation and delivery.