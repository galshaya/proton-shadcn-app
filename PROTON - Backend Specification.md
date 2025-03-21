# PROTON - Backend Specification

## Overview

This document outlines the backend architecture and API specifications for the Proton Content Curation and Delivery System. The backend is designed to handle data management, content processing, and delivery of personalized content to recipients.

## Technology Stack

- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Email Service**: AWS SES
- **AI Integration**: OpenAI API
- **Task Queue**: Bull with Redis
- **Caching**: Redis

## Database Schema

### Projects
```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  description String
  status      String   @default("Active") // Active, Archived
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  documents   Document[]
  recipients  Recipient[]
  packages    ScrapingPackage[]
  newsletters Newsletter[]
}
```

### Documents
```prisma
model Document {
  id        String   @id @default(uuid())
  name      String
  type      String
  url       String   // S3 URL
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Recipients
```prisma
model Recipient {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  persona   String
  status    String   @default("Active") // Active, Inactive
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Scraping Packages
```prisma
model ScrapingPackage {
  id          String   @id @default(uuid())
  name        String
  description String
  status      String   @default("Active") // Active, Inactive
  schedule    String   // Cron expression
  lastRun     DateTime?
  nextRun     DateTime?
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Newsletters
```prisma
model Newsletter {
  id            String   @id @default(uuid())
  subject       String
  content       String   // HTML content
  status        String   // Scheduled, Sent, Failed
  scheduledFor  DateTime
  sentAt        DateTime?
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## API Endpoints

### Projects

#### GET /api/projects
- List all projects
- Query parameters:
  - status (optional)
  - search (optional)
  - page (optional)
  - limit (optional)

#### POST /api/projects
- Create a new project
- Request body:
```json
{
  "name": "string",
  "description": "string"
}
```

#### GET /api/projects/:id
- Get project details

#### PUT /api/projects/:id
- Update project
- Request body:
```json
{
  "name": "string",
  "description": "string",
  "status": "string"
}
```

#### DELETE /api/projects/:id
- Archive project

### Documents

#### GET /api/projects/:id/documents
- List project documents

#### POST /api/projects/:id/documents
- Upload document
- Multipart form data:
  - file: File
  - name: string

#### DELETE /api/projects/:id/documents/:documentId
- Delete document

### Recipients

#### GET /api/projects/:id/recipients
- List project recipients

#### POST /api/projects/:id/recipients
- Add recipient
- Request body:
```json
{
  "name": "string",
  "email": "string",
  "persona": "string"
}
```

#### PUT /api/projects/:id/recipients/:recipientId
- Update recipient
- Request body:
```json
{
  "name": "string",
  "email": "string",
  "persona": "string",
  "status": "string"
}
```

#### DELETE /api/projects/:id/recipients/:recipientId
- Remove recipient

### Scraping Packages

#### GET /api/projects/:id/packages
- List project scraping packages

#### POST /api/projects/:id/packages
- Create scraping package
- Request body:
```json
{
  "name": "string",
  "description": "string",
  "schedule": "string"
}
```

#### PUT /api/projects/:id/packages/:packageId
- Update package
- Request body:
```json
{
  "name": "string",
  "description": "string",
  "schedule": "string",
  "status": "string"
}
```

#### DELETE /api/projects/:id/packages/:packageId
- Delete package

### Newsletters

#### GET /api/projects/:id/newsletters
- List project newsletters

#### POST /api/projects/:id/newsletters
- Schedule newsletter
- Request body:
```json
{
  "subject": "string",
  "scheduledFor": "string (ISO date)",
  "recipients": ["string (recipient IDs)"]
}
```

#### GET /api/projects/:id/newsletters/:newsletterId
- Get newsletter details

#### DELETE /api/projects/:id/newsletters/:newsletterId
- Cancel scheduled newsletter

## Background Jobs

### Scraping Jobs
- Implemented using Bull queue
- Runs based on package schedule
- Stores scraped content in Redis cache
- Updates package lastRun and nextRun timestamps

### Newsletter Generation
- Triggered by scheduled newsletters
- Uses OpenAI API to generate personalized content
- Sends emails via AWS SES
- Updates newsletter status and sentAt timestamp

## Security

### Authentication
- JWT-based authentication
- Token refresh mechanism
- Role-based access control

### Data Protection
- File encryption at rest
- Secure file uploads
- API rate limiting
- Input validation and sanitization

## Monitoring and Logging

### Metrics
- API response times
- Job processing times
- Error rates
- Newsletter delivery rates

### Logging
- Application logs
- Access logs
- Error logs
- Audit logs

## Deployment

### Infrastructure
- Containerized with Docker
- Orchestrated with Kubernetes
- CI/CD with GitHub Actions

### Environment Variables
```env
DATABASE_URL=
REDIS_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
OPENAI_API_KEY=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
pnpm prisma migrate dev
```

4. Start development server:
```bash
pnpm dev
```

## Testing

### Unit Tests
- Jest for API endpoints
- Supertest for HTTP requests

### Integration Tests
- Database operations
- File uploads
- Email sending

### E2E Tests
- User flows
- Critical paths

## Future Enhancements

1. Real-time updates using WebSocket
2. Advanced analytics dashboard
3. A/B testing for newsletters
4. Multi-language support
5. Advanced content personalization
6. API rate limiting and quotas
7. Advanced scheduling options
8. Content templates
9. Recipient segmentation
10. Advanced reporting 