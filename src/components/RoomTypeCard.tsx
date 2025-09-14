import { useState } from 'react'
import { RoomTypeWithDetails } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'

interface RoomTypeCardProps {
  roomType: RoomTypeWithDetails
  hotel: any
  checkInDate?: string
  checkOutDate?: string
  numGuests?: number
}

export function RoomTypeCard({ roomType, hotel, checkInDate, checkOutDate, numGuests = 1 }: RoomTypeCardProps) {
  const { user } = useAuth()
  const { t, formatPrice } = useLanguage()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
      '24/7 Room Service': t('amenity.room_service'),
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || roomType.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🛏️</span>
          </div>
        )}
        
        {/* Room Type Badge */}
        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-sm font-medium">
          {roomType.name}
        </div>
      </div>
      
      <div className="p-4">
        {/* Room Type Name and Capacity */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {roomType.name}
          </h3>
          <p className="text-sm text-gray-600">
            {roomType.max_occupancy} {t('hotels.guests')} • {roomType.size_sqm}m²
          </p>
        </div>

        {/* Room Amenities */}
        {roomType.amenities && roomType.amenities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('hotels.amenities')}</h4>
            <div className="flex flex-wrap gap-1">
              {roomType.amenities.slice(0, 6).map((amenity) => (
                <span
                  key={amenity.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  {translateAmenity(amenity.name)}
                </span>
              ))}
              {roomType.amenities.length > 6 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{roomType.amenities.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Booking Dates */}
        {checkInDate && checkOutDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">{t('booking.select_dates')}</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(checkInDate)} - {formatDate(checkOutDate)}
            </div>
          </div>
        )}

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(roomType.current_price || roomType.base_price_per_night)}
            </div>
            <div className="text-sm text-gray-500">/{t('hotels.per_night')}</div>
          </div>
          
          {roomType.available_rooms && roomType.available_rooms > 0 ? (
            <button
              onClick={handleBook}
              disabled={isBooking}
              className="bg-[var(--color-brand)] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isBooking ? t('common.loading') : t('hotels.book_now')}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
            >
              {t('hotels.sold_out')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
