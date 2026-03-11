import { z } from 'zod'

export const bookSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  author: z.string().min(2, 'Author name is required').max(100),
  description: z.string().max(2000).optional(),
  isbn: z.string().optional(),
  category_id: z.string().min(1, 'Select a category'),
  language: z.string().default('English'),
  original_price: z.coerce.number().positive().optional(),
  asking_price: z.coerce.number().positive('Enter an asking price'),
  condition: z.enum(['like_new', 'good', 'fair', 'acceptable'], {
    required_error: 'Select a condition',
  }),
  edition: z.string().optional(),
  publisher: z.string().optional(),
  year_published: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  pages: z.coerce.number().int().positive().optional(),
  city: z.string().min(2, 'Enter your city').max(100),
  state: z.string().min(2, 'Select your state'),
  delivery_type: z.enum(['pickup', 'shipping', 'both']).default('both'),
})

export type BookFormData = z.infer<typeof bookSchema>