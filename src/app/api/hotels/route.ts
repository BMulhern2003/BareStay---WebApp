import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cityName = searchParams.get('city_id') // This is actually city name from our search
    const countryId = searchParams.get('country_id')
    const checkInDate = searchParams.get('check_in_date')
    const checkOutDate = searchParams.get('check_out_date')
    const numGuests = searchParams.get('num_guests')
    
    const supabase = createAdminClient()
    
    // Build the query step by step
    let query = supabase
      .from('hotels')
      .select(`
        *,
        city:cities(
          id,
          name,
          country:countries(
            id,
            name,
            code
          )
        ),
        images:hotel_images(*),
        amenities:hotel_amenities(
          amenity:amenities(*)
        ),
        room_types:room_types(*)
      `)
      .eq('is_active', true)
    
    // Search by city name - filter after getting the data for better control
    if (cityName) {
      const { data: allHotels, error: allError } = await query.order('star_rating', { ascending: false })
      
      if (allError) {
        console.error('Supabase error:', allError)
        return NextResponse.json({ error: allError.message }, { status: 500 })
      }
      
      // Filter by city name in JavaScript
      const filteredHotels = allHotels?.filter(hotel => 
        hotel.city?.name?.toLowerCase() === cityName.toLowerCase()
      ) || []
      
      // Format the response
      const formattedHotels = filteredHotels.map(hotel => ({
        ...hotel,
        amenities: hotel.amenities.map((ha: any) => ha.amenity),
        room_types: hotel.room_types?.map((rt: any) => ({
          ...rt,
          current_price: rt.base_price_per_night,
          available_rooms: 5
        }))
      }));

      return NextResponse.json({ hotels: formattedHotels })
    }
    
    if (countryId) {
      query = query.eq('city.country_id', countryId)
    }
    
    const { data: hotels, error } = await query.order('star_rating', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response to flatten amenities and add current_price to room_types
    const formattedHotels = hotels?.map(hotel => ({
      ...hotel,
      amenities: hotel.amenities.map((ha: any) => ha.amenity),
      room_types: hotel.room_types?.map((rt: any) => ({
        ...rt,
        current_price: rt.base_price_per_night, // Add current_price for HotelCard
        available_rooms: 5 // Placeholder for now
      }))
    }));

    return NextResponse.json({ hotels: formattedHotels })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
