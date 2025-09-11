'use client'

import { useState } from 'react'
import { useBookings } from '@/hooks/useBookings'
import { Navigation } from '@/components/Navigation'
import { BookingCard } from '@/components/BookingCard'

export default function BookingsPage() {
  const { bookings, loading, error } = useBookings()
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(1)

  const filtered = bookings.filter((b) => {
    const matchesQuery = query
      ? [b.title, b.location, b.description || '']
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      : true
    const matchesDate = date ? new Date(b.date).toDateString() === new Date(date).toDateString() : true
    return matchesQuery && matchesDate
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error loading bookings: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Find your next stay</h1>
            <p className="mt-2 text-gray-600">Premium stays and experiences, curated for you.</p>
          </div>

          <div className="w-full bg-white shadow-sm ring-1 ring-gray-200 rounded-full p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-gray-500">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3 px-3">
              <span className="text-gray-500">📅</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none text-gray-900"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3 px-3">
              <span className="text-gray-500">👥</span>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-16 bg-transparent outline-none text-gray-900"
              />
            </div>
            <button className="ml-auto bg-[var(--color-brand)] text-white px-6 py-3 rounded-full font-medium shadow-sm hover:bg-[var(--color-brand-600)] transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No bookings match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
