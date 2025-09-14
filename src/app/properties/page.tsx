'use client'

import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useHotels, useHotelSearch } from '@/hooks/useHotels'
import { SmallHotelCard } from '@/components/SmallHotelCard'
import { RoomMatchOverlay } from '@/components/RoomMatchOverlay'
import { HotelSearchFilters, HotelWithDetails, LegacyBooking } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PropertiesPage() {
  const { hotels, loading, error } = useHotels()
  const { searchResults, loading: searchLoading, search } = useHotelSearch()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [activeField, setActiveField] = useState<string | null>(null)
  const [activeDateField, setActiveDateField] = useState<'checkin' | 'checkout' | null>(null)
  const [isSearchHidden, setIsSearchHidden] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showRoomMatch, setShowRoomMatch] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const totalGuests = adults + children

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mock bookings data for room match overlay
  const mockBookings: LegacyBooking[] = [
    {
      id: '1',
      title: 'Luxury Beach Villa',
      description: 'Beautiful beachfront villa with stunning ocean views',
      date: '2024-02-15',
      time: '14:00',
      location: 'Bali, Indonesia',
      price: 450,
      max_seats: 4,
      available_seats: 2,
      status: 'available',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Modern City Apartment',
      description: 'Stylish apartment in the heart of Bangkok',
      date: '2024-02-18',
      time: '15:00',
      location: 'Bangkok, Thailand',
      price: 280,
      max_seats: 2,
      available_seats: 1,
      status: 'available',
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z'
    },
    {
      id: '3',
      title: 'Mountain Retreat',
      description: 'Peaceful mountain retreat with nature views',
      date: '2024-02-25',
      time: '16:00',
      location: 'Chiang Mai, Thailand',
      price: 320,
      max_seats: 6,
      available_seats: 3,
      status: 'available',
      created_at: '2024-01-25T10:00:00Z',
      updated_at: '2024-01-25T10:00:00Z'
    }
  ]

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide search area when scrolling down past 50px
      // Only show it again when scrolling back to the very top (0px)
      if (currentScrollY > 50) {
        setIsSearchHidden(true)
      } else {
        setIsSearchHidden(false)
      }
    }

    // Set initial scroll state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted])

  // Handle click outside to close active field
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setActiveField(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveField(null)
      }
    }

    if (activeField) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [activeField])

  const handleSearch = async () => {
    setHasSearched(true)
    
    const filters: HotelSearchFilters = {
      num_guests: totalGuests,
    }

    // Only add dates if both are selected
    if (checkInDate && checkOutDate) {
      filters.check_in_date = checkInDate.toISOString().split('T')[0]
      filters.check_out_date = checkOutDate.toISOString().split('T')[0]
    }

    // Add location filter if query is provided
    if (query.trim()) {
      // For now, we'll search by city name
      // In a real app, you'd have a city search API
      filters.city_id = query.trim()
    }

    await search(filters)
    setActiveField(null) // Close any open fields
  }

  const handleFieldClick = (field: string) => {
    if (field === 'checkin' || field === 'checkout') {
      setActiveField('dates')
      setActiveDateField(field as 'checkin' | 'checkout')
    } else {
      setActiveField(field)
      setActiveDateField(null)
    }
  }

  const handleClose = () => {
    setActiveField(null)
    setActiveDateField(null)
  }

  const handleDateRangeChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates
      setCheckInDate(start)
      setCheckOutDate(end)
      
      // Close the date picker when both dates are selected
      if (start && end) {
        setTimeout(() => {
          handleClose()
        }, 300)
      }
    }
  }

  const handleClearCheckIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCheckInDate(null)
  }

  const handleClearCheckOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCheckOutDate(null)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return ''
    
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const displayHotels = hasSearched ? searchResults.map(result => result.hotel) : hotels
  const isLoading = hasSearched ? searchLoading : loading

  // Group hotels by location
  const groupedHotels = displayHotels.reduce((groups, hotel) => {
    const location = `${hotel.city?.name}, ${hotel.city?.country?.name}`
    if (!groups[location]) {
      groups[location] = []
    }
    groups[location].push(hotel)
    return groups
  }, {} as Record<string, HotelWithDetails[]>)

  // Sort locations alphabetically
  const sortedLocations = Object.keys(groupedHotels).sort()

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="text-center">
              <p className="text-red-600">Error loading properties: {error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className={`bg-gray-100 border-b border-gray-200 sticky top-16 z-40 transition-all duration-300 ${
        isMounted && isSearchHidden ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {/* Search Bar - White by default with rounded edges */}
              <div className="relative" ref={searchContainerRef}>
                <div className={`flex items-center border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                  activeField ? 'bg-gray-100' : 'bg-white'
                }`}>
                  <div 
                    className={`w-80 flex items-center gap-3 px-4 py-3 cursor-pointer rounded-l-full transition-all duration-200 ${
                      activeField === 'where' 
                        ? 'bg-white shadow-md border border-gray-200' 
                        : activeField 
                          ? 'bg-gray-100 hover:bg-gray-200' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleFieldClick('where')}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900">{t('hotels.where')}</span>
                      {activeField === 'where' ? (
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={t('hotels.search_destinations')}
                          className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400 w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {query || t('hotels.search_destinations')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300" />
                  
                  <div 
                    className={`flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 relative ${
                      activeDateField === 'checkin'
                        ? 'bg-white shadow-md border border-gray-200 rounded-lg' 
                        : activeField 
                          ? 'bg-gray-100 hover:bg-gray-200' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleFieldClick('checkin')}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900">{t('hotels.check_in')}</span>
                      <span className="text-sm text-gray-500">
                        {checkInDate ? formatDate(checkInDate) : t('hotels.add_dates')}
                      </span>
                    </div>
                    {checkInDate && (
                      <button
                        onClick={handleClearCheckIn}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        title="Clear check-in date"
                      >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300" />
                  
                  <div 
                    className={`flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 relative ${
                      activeDateField === 'checkout'
                        ? 'bg-white shadow-md border border-gray-200 rounded-lg' 
                        : activeField 
                          ? 'bg-gray-100 hover:bg-gray-200' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleFieldClick('checkout')}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900">{t('hotels.check_out')}</span>
                      <span className="text-sm text-gray-500">
                        {checkOutDate ? formatDate(checkOutDate) : t('hotels.add_dates')}
                      </span>
                    </div>
                    {checkOutDate && (
                      <button
                        onClick={handleClearCheckOut}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        title="Clear check-out date"
                      >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300" />
                  
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-r-full transition-all duration-200 ${
                      activeField === 'guests' 
                        ? 'bg-white shadow-md border border-gray-200' 
                        : activeField 
                          ? 'bg-gray-100 hover:bg-gray-200' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveField('guests')}
                  >
                    <div className="flex flex-col mr-4">
                      <span className="text-sm font-semibold text-gray-900">{t('hotels.who')}</span>
                      <span className="text-sm text-gray-500">
                        {totalGuests > 1 ? `${totalGuests} ${t('hotels.guests')}` : t('hotels.add_guests')}
                      </span>
                    </div>
                    <button 
                      onClick={handleSearch}
                      className={`bg-[var(--color-brand)] text-white rounded-full hover:bg-[var(--color-brand-600)] transition-all duration-200 flex items-center ${
                        activeField ? 'px-6 py-3' : 'p-3'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {activeField && (
                        <span className="ml-2 font-medium text-sm">{t('hotels.search')}</span>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Single Date Picker for both dates */}
                {activeDateField && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-[60]">
                    <DatePicker
                      selected={checkInDate}
                      onChange={handleDateRangeChange}
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      selectsRange={true}
                      inline
                      minDate={new Date()}
                      className="bg-white rounded-xl shadow-xl border border-gray-200 p-4"
                      popperClassName="react-datepicker-popper"
                      showPopperArrow={false}
                    />
                  </div>
                )}
                
                {/* Suggested Destinations Dropdown */}
                {activeField === 'where' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[60]">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('hotels.suggested_destinations')}</h3>
                    <div className="space-y-3">
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery('Bangkok')
                          handleClose()
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Bangkok, Thailand</div>
                          <div className="text-sm text-gray-500">Luxury hotels with river views</div>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery('Singapore')
                          handleClose()
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Singapore</div>
                          <div className="text-sm text-gray-500">Modern hotels with skyline views</div>
                        </div>
                      </div>

                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery('Bali')
                          handleClose()
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Bali, Indonesia</div>
                          <div className="text-sm text-gray-500">Beachfront resorts and villas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guests Dropdown */}
                {activeField === 'guests' && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[60]">
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
            </div>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-brand)] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('hotels.loading_hotels')}</p>
            </div>
          ) : displayHotels.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {hasSearched ? t('hotels.no_hotels_found') : t('hotels.search_using_form')}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedLocations.map((location) => (
                <div key={location}>
                  {/* Location Header */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      {location}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {groupedHotels[location].length} {t('hotels.available')}
                    </p>
                  </div>
                  
                  {/* Hotels Grid for this location */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {groupedHotels[location].map((hotel) => (
                      <SmallHotelCard 
                        key={hotel.id} 
                        hotel={hotel}
                        checkInDate={checkInDate?.toISOString().split('T')[0]}
                        checkOutDate={checkOutDate?.toISOString().split('T')[0]}
                        numGuests={totalGuests}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Room Match Button - Fixed Bottom Right */}
      <button
        onClick={() => setShowRoomMatch(true)}
        className="fixed bottom-6 right-6 bg-[var(--color-brand)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--color-brand-600)] transition-all duration-200 hover:scale-110 active:scale-95 z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Room Match Overlay */}
      <RoomMatchOverlay 
        isOpen={showRoomMatch} 
        onClose={() => setShowRoomMatch(false)} 
        bookings={mockBookings}
      />
    </div>
  )
}
