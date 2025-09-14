'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error, userCreated, needsEmailVerification } = await signUp(email, password, name)
    
    if (error) {
      setError(error.message)
    } else if (userCreated && needsEmailVerification) {
      setMessage('Account created successfully! Please check your email and click the verification link to activate your account.')
      // Clear the form
      setEmail('')
      setPassword('')
      setName('')
    } else if (userCreated) {
      setMessage('Account created successfully! You can now sign in.')
      // Clear the form
      setEmail('')
      setPassword('')
      setName('')
    } else {
      setMessage('Check your email for the confirmation link!')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <main className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Sign Up
          </h2>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              {message && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800 text-sm">{message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#e4b778] focus:border-[#e4b778]"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#e4b778] focus:border-[#e4b778]"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#e4b778] focus:border-[#e4b778]"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e4b778] hover:bg-[#d9a85c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e4b778] disabled:bg-gray-300"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="font-medium text-[#e4b778] hover:text-[#d9a85c] underline hover:no-underline transition-all duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
        </div>
      </main>
    </div>
  )
}