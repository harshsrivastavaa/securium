const { z } = require('zod');

const cleanString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
};

const priceSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  },
  z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number'
    })
    .positive('Price must be greater than 0')
    .max(999999, 'Price is too high')
);

const courseCreateSchema = z
  .object({
    name: z.preprocess(
      cleanString,
      z
        .string({
          required_error: 'Course name is required',
          invalid_type_error: 'Course name must be text'
        })
        .min(2, 'Course name must be at least 2 characters')
        .max(120, 'Course name cannot be more than 120 characters')
    ),
    description: z.preprocess(
      cleanString,
      z
        .string({
          required_error: 'Description is required',
          invalid_type_error: 'Description must be text'
        })
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot be more than 1000 characters')
    ),
    price: priceSchema,
    duration: z.preprocess(
      cleanString,
      z
        .string({
          required_error: 'Duration is required',
          invalid_type_error: 'Duration must be text'
        })
        .min(1, 'Duration is required')
        .max(80, 'Duration cannot be more than 80 characters')
    )
  })
  .strict();

const courseUpdateSchema = courseCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field is required',
    path: ['body']
  }
);

const parseCourseId = z.preprocess(
  (value) => Number(value),
  z
    .number({ invalid_type_error: 'Course id must be a number' })
    .int('Course id must be an integer')
    .positive('Course id must be greater than 0')
);

module.exports = {
  courseCreateSchema,
  courseUpdateSchema,
  parseCourseId
};
