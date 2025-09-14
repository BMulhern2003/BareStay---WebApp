import { z } from 'zod'

// Common validation schemas
export const uuidSchema = z.string().uuid('Invalid UUID format')
export const emailSchema = z.string().email('Invalid email format')
export const dateStringSchema = z.string().datetime('Invalid date format')

// Hotel search query parameters
export const hotelSearchSchema = z.object({
  city_id: z.string().min(1, 'City name is required').optional(),
  country_id: z.string().uuid('Invalid country ID').optional(),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-in date format (YYYY-MM-DD)').optional(),
  check_out_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid check-out date format (YYYY-MM-DD)').optional(),
  num_guests: z.string().regex(/^\d+$/, 'Number of guests must be a positive integer').optional()
})

// Booking creation schema
export const createBookingSchema = z.object({
  hotel_id: uuidSchema,
  check_in_date: dateStringSchema,
  check_out_date: dateStringSchema,
  adults: z.number().int().min(1, 'At least 1 adult is required').max(10, 'Maximum 10 adults allowed'),
  children: z.number().int().min(0, 'Children cannot be negative').max(10, 'Maximum 10 children allowed'),
  room_type_id: uuidSchema.optional(),
  special_requests: z.string().max(500, 'Special requests cannot exceed 500 characters').optional()
}).refine(
  (data) => new Date(data.check_out_date) > new Date(data.check_in_date),
  {
    message: 'Check-out date must be after check-in date',
    path: ['check_out_date']
  }
)

// Booking request schema
export const createBookingRequestSchema = z.object({
  booking_id: uuidSchema,
  seats: z.number().int().min(1, 'At least 1 seat is required').max(20, 'Maximum 20 seats allowed')
})

// User profile schema
export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
  date_of_birth: z.string().datetime('Invalid date of birth').optional()
})

// Admin operations schema
export const adminUpdateBookingSchema = z.object({
  status: z.enum(['available', 'booked', 'cancelled'], 'Invalid booking status'),
  available_seats: z.number().int().min(0, 'Available seats cannot be negative').optional()
})

// Error response helper
export const createValidationErrorResponse = (errors: z.ZodIssue[]) => {
  return {
    error: 'Validation failed',
    details: errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }))
  }
} 