import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  student: Schema.Types.ObjectId;
  personalDetails: {
    name: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    contact: string;
    address: string;
  };
  academicDetails: {
    institution: string;
    course: string;
    admissionYear: number;
    percentage: number;
    documents: Array<{
      type: string;
      url: string;
      status: 'pending' | 'verified' | 'rejected';
    }>;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  remarks?: string;
  timeline: Array<{
    status: string;
    remarks?: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalDetails: {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  academicDetails: {
    institution: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    admissionYear: {
      type: Number,
      required: true,
      min: 2000,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    documents: [{
      type: {
        type: String,
        enum: ['identity', 'academic', 'income', 'other'],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
    }],
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft',
  },
  remarks: String,
  timeline: [{
    status: {
      type: String,
      required: true,
    },
    remarks: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Add middleware to update timeline on status change
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      remarks: this.remarks,
      timestamp: new Date(),
    });
  }
  next();
});

export const Application = mongoose.model<IApplication>('Application', applicationSchema); 