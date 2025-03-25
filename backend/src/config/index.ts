import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/scholarship-system',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  azure: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  },
  azureAI: {
    endpoint: process.env.AZURE_AI_ENDPOINT,
    key: process.env.AZURE_AI_KEY,
  },
}; 