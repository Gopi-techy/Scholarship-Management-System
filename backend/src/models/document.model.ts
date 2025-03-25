import mongoose, { Schema } from 'mongoose';

export interface IDocument {
  userId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  analysis?: {
    text?: string;
    keyPhrases?: string[];
    language?: string;
    pages?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: Date },
  analysis: {
    text: String,
    keyPhrases: [String],
    language: String,
    pages: Number
  }
}, {
  timestamps: true
});

// Add index for faster queries
documentSchema.index({ userId: 1, status: 1 });

export const Document = mongoose.model<IDocument>('Document', documentSchema); 