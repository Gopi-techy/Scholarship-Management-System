# PMSSS Scholarship Management System

A comprehensive web-based platform for managing scholarship applications, document verification, and administrative tasks.

## Features

### 🔐 Authentication & Security

- Firebase Authentication with RBAC
- Multi-Factor Authentication for admins
- Firebase Cloud Messaging for alerts
- MongoDB Encryption for sensitive data

### 📄 Document Management

- Secure file uploads with Azure Blob Storage
- SAS URL implementation
- Document verification using Azure AI
- Fraud detection capabilities

### 👨‍🎓 Student Portal

- Registration and profile management
- Scholarship application submission
- Real-time status tracking
- Notification system

### 👨‍💼 Admin Portal

- Application review dashboard
- Role management
- Document verification tools
- Secure document access

## Tech Stack

### Backend

- Node.js + Express.js
- MongoDB Atlas
- Firebase Admin SDK
- Azure Blob Storage
- Azure AI Document Intelligence

### Frontend

- React.js with TypeScript
- Tailwind CSS + ShadCN/UI
- React Router
- React Dropzone
- Framer Motion
- Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- Azure account with required services

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/pmsss-scholarship-system.git
   cd pmsss-scholarship-system
   \`\`\`

2. Install backend dependencies:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. Install frontend dependencies:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

4. Set up environment variables:

   - Copy \`.env.example\` to \`.env\` in both frontend and backend directories
   - Fill in your configuration values

5. Start the development servers:

Backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## Project Structure

\`\`\`
/pmsss-scholarship-system
├── /backend
│ ├── /controllers # Request handlers
│ ├── /models # Database models
│ ├── /routes # API routes
│ ├── /middlewares # Custom middleware
│ ├── /services # External service integrations
│ ├── /config # Configuration files
│ └── /utils # Utility functions
├── /frontend
│ ├── /src
│ │ ├── /components # Reusable components
│ │ ├── /pages # Page components
│ │ ├── /services # API services
│ │ ├── /lib # Core functionality
│ │ ├── /utils # Utility functions
│ │ └── /types # TypeScript types
│ └── /public # Static assets
└── /infrastructure # IaC with Terraform
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
