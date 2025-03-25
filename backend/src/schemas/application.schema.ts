import Joi from 'joi';

export const applicationSchema = Joi.object({
  scholarshipId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Scholarship ID cannot be empty',
      'any.required': 'Scholarship ID is required'
    }),
  documents: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .required()
          .messages({
            'string.empty': 'Document type cannot be empty',
            'any.required': 'Document type is required'
          }),
        blobUrl: Joi.string()
          .required()
          .messages({
            'string.empty': 'Document URL cannot be empty',
            'any.required': 'Document URL is required'
          })
      })
    )
    .min(1)
    .messages({
      'array.min': 'At least one document is required',
      'array.base': 'Documents must be an array'
    })
}); 