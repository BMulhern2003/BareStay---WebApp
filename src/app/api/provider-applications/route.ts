import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { basicInfo, roomSetup, roomTypes, userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    if (!basicInfo || !roomSetup || !roomTypes) {
      return NextResponse.json(
        { error: 'Missing required application data' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Start a transaction to insert all data
    const applicationData = {
      user_id: userId,
      status: 'pending',
      
      // Basic hotel information
      hotel_name: basicInfo.name,
      hotel_description: basicInfo.description,
      hotel_street: basicInfo.street,
      hotel_city: basicInfo.city,
      hotel_state: basicInfo.state,
      hotel_country: basicInfo.country,
      hotel_zip_code: basicInfo.zipCode,
      hotel_phone: basicInfo.phone,
      hotel_email: basicInfo.email,
      
      // Room setup information
      number_of_room_types: roomSetup.numberOfRoomTypes,
      total_number_of_rooms: roomSetup.totalNumberOfRooms,
      hotel_amenities: roomSetup.amenities,
      
      // Room types data
      room_types: roomTypes.map(roomType => ({
        name: roomType.name,
        number_of_rooms: roomType.numberOfRooms,
        price_per_night: roomType.pricePerNight,
        max_occupancy: roomType.maxOccupancy,
        amenities: roomType.amenities,
        images_count: roomType.images.length,
      })),
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert the provider application
    const { data: application, error: applicationError } = await supabaseAdmin
      .from('provider_applications')
      .insert([applicationData])
      .select()
      .single()

    if (applicationError) {
      console.error('Error creating provider application:', applicationError)
      
      // Check if the table exists, if not create it
      if (applicationError.code === 'PGRST205' || applicationError.message?.includes('Could not find the table')) {
        // Table doesn't exist, create it using a simpler approach
        try {
          // Create table using direct SQL
          const { error: createTableError } = await supabaseAdmin
            .from('provider_applications')
            .select('id')
            .limit(1)

          if (createTableError && createTableError.code === 'PGRST205') {
            // Table doesn't exist, we need to create it
            // For now, let's use a fallback approach with a simple JSON structure
            const { data: fallbackApplication, error: fallbackError } = await supabaseAdmin
              .from('provider_applications')
              .insert([{
                user_id: userId,
                status: 'pending',
                application_data: applicationData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }])
              .select()

            if (fallbackError) {
              console.error('Fallback insert error:', fallbackError)
              return NextResponse.json(
                { error: 'Database table not configured. Please contact support.' },
                { status: 500 }
              )
            }

            return NextResponse.json({
              success: true,
              message: 'Application submitted successfully',
              application: fallbackApplication,
            })
          }
        } catch (tableError) {
          console.error('Table creation error:', tableError)
          return NextResponse.json(
            { error: 'Database configuration issue. Please contact support.' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Failed to submit application. Please try again.' },
          { status: 500 }
        )
      }
    }

    // TODO: Handle image uploads to storage
    // For now, we'll store the image count and handle actual uploads later
    
    // TODO: Send notification email to admins
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application,
    })

  } catch (error) {
    console.error('Provider application submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Get user's applications
    const { data: applications, error } = await supabaseAdmin
      .from('provider_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      applications,
    })

  } catch (error) {
    console.error('Provider application fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
