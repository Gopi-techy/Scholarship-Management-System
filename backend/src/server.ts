import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

// Check required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const optionalEnvVars = [
  'AZURE_FORM_RECOGNIZER_ENDPOINT',
  'AZURE_FORM_RECOGNIZER_KEY'
];

const missingRequiredVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
const missingOptionalVars = optionalEnvVars.filter(envVar => !process.env[envVar]);

if (missingRequiredVars.length > 0) {
  console.warn('⚠️ Missing required environment variables:', missingRequiredVars);
  console.warn('Some features may not work correctly.');
}

if (missingOptionalVars.length > 0) {
  console.warn('ℹ️ Missing optional environment variables:', missingOptionalVars);
  console.warn('Some optional features will be disabled.');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // Log service status
  console.log('\nService Status:');
  console.log('-------------');
  console.log('MongoDB:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured');
  console.log('Firebase:', process.env.FIREBASE_PROJECT_ID ? '✅ Configured' : '❌ Not configured');
  console.log('Azure Form Recognizer:', 
    process.env.AZURE_FORM_RECOGNIZER_ENDPOINT && process.env.AZURE_FORM_RECOGNIZER_KEY 
      ? '✅ Configured' 
      : '⚠️ Optional - Not configured'
  );
}); 