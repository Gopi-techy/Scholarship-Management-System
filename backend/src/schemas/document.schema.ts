import Joi from 'joi';

export const uploadDocumentSchema = Joi.object({
  type: Joi.string().required().messages({
    'any.required': 'Document type is required'
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Description must be a string'
  })
}); 