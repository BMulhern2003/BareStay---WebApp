
import { useState } from 'react'
import { Booking } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface BookingCardProps {
  booking: Booking
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
    <div className="group bg-white overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow">
      <div className="px-5 py-5">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">
          {booking.title}
        </h3>
        {booking.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{booking.description}</p>
        )}
        
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center mr-2 h-5 w-5 rounded-full bg-gray-100 text-gray-700">🗓️</span>
            {new Date(booking.date).toLocaleDateString()} at {booking.time}
          </div>
          
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center mr-2 h-5 w-5 rounded-full bg-gray-100 text-gray-700">📍</span>
            {booking.location}
          </div>
          
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center mr-2 h-5 w-5 rounded-full bg-gray-100 text-gray-700">👥</span>
            {booking.available_seats} of {booking.max_seats} seats available
          </div>
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${booking.price}
          </span>
          
          <button
            onClick={handleBook}
            disabled={booking.available_seats === 0 || isBooking}
            className="inline-flex items-center gap-2 bg-[var(--color-brand)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[var(--color-brand-600)] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
      <div className="h-1 bg-gray-100 group-hover:bg-[var(--color-brand)] transition-colors"></div>
    </div>
  )
}