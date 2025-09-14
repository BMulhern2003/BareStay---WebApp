import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG: Starting user creation ===')
    
    // Add basic error handling for request parsing
    let body
    try {
      body = await request.json()
      console.log('Request body:', body)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'Request body is not valid JSON'
        },
        { status: 400 }
      )
    }
    
    const { email, password, full_name } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Email and password are required',
          received: { email: !!email, password: !!password, full_name }
        },
        { status: 400 }
      )
    }

    // Check environment variables - use service role key for database operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceKey,
        hasAnonKey: !!supabaseAnonKey
      })
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable'
        },
        { status: 500 }
      )
    }
    
    // Use service role key for database operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('Supabase client created successfully')

    console.log('Attempting to create user with:', { email, full_name })

    // First, check if profiles table exists
    console.log('Checking if profiles table exists...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('Profiles table error:', tableError)
      return NextResponse.json(
        { 
          error: 'Database schema error', 
          details: `Profiles table issue: ${tableError.message}`,
          code: tableError.code,
          hint: tableError.hint,
          suggestion: 'The profiles table may not exist or have incorrect permissions'
        },
        { status: 500 }
      )
    }

    console.log('Profiles table exists, proceeding with user creation...')

    // Create a client with anon key for standard auth flow
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey!)
    
    // Try to create user using standard auth (with email verification)
    const { data: authData, error: authError } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { 
          error: 'Authentication error', 
          details: authError.message,
          code: authError.status,
          fullError: authError
        },
        { status: 400 }
      )
    }

    console.log('Auth success:', authData)

    if (!authData.user) {
      return NextResponse.json(
        { 
          error: 'User creation failed',
          details: 'No user data returned from Supabase'
        },
        { status: 500 }
      )
    }

    // With standard auth flow, the trigger should automatically create the profile
    // Let's check if the profile was created by the trigger
    console.log('Checking if profile was created by trigger...')
    
    // Wait a moment for the trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, trigger might not have fired
      console.log('Profile not found, trigger may not have fired')
      
      return NextResponse.json({
        success: true,
        message: 'User created successfully. Please check your email for verification.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          email_confirmed: authData.user.email_confirmed_at ? true : false
        },
        note: 'Profile will be created automatically after email verification'
      })
    } else if (profileError) {
      console.error('Error checking profile:', profileError)
      
      return NextResponse.json({
        success: true,
        message: 'User created successfully. Please check your email for verification.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          email_confirmed: authData.user.email_confirmed_at ? true : false
        },
        warning: 'Could not verify profile creation'
      })
    }

    console.log('Profile found:', profileData)

    return NextResponse.json({
      success: true,
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        email_confirmed: authData.user.email_confirmed_at ? true : false
      },
      profile: profileData
    })

  } catch (error) {
    console.error('Unexpected error in debug endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Unexpected server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
