import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    }),
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
  role: Joi.string()
    .valid('student', 'admin')
    .default('student')
    .messages({
      'any.only': 'Role must be either student or admin'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .messages({
      'string.empty': 'Name cannot be empty'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email cannot be empty'
    }),
  fcmToken: Joi.string()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}); 