import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new ApiError(400, message));
  }

  req[property] = value;
  next();
};
