# 🎓 Scholarship Management System

A comprehensive, enterprise-grade full-stack application for managing scholarship applications with advanced document processing, AI-powered verification, and role-based access control. Built with modern cloud-native technologies and microservices architecture.

<div align="center">
  <img src="./assets/preview.png" alt="Scholarship Management System Preview" width="800"/>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

The Scholarship Management System is a production-ready, scalable platform designed to streamline the entire scholarship lifecycle—from application submission to award disbursement. It leverages cloud services (Azure, Firebase) for authentication, storage, and AI-powered document analysis, while maintaining a robust MongoDB backend for data persistence.

### Key Objectives
- **Automate** scholarship application workflows
- **Digitize** document verification with AI/ML capabilities
- **Centralize** student, admin, and scholarship data management
- **Enhance** user experience with real-time updates and notifications
- **Ensure** enterprise-grade security and compliance

---

## 🏛️ System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  React SPA (Vite + TypeScript + Material-UI)                    │
│  ├─ Authentication Context (Firebase Auth)                      │
│  ├─ State Management (React Context + Hooks)                    │
│  ├─ Routing (React Router v6)                                   │
│  └─ API Client (Axios with Interceptors)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────▼────────────────────────────────────────────┐
│                      API Gateway Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server (Node.js + TypeScript)                       │
│  ├─ Middleware Stack                                            │
│  │  ├─ Helmet (Security Headers)                                │
│  │  ├─ CORS (Cross-Origin Resource Sharing)                     │
│  │  ├─ Rate Limiting (DDoS Protection)                          │
│  │  ├─ Compression (Response Optimization)                      │
│  │  ├─ Morgan (HTTP Request Logging)                            │
│  │  └─ Error Handler (Centralized Error Management)             │
│  └─ Authentication & Authorization                              │
│     ├─ Firebase Admin SDK (Token Verification)                  │
│     ├─ JWT Middleware                                            │
│     └─ Role-Based Access Control (RBAC)                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                    Business Logic Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer (TypeScript)                                    │
│  ├─ Auth Service          ├─ Scholarship Service                │
│  ├─ User Service          ├─ Document Service                   │
│  ├─ Application Service   └─ Notification Service               │
│  └─ Validation (Joi/Yup Schemas)                                │
└────────┬────────────────────────────────┬───────────────────┬───┘
         │                                │                   │
┌────────▼────────┐  ┌──────────────────▼─────┐  ┌────────────▼──────┐
│  Data Layer     │  │   Cloud Services       │  │  External APIs    │
├─────────────────┤  ├────────────────────────┤  ├───────────────────┤
│ MongoDB Atlas   │  │ Azure Blob Storage     │  │ Firebase Auth     │
│ ├─ Users        │  │ ├─ Document Storage    │  │ ├─ Google         │
│ ├─ Apps         │  │ └─ Static Assets       │  │ ├─ Email/Password │
│ ├─ Scholarships │  │                        │  │ └─ Phone Auth     │
│ └─ Documents    │  │ Azure AI Services      │  │                   │
│                 │  │ ├─ Form Recognizer     │  │ Firebase Realtime │
│ Mongoose ODM    │  │ ├─ Document Analysis   │  │ └─ Notifications  │
└─────────────────┘  │ └─ OCR Processing      │  └───────────────────┘
                     └────────────────────────┘
```

### Architecture Patterns

- **MVC (Model-View-Controller)**: Separation of concerns across layers
- **RESTful API Design**: Stateless, resource-based endpoints
- **Microservices-Ready**: Modular service architecture
- **Repository Pattern**: Abstracted data access layer with Mongoose
- **Middleware Pipeline**: Composable request/response processing
- **Dependency Injection**: Loose coupling between components

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for building component-based interfaces |
| **TypeScript** | 5.4.2 | Type-safe JavaScript superset |
| **Vite** | 5.1.6 | Next-generation frontend build tool (HMR, optimized builds) |
| **Material-UI (MUI)** | 6.4.8 | React component library (Material Design) |
| **React Router** | 6.30.0 | Client-side routing and navigation |
| **Axios** | 1.8.4 | Promise-based HTTP client with interceptors |
| **React Hook Form** | 7.54.2 | Performant form validation library |
| **Yup** | 1.6.1 | Schema-based validation |
| **Formik** | 2.4.6 | Form state management |
| **React Dropzone** | 14.3.8 | Drag-and-drop file upload component |
| **React Toastify** | 10.0.6 | Toast notifications |
| **Emotion** | 11.14.0 | CSS-in-JS styling solution |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **TypeScript** | 5.3.3 | Type-safe server-side development |
| **MongoDB** | 8.1.1 | NoSQL document database |
| **Mongoose** | 8.1.1 | MongoDB ODM with schema validation |
| **Firebase Admin** | 13.2.0 | Backend Firebase SDK for auth verification |
| **JWT** | 9.0.2 | JSON Web Token for stateless authentication |
| **Bcrypt.js** | 2.4.3 | Password hashing algorithm |
| **Joi** | 17.13.3 | Schema validation for request payloads |
| **Winston** | 3.11.0 | Logging library with multiple transports |
| **Helmet** | 8.1.0 | Security middleware (HTTP headers) |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing middleware |
| **Express Rate Limit** | 7.5.0 | Rate limiting middleware |
| **Compression** | 1.8.0 | Gzip compression middleware |
| **Multer** | 1.4.5 | Multipart/form-data handling (file uploads) |
| **Morgan** | 1.10.0 | HTTP request logger |

### Cloud Services & Infrastructure

| Service | Purpose |
|---------|---------|
| **Azure Blob Storage** | Document and file storage |
| **Azure AI Form Recognizer** | Intelligent document processing and OCR |
| **Firebase Authentication** | User authentication (Google, Email, Phone) |
| **Firebase Cloud Messaging** | Push notifications |
| **MongoDB Atlas** | Managed MongoDB hosting |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub Actions** | CI/CD pipeline |
| **ESLint** | Code linting and style enforcement |
| **Prettier** | Code formatting |
| **Jest** | Unit and integration testing |
| **Nodemon** | Auto-reload during development |
| **ts-node** | TypeScript execution environment |
| **Prometheus** | Metrics and monitoring (infrastructure/) |

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- **Multi-Provider Auth**: Firebase (Google, Email/Password, Phone)
- **Role-Based Access Control (RBAC)**: Student, Admin, Super Admin roles
- **JWT Token Management**: Secure, stateless session handling
- **Protected Routes**: Frontend and backend route guards
- **Token Refresh**: Automatic token renewal

### 👨‍🎓 Student Portal

- **Profile Management**: Update personal information, contact details, academic records
- **Scholarship Discovery**: Browse available scholarships with filters (category, deadline, amount)
- **Application Submission**: Multi-step form with validation
- **Document Upload**: Drag-and-drop interface with file type validation
- **Application Tracking**: Real-time status updates (Pending, Under Review, Approved, Rejected)
- **Notifications**: Email and in-app notifications

### 👨‍💼 Admin Dashboard

- **Application Management**: View, filter, and search all applications
- **Document Verification**: AI-powered document analysis and manual review
- **Scholarship CRUD**: Create, read, update, delete scholarship programs
- **User Management**: View and manage student accounts
- **Analytics Dashboard**: Statistics on applications, approvals, rejections
- **Review System**: Add notes, approve/reject with feedback
- **Bulk Operations**: Export data, bulk status updates

### 📄 Document Management

- **Secure Upload**: Azure Blob Storage integration
- **AI Processing**: Azure Form Recognizer for document analysis
- **Supported Formats**: PDF, DOCX, JPG, PNG
- **File Validation**: Size limits, type checking, virus scanning ready
- **Version Control**: Track document revisions
- **Access Control**: Role-based document access

### 🔔 Notification System

- **Multi-Channel**: Email, in-app, push notifications
- **Event-Driven**: Application status changes, deadline reminders
- **Template Engine**: Customizable notification templates
- **Scheduled Jobs**: Automated reminder system

### 🛡️ Security Features

- **Input Validation**: Joi schemas for all API endpoints
- **SQL Injection Protection**: Mongoose parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CSRF Protection**: Token-based validation
- **Rate Limiting**: Prevent DDoS and brute-force attacks
- **Password Hashing**: Bcrypt with salt rounds
- **Secure Headers**: Content Security Policy, X-Frame-Options
- **Environment Variables**: Sensitive data isolation

---

## 📁 Project Structure

```
Scholarship-Management-System/
├── frontend/                           # React SPA (Single Page Application)
│   ├── public/
│   │   └── _redirects                 # Netlify routing configuration
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.tsx # Route guard component
│   │   │   ├── forms/
│   │   │   │   ├── DocumentAnalysis.tsx      # Azure AI document analysis
│   │   │   │   ├── DocumentUpload.tsx        # Admin document upload
│   │   │   │   └── StudentDocumentUpload.tsx # Student document upload
│   │   │   └── layout/
│   │   │       ├── Header.tsx         # Navigation header
│   │   │       ├── Footer.tsx         # Page footer
│   │   │       └── Layout.tsx         # Layout wrapper
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # Global authentication state
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Authentication hook
│   │   │   └── useApi.ts              # API integration hook
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx      # Admin analytics dashboard
│   │   │   │   ├── Applications.tsx   # Application management
│   │   │   │   ├── DocumentVerification.tsx # Document review
│   │   │   │   ├── Review.tsx         # Application review
│   │   │   │   ├── Scholarships.tsx   # Scholarship CRUD
│   │   │   │   ├── Students.tsx       # User management
│   │   │   │   ├── Settings.tsx       # System settings
│   │   │   │   └── Home.tsx           # Admin home
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx          # Login page
│   │   │   │   ├── Register.tsx       # Registration page
│   │   │   │   └── ForgotPassword.tsx # Password recovery
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.tsx      # Student dashboard
│   │   │   │   ├── Applications.tsx   # My applications
│   │   │   │   ├── Scholarships.tsx   # Browse scholarships
│   │   │   │   ├── Apply.tsx          # Application form
│   │   │   │   └── Profile.tsx        # Profile management
│   │   │   ├── common/
│   │   │   │   ├── Home.tsx           # Landing page
│   │   │   │   └── About.tsx          # About page
│   │   │   └── NotFound.tsx           # 404 page
│   │   ├── services/                   # API service layer
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── scholarship.service.ts
│   │   │   ├── application.service.ts
│   │   │   ├── document.service.ts
│   │   │   └── index.ts               # Service aggregator
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript type definitions
│   │   ├── utils/
│   │   │   ├── api.ts                 # Axios instance configuration
│   │   │   ├── errorHandling.ts       # Error handling utilities
│   │   │   └── helpers.ts             # Helper functions
│   │   ├── config/
│   │   │   └── firebase.ts            # Firebase client configuration
│   │   ├── lib/
│   │   │   └── theme.ts               # MUI theme customization
│   │   ├── styles/                     # Global stylesheets
│   │   ├── App.tsx                     # Root component
│   │   ├── main.tsx                    # Application entry point
│   │   ├── index.css                   # Global styles
│   │   └── env.d.ts                    # Environment type definitions
│   ├── .env.example                    # Environment variables template
│   ├── Dockerfile                      # Frontend container image
│   ├── package.json                    # NPM dependencies
│   ├── tsconfig.json                   # TypeScript compiler config
│   ├── vite.config.ts                  # Vite bundler configuration
│   └── tailwind.config.js              # Tailwind CSS configuration
│
├── backend/                            # Node.js REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── azure.config.ts        # Azure services configuration
│   │   │   ├── firebase.ts            # Firebase Admin SDK setup
│   │   │   └── index.ts               # Config aggregator
│   │   ├── controllers/                # Request handlers
│   │   │   ├── auth.ts                # Authentication endpoints
│   │   │   ├── user.ts                # User CRUD operations
│   │   │   ├── scholarship.ts         # Scholarship management
│   │   │   ├── applications.ts        # Application processing
│   │   │   └── documents.ts           # Document handling
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   ├── role.middleware.ts     # RBAC authorization
│   │   │   ├── validate.middleware.ts # Request validation
│   │   │   └── error.middleware.ts    # Global error handler
│   │   ├── models/                     # Mongoose schemas
│   │   │   ├── user.model.ts          # User schema
│   │   │   ├── application.model.ts   # Application schema
│   │   │   └── document.model.ts      # Document schema
│   │   ├── routes/                     # API route definitions
│   │   │   ├── auth.routes.ts         # /api/auth
│   │   │   ├── user.routes.ts         # /api/users
│   │   │   ├── scholarship.routes.ts  # /api/scholarships
│   │   │   ├── application.routes.ts  # /api/applications
│   │   │   └── document.routes.ts     # /api/documents
│   │   ├── schemas/                    # Joi validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   ├── scholarship.schema.ts
│   │   │   ├── application.schema.ts
│   │   │   └── document.schema.ts
│   │   ├── services/                   # Business logic layer
│   │   │   ├── auth.service.ts        # Authentication logic
│   │   │   ├── user.service.ts        # User operations
│   │   │   ├── scholarship.service.ts # Scholarship logic
│   │   │   ├── application.service.ts # Application workflow
│   │   │   ├── document.service.ts    # Document processing
│   │   │   └── notification.service.ts # Notification dispatch
│   │   ├── utils/
│   │   │   ├── database.ts            # MongoDB connection
│   │   │   ├── logger.ts              # Winston logger setup
│   │   │   ├── error.ts               # Custom error classes
│   │   │   ├── azureStorage.ts        # Azure Blob Storage client
│   │   │   └── azureAI.ts             # Azure AI Form Recognizer
│   │   ├── types/
│   │   │   └── express/
│   │   │       └── index.d.ts         # Express type extensions
│   │   ├── app.ts                      # Express app initialization
│   │   └── index.ts                    # Server entry point
│   ├── tests/
│   │   └── setup.ts                    # Jest test configuration
│   ├── logs/                           # Application logs (gitignored)
│   ├── .env.example                    # Environment variables template
│   ├── Dockerfile                      # Backend container image
│   ├── package.json                    # NPM dependencies
│   └── tsconfig.json                   # TypeScript compiler config
│
├── infrastructure/
│   └── prometheus.yml                  # Prometheus monitoring config
│
├── assets/                             # Project assets (images, docs)
├── Demo/                               # Demo screenshots
├── docker-compose.yml                  # Multi-container orchestration
└── README.md                           # This file
```

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend and backend in same repository for easier development
2. **TypeScript Everywhere**: Type safety across the entire stack
3. **Separation of Concerns**: Clear layering (Routes → Controllers → Services → Models)
4. **Environment-Based Config**: Different configurations for dev/staging/production
5. **Containerization**: Docker for consistent environments and easy deployment

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **npm**: v10.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Docker**: v24.x or higher ([Download](https://www.docker.com/)) *(optional, for containerized deployment)*
- **Docker Compose**: v2.x or higher *(optional, comes with Docker Desktop)*

### Cloud Services Setup
1. **MongoDB Atlas Account**
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Whitelist your IP address
   - Create database user credentials

2. **Firebase Project**
   - Create a new project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google)
   - Generate Admin SDK private key
   - Enable Cloud Messaging (optional, for notifications)

3. **Azure Account** *(optional for AI features)*
   - Create account at [azure.microsoft.com](https://azure.microsoft.com/)
   - Create Storage Account for Blob Storage
   - Create Form Recognizer resource for document analysis
   - Note the connection strings and API keys

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/Gopi-techy/Scholarship-Management-System.git
cd Scholarship-Management-System
```

### 2. Backend Setup

```powershell
cd backend

# Copy environment template
Copy-Item .env.example .env

# Install dependencies
npm install

# Configure environment variables (edit .env file)
# Required variables:
# - MONGODB_URI
# - FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
# - JWT_SECRET
# - AZURE_STORAGE_CONNECTION_STRING (optional)
# - AZURE_FORM_RECOGNIZER_ENDPOINT, AZURE_FORM_RECOGNIZER_KEY (optional)
```

#### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/scholarship_db

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Azure Storage (Optional)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=documents

# Azure AI Services (Optional)
AZURE_FORM_RECOGNIZER_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_FORM_RECOGNIZER_KEY=your-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```powershell
cd ../frontend

# Copy environment template
Copy-Item .env.example .env

# Install dependencies
npm install

# Configure environment variables (edit .env file)
```

#### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Firebase Client SDK
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Application Settings
VITE_APP_NAME=Scholarship Management System
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
```

### 4. Database Setup

```powershell
# Option A: Use MongoDB Atlas (Cloud)
# - Update MONGODB_URI in backend/.env with your Atlas connection string

# Option B: Local MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest

# Update backend/.env
# MONGODB_URI=mongodb://admin:password123@localhost:27017/scholarship_db?authSource=admin
```

---

## 💻 Development

### Running the Application Locally

#### Terminal 1: Backend Server

```powershell
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Terminal 2: Frontend Server

```powershell
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Available Scripts

#### Backend Scripts

```powershell
npm run dev          # Start development server with hot-reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled production build
npm test             # Run Jest tests
npm run lint         # Run ESLint
```

#### Frontend Scripts

```powershell
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Development Workflow

1. **Create Feature Branch**
   ```powershell
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes** and test locally

3. **Commit Changes**
   ```powershell
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and Create PR**
   ```powershell
   git push origin feature/your-feature-name
   ```

---

## 🐳 Deployment

### Docker Deployment (Recommended)

#### 1. Using Docker Compose

```powershell
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

**Services Started:**
- MongoDB: `localhost:27017`
- Backend API: `localhost:5000`
- Frontend: `localhost:5173` (served via Nginx on port 80 in container)

#### 2. Individual Docker Builds

**Backend:**
```powershell
cd backend
docker build -t scholarship-backend .
docker run -p 5000:5000 --env-file .env scholarship-backend
```

**Frontend:**
```powershell
cd frontend
docker build -t scholarship-frontend .
docker run -p 80:80 scholarship-frontend
```

### Production Deployment Options

#### Option 1: Azure App Service

1. **Backend Deployment**
   ```powershell
   # Login to Azure
   az login
   
   # Create App Service
   az webapp up --name scholarship-api --runtime "NODE:20-lts"
   
   # Configure environment variables
   az webapp config appsettings set --name scholarship-api --settings \
     MONGODB_URI="..." \
     FIREBASE_PROJECT_ID="..." \
     # ... other variables
   ```

2. **Frontend Deployment**
   ```powershell
   cd frontend
   npm run build
   
   # Deploy to Azure Static Web Apps
   az staticwebapp create --name scholarship-frontend --source ./dist
   ```

#### Option 2: AWS (EC2 + S3)

1. **Backend**: Deploy on EC2 with PM2
2. **Frontend**: Build and upload to S3 + CloudFront

#### Option 3: Vercel (Frontend) + Railway (Backend)

1. **Frontend**: Connect GitHub repo to Vercel
2. **Backend**: Deploy to Railway with MongoDB plugin

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
All protected endpoints require Bearer token in header:
```
Authorization: Bearer <firebase-id-token>
```

### Core Endpoints

#### Authentication Routes (`/api/auth`)
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login with email/password
POST   /auth/logout            # Logout user
POST   /auth/refresh           # Refresh access token
GET    /auth/me                # Get current user profile
```

#### User Routes (`/api/users`)
```
GET    /users                  # Get all users (Admin only)
GET    /users/:id              # Get user by ID
PUT    /users/:id              # Update user profile
DELETE /users/:id              # Delete user (Admin only)
PATCH  /users/:id/role         # Update user role (Admin only)
```

#### Scholarship Routes (`/api/scholarships`)
```
GET    /scholarships           # Get all scholarships (with filters)
GET    /scholarships/:id       # Get scholarship by ID
POST   /scholarships           # Create scholarship (Admin only)
PUT    /scholarships/:id       # Update scholarship (Admin only)
DELETE /scholarships/:id       # Delete scholarship (Admin only)
```

#### Application Routes (`/api/applications`)
```
GET    /applications           # Get all applications
GET    /applications/:id       # Get application by ID
POST   /applications           # Submit new application
PUT    /applications/:id       # Update application
DELETE /applications/:id       # Delete application
PATCH  /applications/:id/status # Update application status (Admin)
POST   /applications/:id/review # Add review notes (Admin)
```

#### Document Routes (`/api/documents`)
```
POST   /documents/upload       # Upload document
GET    /documents/:id          # Get document metadata
GET    /documents/:id/download # Download document
DELETE /documents/:id          # Delete document
POST   /documents/:id/analyze  # Analyze document with Azure AI (Admin)
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### Success Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - Firebase Authentication (OAuth 2.0)
   - JWT token-based sessions
   - Role-based access control (RBAC)
   - Protected API routes

2. **Data Protection**
   - Password hashing with bcrypt (10 salt rounds)
   - Environment variables for secrets
   - Mongoose schema validation
   - Input sanitization with Joi

3. **Network Security**
   - HTTPS enforcement in production
   - CORS policy configuration
   - Helmet.js security headers
   - Rate limiting (100 requests per 15 minutes)

4. **File Security**
   - File type validation
   - File size limits (10MB default)
   - Virus scanning ready (integrate ClamAV)
   - Secure Azure Blob Storage

5. **Application Security**
   - XSS protection
   - SQL injection prevention (NoSQL)
   - CSRF protection
   - Content Security Policy (CSP)

### Security Headers (Helmet.js)
```
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Recommended Production Practices

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Enable Firebase App Check
- [ ] Implement API versioning
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Configure database backups
- [ ] Enable audit logging
- [ ] Implement WAF (Web Application Firewall)
- [ ] Regular dependency updates (`npm audit`)
- [ ] Penetration testing
- [ ] GDPR/compliance review

---

## 🧪 Testing

### Backend Testing

```powershell
cd backend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.test.ts
```

### Frontend Testing (Setup Required)

```powershell
cd frontend

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test
```

### API Testing with Postman

Import the Postman collection (create one in `tests/postman/`) to test all API endpoints.

---

## 🔍 Monitoring & Logging

### Backend Logging (Winston)

Logs are written to:
- **Console**: All environments
- **File**: `backend/logs/error.log` (errors only)
- **File**: `backend/logs/combined.log` (all logs)

Log Levels:
```
error: 0
warn: 1
info: 2
http: 3
debug: 4
```

### Application Monitoring

- **Prometheus**: Metrics collection (configured in `infrastructure/prometheus.yml`)
- **Grafana**: Visualization dashboard (setup required)
- **Azure Application Insights**: Cloud monitoring (optional)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Contribution Workflow

1. **Fork the Repository**
   ```powershell
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/Scholarship-Management-System.git
   ```

2. **Create Feature Branch**
   ```powershell
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit Changes**
   ```powershell
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to GitHub**
   ```powershell
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe your changes in detail

### Code Style Guidelines

- **TypeScript**: Use strict type checking
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Comments**: Write clear, concise comments for complex logic
- **Formatting**: Use Prettier (configure in `.prettierrc`)
- **Linting**: Fix ESLint warnings before committing

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added for new functionality
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No console.log() statements left in code
- [ ] Environment variables documented
- [ ] PR description explains the changes

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running or check MONGODB_URI in `.env`

#### 2. Firebase Authentication Error
```
Error: Firebase ID token has expired
```
**Solution**: Refresh the authentication token on frontend

#### 3. CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Check `CORS_ORIGIN` in backend `.env` matches frontend URL

#### 4. Azure Blob Storage Error
```
Error: Azure Storage connection string is invalid
```
**Solution**: Verify `AZURE_STORAGE_CONNECTION_STRING` in `.env`

#### 5. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using the port
```powershell
# Find process ID
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Debug Mode

Enable detailed logging:
```env
# backend/.env
NODE_ENV=development
LOG_LEVEL=debug
```

---

## 📊 Performance Optimization

### Frontend Optimizations

- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: WebP format, lazy loading
- **Bundle Size**: Analyzed with Vite build analyzer
- **Caching**: Service Worker for PWA (setup required)
- **CDN**: Static assets on CDN (production)

### Backend Optimizations

- **Compression**: Gzip middleware enabled
- **Database Indexing**: Mongoose indexes on frequently queried fields
- **Connection Pooling**: MongoDB connection pool (default 10)
- **Caching**: Redis cache layer (setup required)
- **Rate Limiting**: Prevents API abuse

---

## 📖 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Material-UI Components](https://mui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project Links
- **GitHub Repository**: [Gopi-techy/Scholarship-Management-System](https://github.com/Gopi-techy/Scholarship-Management-System)
- **Live Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]

---

## 👥 Authors & Contributors

- **Gopi** - *Initial Development* - [@Gopi-techy](https://github.com/Gopi-techy)

See the list of [contributors](https://github.com/Gopi-techy/Scholarship-Management-System/contributors) who participated in this project.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Firebase for authentication services
- Azure for cloud AI services
- MongoDB for database solutions
- Material-UI for React components
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions:

- **Issues**: [GitHub Issues](https://github.com/Gopi-techy/Scholarship-Management-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Gopi-techy/Scholarship-Management-System/discussions)
- **Email**: [Your Email]

---

<div align="center">
  
  **⭐ Star this repository if you find it helpful!**
  
  Made with ❤️ by [Gopi](https://github.com/Gopi-techy)
  
</div>
