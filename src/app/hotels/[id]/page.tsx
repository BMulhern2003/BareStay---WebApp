'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useHotels } from '@/hooks/useHotels'
import { HotelCard } from '@/components/HotelCard'
import { RoomTypeCard } from '@/components/RoomTypeCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { HotelWithDetails } from '@/types'

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { hotels, loading } = useHotels()
  const { t, formatPrice } = useLanguage()
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const hotelId = params.id as string
  const hotel = hotels.find(h => h.id === hotelId)

  const totalGuests = adults + children

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const nights = calculateNights()

  // Calculate total cost for a room type
  const calculateTotalCost = (pricePerNight: number) => {
    if (!checkInDate || !checkOutDate) return pricePerNight // Return nightly price if dates not selected
    return pricePerNight * nights
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

  const handleDateRangeChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates
      setCheckInDate(start)
      setCheckOutDate(end)
      
      if (start && end) {
        setShowDatePicker(false)
      }
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-brand)] border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('hotels.hotel_not_found')}</h1>
            <button
              onClick={() => router.push('/hotels')}
              className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-brand-600)] transition-colors"
            >
              {t('hotels.back_to_hotels')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Create placeholder images if hotel doesn't have enough images
  const createPlaceholderImages = () => {
    const existingImages = hotel.images || []
    const placeholderImages = []
    
    // Add existing images
    existingImages.forEach(img => placeholderImages.push(img))
    
    // Add placeholder images to reach 5 total (1 main + 4 thumbnails)
    for (let i = existingImages.length; i < 5; i++) {
      placeholderImages.push({
        id: `placeholder-${i}`,
        hotel_id: hotel.id,
        image_url: `https://via.placeholder.com/400x300/cccccc/666666?text=Image+${i + 1}`,
        alt_text: `Placeholder image ${i + 1}`,
        is_primary: i === 0,
        sort_order: i,
        created_at: new Date().toISOString()
      })
    }
    
    return placeholderImages
  }

  const images = createPlaceholderImages()
  const mainImage = images[currentImageIndex] || images[0]
  const thumbnailImages = images.slice(1, 5) // Show 4 thumbnails for 2x2 grid

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </button>
      </div>

      {/* Image Gallery - Airbnb Style Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-96 lg:h-[400px]">
          {/* Main Image - Left Side */}
          <div className="lg:col-span-2 relative rounded-l-2xl overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage.image_url}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-6xl">🏨</span>
              </div>
            )}
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  disabled={currentImageIndex === 0}
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  disabled={currentImageIndex === images.length - 1}
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images - Right Side 2x2 Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
            {thumbnailImages.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden cursor-pointer hover:brightness-110 transition-all ${
                  index === 1 ? 'rounded-tr-2xl' : ''
                } ${
                  index === 3 ? 'rounded-br-2xl' : ''
                }`}
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <img
                  src={image.image_url}
                  alt={`${hotel.name} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Show all photos overlay on last image */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span className="text-sm font-medium">Show all photos</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hotel Info */}
          <div className="flex-1">
            {/* Hotel Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <p className="text-gray-600 mb-4">{hotel.address}</p>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900">{hotel.average_rating || 4.5}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{hotel.review_count || 0} {t('hotels.reviews')}</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('hotels.amenities')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium">{translateAmenity(amenity.name)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel - Airbnb Style */}
          <div className="lg:w-96">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
              {/* Price Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {hotel.room_types?.[0] ? formatPrice(hotel.room_types[0].current_price || hotel.room_types[0].base_price_per_night) : '£0'}
                  </span>
                  <span className="text-gray-600">night</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-700">{hotel.average_rating || 4.5}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700">{hotel.review_count || 0} reviews</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      {t('hotels.check_in')}
                    </label>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors bg-white"
                    >
                      <span className="text-gray-900 font-medium">
                        {checkInDate ? formatDate(checkInDate) : t('hotels.select_date')}
                      </span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      {t('hotels.check_out')}
                    </label>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors bg-white"
                    >
                      <span className="text-gray-900 font-medium">
                        {checkOutDate ? formatDate(checkOutDate) : t('hotels.select_date')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                {showDatePicker && (
                  <div className="absolute z-50 mt-2">
                    <DatePicker
                      selected={checkInDate}
                      onChange={handleDateRangeChange}
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      selectsRange={true}
                      inline
                      minDate={new Date()}
                      className="bg-white rounded-xl shadow-xl border border-gray-200 p-4"
                    />
                  </div>
                )}
              </div>

              {/* Guest Selection - Like Search Bar */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  {t('hotels.guests')}
                </label>
                <button 
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors bg-white"
                >
                  <span className="text-gray-900 font-medium">
                    {totalGuests} {totalGuests === 1 ? t('hotels.guest') : t('hotels.guests')}
                  </span>
                </button>

                {/* Guest Picker - Like Search Bar */}
                {showGuestPicker && (
                  <div className="absolute z-50 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('hotels.guests')}</h3>
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{t('hotels.adults')}</div>
                          <div className="text-sm text-gray-500">{t('hotels.ages_13_above')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={adults <= 1}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium">{adults}</span>
                          <button
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{t('hotels.children')}</div>
                          <div className="text-sm text-gray-500">{t('hotels.ages_2_12')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={children <= 0}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium">{children}</span>
                          <button
                            onClick={() => setChildren(children + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <button className="w-full bg-[var(--color-brand)] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[var(--color-brand-600)] transition-colors mb-3">
                Reserve
              </button>
              
              <p className="text-center text-sm text-gray-600">
                You won't be charged yet
              </p>

              {/* Stay Summary - Only show when dates are selected */}
              {nights > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">
                        {formatPrice(hotel.room_types?.[0]?.current_price || hotel.room_types?.[0]?.base_price_per_night || 0)} × {nights} {nights === 1 ? t('hotels.night') : t('hotels.nights')}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {formatPrice(calculateTotalCost(hotel.room_types?.[0]?.current_price || hotel.room_types?.[0]?.base_price_per_night || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Room Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('hotels.available_rooms_list')}</h2>
        
        {hotel.room_types && hotel.room_types.length > 0 ? (
          <div className="space-y-6">
            {hotel.room_types.map((roomType) => (
              <div key={roomType.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <RoomTypeCard
                  roomType={roomType}
                  hotel={hotel}
                  checkInDate={checkInDate?.toISOString().split('T')[0]}
                  checkOutDate={checkOutDate?.toISOString().split('T')[0]}
                  numGuests={totalGuests}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('hotels.no_rooms_available')}</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">{t('hotels.disclaimer_title')}</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>{t('hotels.disclaimer_1')}</p>
              <p>{t('hotels.disclaimer_2')}</p>
              <p>{t('hotels.disclaimer_3')}</p>
              <p>{t('hotels.disclaimer_4')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
