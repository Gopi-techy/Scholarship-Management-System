import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('student', 'admin').default('student'),
  fcmToken: Joi.string()
}); 