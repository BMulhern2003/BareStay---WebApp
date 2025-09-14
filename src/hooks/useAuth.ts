'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        // Retry on server errors
        if (response.status >= 500 && retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return fetchProfile(userId, retryCount + 1)
        }
        return null
      }

      const result = await response.json()
      
      if (result.success && result.profile) {
        return result.profile
      }
      
      return null
    } catch (error) {
      // Retry on network errors
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchProfile(userId, retryCount + 1)
      }
      
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // First test with simple endpoint to verify API connectivity
      console.log('Testing API connectivity...')
      const testResponse = await fetch('/api/debug/simple-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name || '',
        }),
      })
      
      const testData = await testResponse.json()
      console.log('Simple test response:', testData)
      
      // Now try the actual user creation endpoint
      const response = await fetch('/api/debug/user-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name || '',
        }),
      })

      // Log the raw response text first
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      let data = {}
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        console.log('Response was not valid JSON, treating as text error')
        data = { error: 'Invalid response format', details: responseText }
      }

      if (!response.ok) {
        console.error('Signup failed with status:', response.status)
        console.error('Signup failed with data:', data)
        console.error('Raw response text:', responseText)
        
        // Try to get more details from the response
        let errorMessage = 'Failed to create account'
        if (data && typeof data === 'object' && data !== null) {
          const errorData = data as any
          if (errorData.details) {
            errorMessage = errorData.details
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        }
        
        return { 
          error: { 
            message: errorMessage,
            details: data,
            status: response.status
          } 
        }
      }

      // If we get here, user was created successfully
      // With standard auth flow, user needs to verify email
      return { error: null, userCreated: true, needsEmailVerification: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        error: { 
          message: 'Network error. Please try again.' 
        } 
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google OAuth with redirect:', `${window.location.origin}/auth/callback`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      console.log('OAuth response:', { data, error })
      
      if (error) {
        console.error('OAuth error:', error)
        return { error }
      }
      
      console.log('OAuth initiated successfully')
      return { error: null }
    } catch (error) {
      console.error('Unexpected error in signInWithGoogle:', error)
      return { error: { message: 'Failed to initiate Google sign-in' } }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }
}
