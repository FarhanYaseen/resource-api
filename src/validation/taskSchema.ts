import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(1).max(500),
  completed: Joi.boolean().default(false)
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().min(1).max(500),
  completed: Joi.boolean()
}).min(1);