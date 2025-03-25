import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  aadharNumber: string;
  category: 'general' | 'obc' | 'sc' | 'st';
  religion: string;
  nationality: string;
}

export interface IAcademicInfo {
  currentCourse: string;
  currentYear: number;
  currentSemester: number;
  currentInstitution: string;
  previousInstitution?: string;
  previousCourse?: string;
  previousYear?: number;
  previousPercentage?: number;
  entranceExam?: {
    name: string;
    score: number;
    rank?: number;
  };
}

export interface IFamilyInfo {
  fatherName: string;
  fatherOccupation: string;
  fatherIncome: number;
  motherName: string;
  motherOccupation: string;
  motherIncome: number;
  siblings: number;
  familyIncome: number;
  familyType: 'nuclear' | 'joint';
}

export interface IDocument {
  _id: mongoose.Types.ObjectId;
  type: string;
  name: string;
  url: string;
  uploadedAt: Date;
  verified: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  scholarshipType: string;
  academicYear: string;
  semester: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submissionDate: Date;
  financialInfo: {
    familyIncome: number;
    otherScholarships?: string[];
    employmentStatus?: 'employed' | 'unemployed' | 'part_time';
  };
  documents: {
    type: string;
    blobUrl: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    aiVerificationResult?: {
      confidence: number;
      extractedData: any;
      verificationDate: Date;
    };
    adminVerification?: {
      verifiedBy: string;
      verificationDate: Date;
      comments?: string;
    };
  }[];
  academicInfo: {
    currentGPA: number;
    creditHours: number;
    academicAchievements?: string[];
  };
  reviewNotes?: {
    adminId: mongoose.Types.ObjectId;
    note: string;
    timestamp: Date;
  }[];
  decision?: {
    status: 'approved' | 'rejected';
    decidedBy: mongoose.Types.ObjectId;
    decisionDate: Date;
    comments?: string;
    awardAmount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scholarshipType: { type: String, required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft'
  },
  submissionDate: { type: Date },
  financialInfo: {
    familyIncome: { type: Number, required: true },
    otherScholarships: [String],
    employmentStatus: {
      type: String,
      enum: ['employed', 'unemployed', 'part_time']
    }
  },
  documents: [{
    type: { type: String, required: true },
    blobUrl: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    aiVerificationResult: {
      confidence: Number,
      extractedData: Schema.Types.Mixed,
      verificationDate: Date
    },
    adminVerification: {
      verifiedBy: { type: String },
      verificationDate: Date,
      comments: String
    }
  }],
  academicInfo: {
    currentGPA: { type: Number, required: true },
    creditHours: { type: Number, required: true },
    academicAchievements: [String]
  },
  reviewNotes: [{
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  decision: {
    status: {
      type: String,
      enum: ['approved', 'rejected']
    },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    decisionDate: Date,
    comments: String,
    awardAmount: Number
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
applicationSchema.index({ student: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ 'decision.status': 1 });
applicationSchema.index({ submissionDate: 1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema); 