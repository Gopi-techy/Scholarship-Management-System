export interface User {
  _id: string;
  email: string;
  role: 'student' | 'admin';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalDetails {
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  contact: string;
  address: string;
}

export interface Document {
  _id: string;
  type: 'identity' | 'academic' | 'income' | 'other';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface AcademicDetails {
  institution: string;
  course: string;
  admissionYear: number;
  percentage: number;
  documents: Document[];
}

export interface TimelineEntry {
  status: string;
  remarks?: string;
  timestamp: Date;
}

export interface Application {
  _id: string;
  student: string | User;
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  remarks?: string;
  timeline: TimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'student' | 'admin';
}

export interface ApplicationFormData {
  personalDetails: PersonalDetails;
  academicDetails: Omit<AcademicDetails, 'documents'>;
}

export interface DocumentUpload {
  type: 'identity' | 'academic' | 'income' | 'other';
  file: File;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
} 