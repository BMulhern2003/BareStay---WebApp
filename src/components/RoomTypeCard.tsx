import { useState } from 'react'
import { RoomTypeWithDetails } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface RoomTypeCardProps {
  roomType: RoomTypeWithDetails
  hotel: any
  checkInDate?: string
  checkOutDate?: string
  numGuests?: number
}

export function RoomTypeCard({ roomType, hotel, checkInDate, checkOutDate, numGuests = 1 }: RoomTypeCardProps) {
  const { user } = useAuth()
  const [isBooking, setIsBooking] = useState(false)

  // Get the primary image or first available image
  const primaryImage = roomType.images?.find(img => img.is_primary) || roomType.images?.[0]

  const handleBook = async () => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/signin'
      return
    }

    setIsBooking(true)
    try {
      // TODO: Implement room type booking logic
      console.log('Booking room type:', roomType.id, 'for hotel:', hotel.id)
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsBooking(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isAvailable = roomType.available_rooms && roomType.available_rooms > 0
  const currentPrice = roomType.current_price || roomType.base_price_per_night

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Room Image */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || roomType.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🛏️</span>
          </div>
        )}
        
        {/* Room size badge */}
        {roomType.size_sqm && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full">
            <span className="text-xs font-medium">{roomType.size_sqm}m²</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Room Type Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {roomType.name}
        </h3>

        {/* Description */}
        {roomType.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {roomType.description}
          </p>
        )}

        {/* Room Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Up to {roomType.max_occupancy} guest{roomType.max_occupancy !== 1 ? 's' : ''}
          </div>
          
          {roomType.bed_type && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {roomType.bed_type} bed
            </div>
          )}
        </div>

        {/* Amenities */}
        {roomType.amenities && roomType.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {roomType.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
              >
                {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                {amenity.name}
              </span>
            ))}
            {roomType.amenities.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                +{roomType.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Dates */}
        {checkInDate && checkOutDate && (
          <div className="text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(checkInDate)} - {formatDate(checkOutDate)}
            </div>
          </div>
        )}
        
        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            <span className="text-sm text-gray-500"> / night</span>
            {roomType.current_price && roomType.current_price !== roomType.base_price_per_night && (
              <div className="text-xs text-gray-500 line-through">
                {formatPrice(roomType.base_price_per_night)}
              </div>
            )}
          </div>
          
          {isAvailable ? (
            <button
              onClick={handleBook}
              disabled={isBooking}
              className="bg-[var(--color-brand)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isBooking ? 'Booking...' : 'Select Room'}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Not Available
            </button>
          )}
        </div>

        {/* Availability info */}
        {isAvailable && (
          <p className="text-xs text-green-600 mt-2">
            {roomType.available_rooms} room{roomType.available_rooms !== 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </div>
  )
}
