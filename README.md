# Scholarship Management System

A comprehensive system for managing scholarship applications, built with React, Node.js, Azure and Firebase.

## Project Structure

```
scholarship-management-system/
├── .github/                    # GitHub Actions workflows
├── frontend/                   # Frontend React application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/       # Shared components
│   │   │   ├── forms/        # Form components
│   │   │   └── layout/       # Layout components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── student/     # Student pages
│   │   ├── services/         # API services
│   │   ├── styles/           # Global styles
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── .env.example          # Environment variables example
│   ├── package.json          # Dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                   # Backend Node.js application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── tests/               # Test files
│   ├── .env.example         # Environment variables example
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── infrastructure/           # Infrastructure as code
│   ├── firebase/           # Firebase configuration
│   └── terraform/          # Terraform configuration
│
├── .env.example             # Root environment variables
├── docker-compose.yml       # Docker compose configuration
└── README.md               # Project documentation
```

## Features

- User Authentication (Student/Admin)
- Document Upload and Management
- Scholarship Application Submission
- Application Review Process
- Real-time Updates
- Role-based Access Control

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Azure subscription
- Firebase account
- Docker (optional)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/scholarship-management-system.git
   cd scholarship-management-system
   ```

2. Frontend setup:

   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

3. Backend setup:

   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

4. Configure environment variables:
   - Update `.env` files in both frontend and backend directories
   - Add your Firebase configuration
   - Set up other required environment variables

## Development

- Frontend development server: `npm run dev`
- Backend development server: `npm run dev`
- Run tests: `npm test`
- Build: `npm run build`

## Docker Deployment

1. Build and run with Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
