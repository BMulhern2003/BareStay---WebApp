// Re-export all hotel types for backward compatibility
export * from './hotel'

// Legacy types for backward compatibility (deprecated)
export interface LegacyBooking {
  id: string
  title: string
  description?: string
  date: string
  time: string
  location: string
  price: number
  max_seats: number
  available_seats: number
  status: 'available' | 'booked' | 'cancelled'
  created_at: string
  updated_at: string
  user_id?: string
}

export interface LegacyBookingRequest {
  booking_id: string
  user_id: string
  seats: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

// Type aliases for backward compatibility
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
export type RequestStatus = 'pending' | 'confirmed' | 'cancelled'
export type UserRole = 'USER' | 'ADMIN' | 'HOTEL_MANAGER'
