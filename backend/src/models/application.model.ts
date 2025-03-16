import { Schema, model, Document, Types } from 'mongoose';

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
  _id: Types.ObjectId;
  type: string;
  name: string;
  url: string;
  uploadedAt: Date;
  verified: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface IApplication extends Document {
  student: Types.ObjectId;
  personalInfo: IPersonalInfo;
  academicInfo: IAcademicInfo;
  familyInfo: IFamilyInfo;
  documents: IDocument[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
      aadharNumber: { type: String, required: true },
      category: {
        type: String,
        enum: ['general', 'obc', 'sc', 'st'],
        required: true,
      },
      religion: { type: String, required: true },
      nationality: { type: String, required: true },
    },
    academicInfo: {
      currentCourse: { type: String, required: true },
      currentYear: { type: Number, required: true },
      currentSemester: { type: Number, required: true },
      currentInstitution: { type: String, required: true },
      previousInstitution: String,
      previousCourse: String,
      previousYear: Number,
      previousPercentage: Number,
      entranceExam: {
        name: String,
        score: Number,
        rank: Number,
      },
    },
    familyInfo: {
      fatherName: { type: String, required: true },
      fatherOccupation: { type: String, required: true },
      fatherIncome: { type: Number, required: true },
      motherName: { type: String, required: true },
      motherOccupation: { type: String, required: true },
      motherIncome: { type: Number, required: true },
      siblings: { type: Number, required: true },
      familyIncome: { type: Number, required: true },
      familyType: { type: String, enum: ['nuclear', 'joint'], required: true },
    },
    documents: [
      {
        type: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
        verificationStatus: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        rejectionReason: String,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
      default: 'draft',
    },
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ student: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ 'documents.verified': 1 });

export const Application = model<IApplication>('Application', applicationSchema); 