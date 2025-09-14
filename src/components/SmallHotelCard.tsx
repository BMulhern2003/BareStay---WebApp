import { useState } from 'react'
import { HotelWithDetails, RoomTypeWithDetails } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface SmallHotelCardProps {
  hotel: HotelWithDetails
  checkInDate?: string
  checkOutDate?: string
  numGuests?: number
}

export function SmallHotelCard({ hotel, checkInDate, checkOutDate, numGuests = 1 }: SmallHotelCardProps) {
  const { user } = useAuth()
  const [isBooking, setIsBooking] = useState(false)

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

  return (
    <div className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200">
      {/* Hotel Image - Smaller */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">��</span>
          </div>
        )}
        
        {/* Favorite button */}
        <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Star rating badge */}
        {hotel.star_rating && (
          <div className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-0.5">
            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{hotel.star_rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        {/* Hotel Name and Rating */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate flex-1 mr-2 leading-tight">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Amenities - Compact */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {hotel.amenities.slice(0, 2).map((amenity) => (
              <span
                key={amenity.id}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
              >
                {amenity.name}
              </span>
            ))}
            {hotel.amenities.length > 2 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                +{hotel.amenities.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            {cheapestRoomType ? (
              <>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(cheapestRoomType.current_price || cheapestRoomType.base_price_per_night)}
                </span>
                <span className="text-xs text-gray-500"> /night</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">No rooms</span>
            )}
          </div>
          
          {cheapestRoomType && cheapestRoomType.available_rooms && cheapestRoomType.available_rooms > 0 ? (
            <button
              onClick={() => handleBook(cheapestRoomType)}
              disabled={isBooking}
              className="bg-[var(--color-brand)] text-white px-2 py-1 rounded text-xs font-medium hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isBooking ? 'Booking...' : 'Book'}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-2 py-1 rounded text-xs font-medium cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
