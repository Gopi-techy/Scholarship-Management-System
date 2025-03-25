import { format } from 'date-fns';
import { Application, TimelineEntry } from '../types';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return '#FFA000'; // Amber
    case 'submitted':
      return '#1976D2'; // Blue
    case 'under_review':
      return '#7B1FA2'; // Purple
    case 'approved':
      return '#388E3C'; // Green
    case 'rejected':
      return '#D32F2F'; // Red
    default:
      return '#757575'; // Grey
  }
};

export const getStatusLabel = (status: string): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const sortTimelineEntries = (timeline: TimelineEntry[]): TimelineEntry[] => {
  return [...timeline].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const calculateCompletionPercentage = (application: Application): number => {
  const requiredFields = [
    application.personalDetails?.name,
    application.personalDetails?.dateOfBirth,
    application.personalDetails?.gender,
    application.personalDetails?.contact,
    application.personalDetails?.address,
    application.academicDetails?.institution,
    application.academicDetails?.course,
    application.academicDetails?.admissionYear,
    application.academicDetails?.percentage,
  ];

  const completedFields = requiredFields.filter(field => field !== undefined && field !== '');
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 