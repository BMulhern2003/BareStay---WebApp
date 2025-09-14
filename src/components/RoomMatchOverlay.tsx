'use client'

import { useState, useEffect } from 'react'
import { Booking } from '@/types'

interface RoomMatchOverlayProps {
  isOpen: boolean
  onClose: () => void
  bookings: Booking[]
}

export function RoomMatchOverlay({ isOpen, onClose, bookings }: RoomMatchOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<string[]>([])
  const [passes, setPasses] = useState<string[]>([])

  const currentBooking = bookings[currentIndex]

  const handleSwipe = (action: 'like' | 'pass') => {
    if (!currentBooking) return

    if (action === 'like') {
      setMatches(prev => [...prev, currentBooking.id])
    } else {
      setPasses(prev => [...prev, currentBooking.id])
    }

    if (currentIndex < bookings.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Reset or show completion
      setCurrentIndex(0)
    }
  }

  if (!isOpen) return null

  if (!currentBooking) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <h2 className="text-xl font-bold text-center mb-4">No more properties!</h2>
          <p className="text-gray-600 text-center mb-6">You've seen all available properties.</p>
          <button 
            onClick={onClose}
            className="w-full bg-[var(--color-brand)] text-white py-3 rounded-xl font-medium"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Room Match</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Property Card */}
        <div className="relative">
          {/* Image */}
          <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 flex-1">
                {currentBooking.title}
              </h3>
              <div className="flex items-center gap-1 ml-2">
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-sm">4.9</span>
              </div>
            </div>

            <p className="text-gray-600 mb-2">{currentBooking.location}</p>
            
            {currentBooking.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {currentBooking.description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📅</span>
                {new Date(currentBooking.date).toLocaleDateString()} at {currentBooking.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">👥</span>
                {currentBooking.available_seats} of {currentBooking.max_seats} seats available
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-gray-900">${currentBooking.price}</span>
              <span className="text-gray-500"> per night</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0">
            <div className="flex gap-4">
              <button
                onClick={() => handleSwipe('pass')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Pass
              </button>
              <button
                onClick={() => handleSwipe('like')}
                className="flex-1 bg-[var(--color-brand)] hover:bg-[var(--color-brand-600)] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Like
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pb-4">
            <div className="flex gap-1">
              {bookings.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index <= currentIndex ? 'bg-[var(--color-brand)]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {currentIndex + 1} of {bookings.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
