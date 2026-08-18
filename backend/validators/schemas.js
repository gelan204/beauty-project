import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('').optional(),
  role: Joi.string().valid('customer', 'owner').default('customer'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().allow(''),
  profileImage: Joi.string().allow(''),
});

export const createAppointmentSchema = Joi.object({
  salonId: Joi.string().required(),
  serviceId: Joi.string().required(),
  staffId: Joi.string().required(),
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  notes: Joi.string().allow('').optional(),
});

export const rescheduleSchema = Joi.object({
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'no-show')
    .required(),
});

export const salonSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  location: Joi.object({
    address: Joi.string().allow(''),
    city: Joi.string().allow(''),
    area: Joi.string().allow(''),
  }),
  phone: Joi.string().allow(''),
  email: Joi.string().email().allow(''),
  categories: Joi.array().items(Joi.string()),
  instagram: Joi.string().allow(''),
  openingHours: Joi.object(),
});

export const serviceSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  duration: Joi.number().min(15).required(),
  category: Joi.string().allow(''),
  featured: Joi.boolean(),
  status: Joi.string().valid('active', 'inactive'),
});

export const staffSchema = Joi.object({
  name: Joi.string().min(2).required(),
  specialization: Joi.string().allow(''),
  services: Joi.array().items(Joi.string()),
  status: Joi.string().valid('active', 'away', 'inactive'),
  availability: Joi.object(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
});
