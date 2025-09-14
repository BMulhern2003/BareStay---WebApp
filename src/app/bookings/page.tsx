'use client'

import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useBookings } from '@/hooks/useBookings'
import { BookingCard } from '@/components/BookingCard'
import { RoomMatchOverlay } from '@/components/RoomMatchOverlay'

export default function BookingsPage() {
  const { bookings, loading, error } = useBookings()
  const [query, setQuery] = useState('')
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [activeField, setActiveField] = useState<string | null>(null)
  const [activeDateField, setActiveDateField] = useState<'checkin' | 'checkout' | null>(null)
  const [showRoomMatch, setShowRoomMatch] = useState(false)
  const [isSearchHidden, setIsSearchHidden] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState(bookings)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const totalGuests = adults + children

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show/hide search area based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down - hide search area
        setIsSearchHidden(true)
      } else {
        // Scrolling up - show search area
        setIsSearchHidden(false)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Update search results when bookings change
  useEffect(() => {
    if (!hasSearched) {
      setSearchResults(bookings)
    }
  }, [bookings, hasSearched])

  const handleSearch = () => {
    const filtered = bookings.filter((b) => {
      const matchesQuery = query
        ? [b.title, b.location, b.description || '']
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase())
        : true
      const matchesDate = checkInDate ? new Date(b.date).toDateString() === checkInDate.toDateString() : true
      return matchesQuery && matchesDate
    })
    
    setSearchResults(filtered)
    setHasSearched(true)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-brand)] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="text-center">
              <p className="text-red-600">Error loading bookings: {error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className={`bg-gray-100 border-b border-gray-200 sticky top-16 z-40 transition-all duration-300 ${
        isSearchHidden ? '-translate-y-full' : 'translate-y-0'
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
                      <span className="text-sm font-semibold text-gray-900">Where</span>
                      {activeField === 'where' ? (
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search destinations"
                          className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400 w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {query || 'Search destinations'}
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
                      <span className="text-sm font-semibold text-gray-900">Check in</span>
                      <span className="text-sm text-gray-500">
                        {checkInDate ? formatDate(checkInDate) : 'Add dates'}
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
                      <span className="text-sm font-semibold text-gray-900">Check out</span>
                      <span className="text-sm text-gray-500">
                        {checkOutDate ? formatDate(checkOutDate) : 'Add dates'}
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
                      <span className="text-sm font-semibold text-gray-900">Who</span>
                      <span className="text-sm text-gray-500">
                        {totalGuests > 1 ? `${totalGuests} guests` : 'Add guests'}
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
                        <span className="ml-2 font-medium text-sm">Search</span>
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Suggested destinations</h3>
                    <div className="space-y-3">
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery('Nearby')
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
                          <div className="font-medium text-gray-900">Nearby</div>
                          <div className="text-sm text-gray-500">Find what's around you</div>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery('London, England')
                          handleClose()
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">London, England</div>
                          <div className="text-sm text-gray-500">For sights like Buckingham Palace</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guests Dropdown */}
                {activeField === 'guests' && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[60]">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Guests</h3>
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Adults</div>
                          <div className="text-sm text-gray-500">Ages 13 or above</div>
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
                          <div className="font-medium text-gray-900">Children</div>
                          <div className="text-sm text-gray-500">Ages 2-12</div>
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
          {searchResults.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {hasSearched ? 'No bookings match your search.' : 'Enter your search criteria and click search to find bookings.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {searchResults.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
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
        bookings={bookings}
      />
    </div>
  )
}
