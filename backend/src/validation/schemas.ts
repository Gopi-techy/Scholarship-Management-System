import { body } from 'express-validator';

export const userValidation = {
  register: [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter'),
    body('role').isIn(['student', 'admin']).withMessage('Invalid role'),
  ],
  login: [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

export const applicationValidation = {
  create: [
    body('personalDetails.name').notEmpty().withMessage('Name is required'),
    body('personalDetails.dateOfBirth').isDate().withMessage('Invalid date of birth'),
    body('personalDetails.gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('personalDetails.contact').isMobilePhone('any').withMessage('Invalid contact number'),
    body('personalDetails.address').notEmpty().withMessage('Address is required'),
    
    body('academicDetails.institution').notEmpty().withMessage('Institution name is required'),
    body('academicDetails.course').notEmpty().withMessage('Course name is required'),
    body('academicDetails.admissionYear').isInt({ min: 2000 }).withMessage('Invalid admission year'),
    body('academicDetails.percentage').isFloat({ min: 0, max: 100 }).withMessage('Invalid percentage'),
  ],
  update: [
    body('status').isIn(['draft', 'submitted', 'under_review', 'approved', 'rejected'])
      .withMessage('Invalid application status'),
    body('remarks').optional().isString().withMessage('Invalid remarks'),
  ],
};

export const documentValidation = {
  upload: [
    body('documentType').isIn(['identity', 'academic', 'income', 'other'])
      .withMessage('Invalid document type'),
    body('description').optional().isString().withMessage('Invalid description'),
  ],
  update: [
    body('status').isIn(['pending', 'verified', 'rejected'])
      .withMessage('Invalid document status'),
    body('remarks').optional().isString().withMessage('Invalid remarks'),
  ],
}; 