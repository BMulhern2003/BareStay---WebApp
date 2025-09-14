'use client'

import { useState, useEffect } from 'react'
import { LegacyBooking } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface RoomMatchOverlayProps {
  isOpen: boolean
  onClose: () => void
  bookings: LegacyBooking[]
}

export function RoomMatchOverlay({ isOpen, onClose, bookings }: RoomMatchOverlayProps) {
  const { t } = useLanguage()
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
          <h2 className="text-xl font-bold text-center mb-4">{t('room_match.no_more_properties')}</h2>
          <p className="text-gray-600 text-center mb-6">{t('room_match.seen_all')}</p>
          <button 
            onClick={onClose}
            className="w-full bg-[var(--color-brand)] text-white py-3 rounded-xl font-medium"
          >
            {t('room_match.close')}
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
          <h2 className="text-lg font-bold">{t('room_match.title')}</h2>
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
            <h3 className="text-xl font-bold mb-2">{currentBooking.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{currentBooking.location}</p>
            
            {/* Property Details */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
                </svg>
                <span>{currentBooking.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(currentBooking.date).toLocaleDateString()} at {currentBooking.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>${currentBooking.price}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{currentBooking.available_seats} / {currentBooking.max_seats} seats available</span>
              </div>
            </div>

            {/* Description */}
            {currentBooking.description && (
              <p className="text-sm text-gray-600 mb-6">{currentBooking.description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSwipe('pass')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {t('room_match.pass')}
              </button>
              <button
                onClick={() => handleSwipe('like')}
                className="flex-1 bg-[var(--color-brand)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-brand-600)] transition-colors"
              >
                {t('room_match.like')}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{t('room_match.matches')}: {matches.length}</span>
            <span>{currentIndex + 1} / {bookings.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[var(--color-brand)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / bookings.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
