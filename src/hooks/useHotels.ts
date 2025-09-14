'use client'

import { useState, useEffect } from 'react'
import { HotelWithDetails, HotelSearchFilters, HotelSearchResult } from '@/types'

export function useHotels() {
  const [hotels, setHotels] = useState<HotelWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async (filters?: HotelSearchFilters) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()))
            } else {
              params.append(key, value.toString())
            }
          }
        })
      }

      const response = await fetch(`/api/hotels?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotels')
      }

      setHotels(data.hotels || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const searchHotels = async (filters: HotelSearchFilters) => {
    return fetchHotels(filters)
  }

  return { 
    hotels, 
    loading, 
    error, 
    refetch: fetchHotels,
    searchHotels 
  }
}

export function useHotelSearch() {
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (filters: HotelSearchFilters) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/hotels?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search hotels')
      }

      setSearchResults(data.hotels?.map((hotel: HotelWithDetails) => ({ hotel })) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { 
    searchResults, 
    loading, 
    error, 
    search 
  }
}