'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling OAuth callback...')
        console.log('Current URL:', window.location.href)
        console.log('URL search params:', window.location.search)
        
        // Check for OAuth errors in URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (error) {
          console.error('OAuth error in URL:', { error, errorDescription })
          router.push(`/auth/signin?error=oauth_${error}&details=${encodeURIComponent(errorDescription || '')}`)
          return
        }
        
        // Handle the OAuth callback
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session data:', data)
        console.log('Session error:', sessionError)
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError)
          router.push('/auth/signin?error=auth_failed')
          return
        }

        if (data.session?.user) {
          console.log('User authenticated:', data.session.user.email)
          
          // Check if user profile exists, if not create it
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          console.log('Profile check result:', { profile, profileError })

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            console.log('Creating new profile for user:', data.session.user.id)
            
            const profileData = {
              id: data.session.user.id,
              email: data.session.user.email!,
              full_name: data.session.user.user_metadata?.full_name || 
                        data.session.user.user_metadata?.name ||
                        data.session.user.email?.split('@')[0] || 'User'
            }
            
            console.log('Profile data to insert:', profileData)
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(profileData)

            if (insertError) {
              console.error('Profile creation error:', insertError)
              router.push('/auth/signin?error=profile_creation_failed')
              return
            }
            
            console.log('Profile created successfully')
          } else if (profileError) {
            console.error('Profile fetch error:', profileError)
            router.push('/auth/signin?error=profile_fetch_failed')
            return
          } else {
            console.log('Profile already exists')
          }

          // Redirect to hotels page (main app)
          console.log('Redirecting to hotels page...')
          // Small delay to ensure session is properly established
          setTimeout(() => {
            router.push('/hotels')
          }, 100)
        } else {
          console.log('No session found, redirecting to signin')
          router.push('/auth/signin?error=no_session')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/auth/signin?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4b778] mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
        <p className="mt-2 text-sm text-gray-500">You will be redirected shortly</p>
      </div>
    </div>
  )
}
