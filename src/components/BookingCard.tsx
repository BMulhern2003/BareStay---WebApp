import { useState } from 'react'
import { LegacyBooking } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface BookingCardProps {
  booking: LegacyBooking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { user } = useAuth()
  const [isBooking, setIsBooking] = useState(false)

  const handleBook = async () => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/signin'
      return
    }

    setIsBooking(true)
    try {
      // TODO: Implement booking logic
      console.log('Booking:', booking.id)
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Image placeholder - smaller height */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🏠</span>
        </div>
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-xs font-semibold text-gray-900 truncate flex-1 mr-2">
            {booking.title}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-xs">4.9</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-1 truncate">{booking.location}</p>
        <p className="text-xs text-gray-500 mb-2">
          {new Date(booking.date).toLocaleDateString()}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-900">${booking.price}</span>
            <span className="text-xs text-gray-500"> night</span>
          </div>
          
          <button
            onClick={handleBook}
            disabled={booking.available_seats === 0 || isBooking}
            className="bg-[var(--color-brand)] text-white px-2 py-1 rounded text-xs font-medium hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? 'Booking...' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Export both components for flexibility
export { HotelCard } from './HotelCard'
export { RoomTypeCard } from './RoomTypeCard'
