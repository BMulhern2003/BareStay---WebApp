import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createBookingRequestSchema, createValidationErrorResponse } from '@/lib/validations'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: requests, error } = await supabase
      .from('booking_requests')
      .select(`
        *,
        bookings (*),
        profiles (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ requests })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // ✅ Validate input with Zod
    const validationResult = createBookingRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.error.issues),
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if booking exists and has available seats
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', validatedData.booking_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.available_seats < validatedData.seats) {
      return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 })
    }

    // Create booking request
    const { data: bookingRequest, error } = await supabase
      .from('booking_requests')
      .insert([{
        booking_id: validatedData.booking_id,
        user_id: user.id,
        seats: validatedData.seats,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update available seats
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        available_seats: booking.available_seats - validatedData.seats,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.booking_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ request: bookingRequest }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
