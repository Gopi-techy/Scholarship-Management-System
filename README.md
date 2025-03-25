# PMSSS Scholarship Management System - Frontend

This is the frontend application for the PMSSS Scholarship Management System, built with React, TypeScript, Material-UI, and Firebase.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Scholarship-Management-System.git
   cd Scholarship-Management-System/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities and configurations
│   ├── pages/         # Page components
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## Features

- User authentication (student and admin roles)
- Student dashboard
- Application form
- Document upload and verification
- Admin dashboard for application review
- Material-UI components for a modern UI
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
