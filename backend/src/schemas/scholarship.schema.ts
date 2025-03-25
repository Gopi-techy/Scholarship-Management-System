import Joi from 'joi';

export const scholarshipSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .required()
    .messages({
      'string.empty': 'Description cannot be empty',
      'any.required': 'Description is required'
    }),
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required'
    }),
  deadline: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Deadline must be a valid date',
      'date.greater': 'Deadline must be in the future',
      'any.required': 'Deadline is required'
    }),
  requirements: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.base': 'Requirements must be an array',
      'array.min': 'At least one requirement is required',
      'any.required': 'Requirements are required'
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'expired')
    .default('active')
    .messages({
      'any.only': 'Status must be either active, inactive, or expired'
    }),
  maxApplicants: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'Maximum applicants must be a number',
      'number.integer': 'Maximum applicants must be an integer',
      'number.positive': 'Maximum applicants must be positive'
    })
}); 