// Export API client from utils
export { default as api } from '../utils/api';

// Export services
export { default as authService } from './auth.service';
export { default as scholarshipService } from './scholarship.service';
export { default as applicationService } from './application.service';
export { default as documentService } from './document.service';
export { default as userService } from './user.service';

// Export named exports from services
export * from './auth.service';
export * from './scholarship.service';
export * from './application.service';
export * from './document.service';
export * from './user.service'; 