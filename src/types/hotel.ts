// Hotel Booking App Types - Updated for new schema

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'HOTEL_MANAGER'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Country {
  id: string
  name: string
  code: string
  created_at: string
}

export interface City {
  id: string
  name: string
  country_id: string
  latitude?: number
  longitude?: number
  created_at: string
}

export interface Hotel {
  id: string
  name: string
  description?: string
  address: string
  city_id: string
  latitude?: number
  longitude?: number
  star_rating?: number
  phone?: string
  email?: string
  website?: string
  check_in_time: string
  check_out_time: string
  is_active: boolean
  manager_id?: string
  created_at: string
  updated_at: string
}

export interface HotelImage {
  id: string
  hotel_id: string
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  icon?: string
  category?: string
  created_at: string
}

export interface RoomType {
  id: string
  hotel_id: string
  name: string
  description?: string
  max_occupancy: number
  bed_type?: string
  size_sqm?: number
  base_price_per_night: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RoomTypeImage {
  id: string
  room_type_id: string
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Room {
  id: string
  hotel_id: string
  room_type_id: string
  room_number: string
  floor?: number
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  hotel_id: string
  room_type_id: string
  user_id: string
  check_in_date: string
  check_out_date: string
  num_guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
  special_requests?: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  created_at: string
  updated_at: string
}

export interface BookingRoom {
  id: string
  booking_id: string
  room_id: string
  assigned_at: string
}

export interface Review {
  id: string
  hotel_id: string
  user_id: string
  booking_id: string
  rating: number
  title?: string
  comment?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface PricingRule {
  id: string
  hotel_id: string
  room_type_id: string
  name: string
  start_date: string
  end_date: string
  price_multiplier: number
  is_active: boolean
  created_at: string
}

// Extended types for UI components

export interface CityWithCountry extends City {
  country?: Country
}
export interface HotelWithDetails extends Hotel {
  city?: CityWithCountry
  country?: Country
  images?: HotelImage[]
  amenities?: Amenity[]
  room_types?: RoomTypeWithDetails[]
  average_rating?: number
  review_count?: number
}

export interface RoomTypeWithDetails extends RoomType {
  hotel?: Hotel
  images?: RoomTypeImage[]
  amenities?: Amenity[]
  available_rooms?: number
  current_price?: number
}

export interface BookingWithDetails extends Booking {
  hotel?: HotelWithDetails
  room_type?: RoomTypeWithDetails
  rooms?: Room[]
  review?: Review
}

// Search and filter types
export interface HotelSearchFilters {
  city_id?: string
  country_id?: string
  check_in_date?: string
  check_out_date?: string
  num_guests?: number
  min_price?: number
  max_price?: number
  star_rating?: number
  amenities?: string[]
  latitude?: number
  longitude?: number
  radius_km?: number
}

export interface HotelSearchResult {
  hotel: HotelWithDetails
  available_room_types: RoomTypeWithDetails[]
  distance_km?: number
}

// Status types
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
export type UserRole = 'USER' | 'ADMIN' | 'HOTEL_MANAGER'
export type AmenityCategory = 'general' | 'room' | 'dining' | 'recreation'
