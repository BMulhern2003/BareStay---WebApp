export interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
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

export interface BookingRequest {
  booking_id: string
  user_id: string
  seats: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type BookingStatus = 'available' | 'booked' | 'cancelled'
export type RequestStatus = 'pending' | 'confirmed' | 'cancelled'
export type UserRole = 'USER' | 'ADMIN' 