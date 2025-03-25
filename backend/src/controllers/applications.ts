import { Response, NextFunction } from 'express';
import { db, FieldValue } from '../config/firebase';
import { AppError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

interface Application {
  id: string;
  userId: string;
  status: string;
  [key: string]: any;
}

// Get all applications
export const getApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const applicationsRef = db.collection('applications');
    const snapshot = await applicationsRef.get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Application[];

    res.status(200).json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// Get application by ID
export const getApplicationById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const userRole = req.user?.role;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const applicationRef = db.collection('applications').doc(id);
    const doc = await applicationRef.get();

    if (!doc.exists) {
      throw new AppError('Application not found', 404);
    }

    const application = {
      id: doc.id,
      ...doc.data()
    } as Application;

    // Check if user has access to this application
    if (userRole !== 'admin' && application.userId !== userId) {
      throw new AppError('Not authorized to access this application', 403);
    }

    res.status(200).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// Create new application
export const createApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const applicationData = {
      ...req.body,
      userId,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('applications').add(applicationData);
    const doc = await docRef.get();

    res.status(201).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      throw new AppError('Not authorized to update application status', 403);
    }

    const applicationRef = db.collection('applications').doc(id);
    await applicationRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    });

    const doc = await applicationRef.get();

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Submit application for review
export const submitApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const applicationRef = db.collection('applications').doc(id);
    const doc = await applicationRef.get();

    if (!doc.exists) {
      throw new AppError('Application not found', 404);
    }

    const application = doc.data() as Application;
    if (application.userId !== userId) {
      throw new AppError('Not authorized to submit this application', 403);
    }

    await applicationRef.update({
      status: 'submitted',
      submittedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    const updatedDoc = await applicationRef.get();

    res.status(200).json({
      status: 'success',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Review application
export const reviewApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      throw new AppError('Not authorized to review applications', 403);
    }

    const applicationRef = db.collection('applications').doc(id);
    await applicationRef.update({
      status,
      reviewedBy: req.user?.uid,
      reviewedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      reviewNotes: FieldValue.arrayUnion({
        note: reviewNote,
        addedBy: req.user?.uid,
        addedAt: FieldValue.serverTimestamp()
      })
    });

    const doc = await applicationRef.get();

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to application
export const addComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const applicationRef = db.collection('applications').doc(id);
    await applicationRef.update({
      comments: FieldValue.arrayUnion({
        text: comment,
        addedBy: userId,
        addedAt: FieldValue.serverTimestamp()
      }),
      updatedAt: FieldValue.serverTimestamp()
    });

    const doc = await applicationRef.get();

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    next(error);
  }
}; 