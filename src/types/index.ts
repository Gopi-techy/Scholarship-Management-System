export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  academicInfo?: {
    institution: string;
    major?: string;
    gpa?: number;
    yearOfStudy?: number;
    expectedGraduation?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  type: string;
  blobUrl: string;
  uploadDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDetails?: {
    verifiedBy?: string;
    verificationDate?: string;
    comments?: string;
  };
  aiVerificationResult?: {
    confidence: number;
    extractedData: any;
    verificationDate: string;
  };
}

export interface Application {
  id: string;
  student: User;
  scholarshipType: string;
  academicYear: string;
  semester: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submissionDate?: string;
  financialInfo: {
    familyIncome: number;
    otherScholarships?: string[];
    employmentStatus?: 'employed' | 'unemployed' | 'part_time';
  };
  documents: Document[];
  academicInfo: {
    currentGPA: number;
    creditHours: number;
    academicAchievements?: string[];
  };
  reviewNotes?: {
    adminId: string;
    note: string;
    timestamp: string;
  }[];
  decision?: {
    status: 'approved' | 'rejected';
    decidedBy: string;
    decisionDate: string;
    comments?: string;
    awardAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
} 