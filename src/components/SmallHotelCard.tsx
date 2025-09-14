import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HotelWithDetails, RoomTypeWithDetails } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'

interface SmallHotelCardProps {
  hotel: HotelWithDetails
  checkInDate?: string
  checkOutDate?: string
  numGuests?: number
}

export function SmallHotelCard({ hotel, checkInDate, checkOutDate, numGuests = 1 }: SmallHotelCardProps) {
  const { user } = useAuth()
  const { t, formatPrice } = useLanguage()
  const router = useRouter()
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

  const handleCardClick = () => {
    router.push(`/hotels/${hotel.id}`)
  }

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (!user) {
      // Redirect to login or show login modal
      return
    }
    
    setIsBooking(true)
    // TODO: Implement booking logic
    setTimeout(() => {
      setIsBooking(false)
    }, 2000)
  }

  // Helper function to translate amenity names
  const translateAmenity = (amenityName: string) => {
    const amenityMap: Record<string, string> = {
      'WiFi': t('amenity.wifi'),
      'Free WiFi': t('amenity.wifi'),
      'Breakfast': t('amenity.breakfast'),
      'Swimming Pool': t('amenity.pool'),
      'Pool': t('amenity.pool'),
      'Fitness Center': t('amenity.gym'),
      'Gym': t('amenity.gym'),
      'Spa': t('amenity.spa'),
      'Spa & Wellness': t('amenity.spa'),
      'Restaurant': t('amenity.restaurant'),
      'Parking': t('amenity.parking'),
      'Airport Shuttle': t('amenity.airport_shuttle'),
      'Pet Friendly': t('amenity.pet_friendly'),
      'Business Center': t('amenity.business_center'),
      'Concierge': t('amenity.concierge'),
      'Room Service': t('amenity.room_service'),
      'Laundry Service': t('amenity.laundry'),
      'Air Conditioning': t('amenity.ac'),
      'AC': t('amenity.ac'),
      'TV': t('amenity.tv'),
      'Flat-screen TV': t('amenity.tv'),
      'Minibar': t('amenity.minibar'),
      'Safe': t('amenity.safe'),
      'In-room Safe': t('amenity.safe'),
      'Balcony': t('amenity.balcony'),
      'Ocean View': t('amenity.ocean_view'),
      'City View': t('amenity.city_view'),
      'Garden View': t('amenity.garden_view'),
    }
    
    return amenityMap[amenityName] || amenityName
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-gray-700">{averageRating}</span>
        </div>

        {/* Amenities Count */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs text-gray-600">
              {hotel.amenities.length > 2 
                ? `+${hotel.amenities.length - 2} ${t('hotels.amenities')}`
                : `${hotel.amenities.length} ${t('hotels.amenities')}`
              }
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Hotel Name and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-[var(--color-brand)] transition-colors">
            {hotel.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {hotel.city?.name}, {hotel.city?.country?.name}
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-gray-700">{averageRating}</span>
          </div>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{reviewCount} {t('hotels.reviews')}</span>
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {cheapestRoomType ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(cheapestRoomType.current_price || cheapestRoomType.base_price_per_night)}
                  </span>
                  <span className="text-xs text-gray-500">{t('hotels.per_night')}</span>
                </div>
                {(cheapestRoomType.available_rooms ?? 0) > 0 ? (
                  <p className="text-xs text-green-600 font-medium">
                    {cheapestRoomType.available_rooms} {t('hotels.available_rooms')}
                  </p>
                ) : (
                  <p className="text-xs text-red-600 font-medium">{t('hotels.sold_out')}</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">{t('hotels.no_rooms')}</p>
              </div>
            )}
          </div>
          
          {/* Book Button */}
          <button
            onClick={handleBookClick}
            disabled={!cheapestRoomType || (cheapestRoomType.available_rooms ?? 0) === 0 || isBooking}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              !cheapestRoomType || (cheapestRoomType.available_rooms ?? 0) === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isBooking
                ? 'bg-[var(--color-brand-600)] text-white cursor-not-allowed'
                : 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)] hover:scale-105 active:scale-95'
            }`}
          >
            {isBooking ? t('hotels.booking') : t('hotels.book')}
          </button>
        </div>

        {/* Quick Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {translateAmenity(amenity.name)}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
