import { useState } from 'react'
import { HotelWithDetails, RoomTypeWithDetails } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface HotelCardProps {
  hotel: HotelWithDetails
  checkInDate?: string
  checkOutDate?: string
  numGuests?: number
}

export function HotelCard({ hotel, checkInDate, checkOutDate, numGuests = 1 }: HotelCardProps) {
  const { user } = useAuth()
  const [isBooking, setIsBooking] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomTypeWithDetails | null>(null)

  // Get the primary image or first available image
  const primaryImage = hotel.images?.find(img => img.is_primary) || hotel.images?.[0]
  
  // Calculate average rating
  const averageRating = hotel.average_rating || 4.5
  const reviewCount = hotel.review_count || 0

  // Get the cheapest available room type
  const cheapestRoomType = hotel.room_types?.reduce((cheapest, current) => {
    if (!cheapest || current.current_price && cheapest.current_price && current.current_price < cheapest.current_price) {
      return current
    }
    return cheapest
  }, null as RoomTypeWithDetails | null)

  const handleBook = async (roomType: RoomTypeWithDetails) => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/signin'
      return
    }

    setIsBooking(true)
    try {
      // TODO: Implement hotel booking logic
      console.log('Booking hotel:', hotel.id, 'Room type:', roomType.id)
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

  return (
    <div className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Hotel Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        
        {/* Favorite button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Star rating badge */}
        {hotel.star_rating && (
          <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">{hotel.star_rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Hotel Name and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate flex-1 mr-2">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-sm">{averageRating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>
        </div>
        
        {/* Location */}
        <p className="text-xs text-gray-500 mb-2 truncate">
          {hotel.city?.name}, {hotel.country?.name}
        </p>

        {/* Dates */}
        {checkInDate && checkOutDate && (
          <p className="text-xs text-gray-500 mb-2">
            {formatDate(checkInDate)} - {formatDate(checkOutDate)}
          </p>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                {amenity.name}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            {cheapestRoomType ? (
              <>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(cheapestRoomType.current_price || cheapestRoomType.base_price_per_night)}
                </span>
                <span className="text-xs text-gray-500"> / night</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No rooms available</span>
            )}
          </div>
          
          {cheapestRoomType && cheapestRoomType.available_rooms && cheapestRoomType.available_rooms > 0 ? (
            <button
              onClick={() => handleBook(cheapestRoomType)}
              disabled={isBooking}
              className="bg-[var(--color-brand)] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isBooking ? 'Booking...' : 'Book Now'}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-3 py-2 rounded text-sm font-medium cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>

        {/* Available rooms info */}
        {cheapestRoomType && cheapestRoomType.available_rooms && cheapestRoomType.available_rooms > 0 && (
          <p className="text-xs text-green-600 mt-2">
            {cheapestRoomType.available_rooms} room{cheapestRoomType.available_rooms !== 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </div>
  )
}
