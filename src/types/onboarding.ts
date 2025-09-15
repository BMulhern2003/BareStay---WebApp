// Types for hotel provider onboarding flow

export interface HotelBasicInfo {
  name: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  email: string
  description: string
}

export interface RoomSetup {
  numberOfRoomTypes: number
  totalNumberOfRooms: number
  amenities: string[]
}

export interface RoomTypeDetail {
  id: string
  name: string
  numberOfRooms: number
  pricePerNight: number
  maxOccupancy: number
  images: File[]
  imagePreviewUrls: string[]
  amenities: string[]
}

export interface OnboardingFormData {
  basicInfo: HotelBasicInfo
  roomSetup: RoomSetup
  roomTypes: RoomTypeDetail[]
}

export interface OnboardingStep {
  id: number
  title: string
  description: string
  isComplete: boolean
}

// Available amenities
export const HOTEL_AMENITIES = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Room Service',
  'Concierge',
  'Business Center',
  'Meeting Rooms',
  'Pet Friendly',
  'Airport Shuttle',
  'Laundry Service',
] as const

export const ROOM_AMENITIES = [
  'Air Conditioning',
  'TV',
  'Balcony',
  'Mini Bar',
  'Coffee Maker',
  'Hair Dryer',
  'Safe',
  'Iron',
  'Bathrobe',
  'Slippers',
  'Room Service',
  'Ocean View',
  'City View',
  'Garden View',
] as const

export type HotelAmenity = typeof HOTEL_AMENITIES[number]
export type RoomAmenity = typeof ROOM_AMENITIES[number]
