'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect, useRef } from 'react'

export function Navigation() {
  const { user, profile, signOut } = useAuth()
  const { language, setLanguage, currency, setCurrency, t } = useLanguage()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const currencyMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Update shadow based on scroll position
      setIsScrolled(currentScrollY > 50)
    }

    // Set initial scroll state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted])

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setShowCurrencyMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLanguageMenu(false)
        setShowCurrencyMenu(false)
        setShowUserMenu(false)
      }
    }

    if (showLanguageMenu || showCurrencyMenu || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showLanguageMenu, showCurrencyMenu, showUserMenu])

  const handleLanguageSelect = (newLanguage: 'en' | 'th' | 'id') => {
    setLanguage(newLanguage)
    setShowLanguageMenu(false)
  }

  const handleCurrencySelect = (newCurrency: 'GBP' | 'THB' | 'IDR') => {
    setCurrency(newCurrency)
    setShowCurrencyMenu(false)
  }

  const getLanguageDisplayName = (lang: 'en' | 'th' | 'id') => {
    switch (lang) {
      case 'en':
        return t('lang.english')
      case 'th':
        return t('lang.thai')
      case 'id':
        return t('lang.indonesian')
      default:
        return t('lang.english')
    }
  }

  const getCurrencyDisplayName = (curr: 'GBP' | 'THB' | 'IDR') => {
    switch (curr) {
      case 'GBP':
        return t('currency.gbp')
      case 'THB':
        return t('currency.thb')
      case 'IDR':
        return t('currency.idr')
      default:
        return t('currency.gbp')
    }
  }

  const getCurrencySymbol = (curr: 'GBP' | 'THB' | 'IDR') => {
    switch (curr) {
      case 'GBP':
        return '£'
      case 'THB':
        return '฿'
      case 'IDR':
        return 'Rp'
      default:
        return '£'
    }
  }

  const getDisplayName = (fullName: string | null | undefined, email: string) => {
    if (fullName) {
      // Use full name if available
      return fullName
    }
    // Fallback to email if no full name
    return email
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-gray-100 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between transition-all duration-200 ${
          isMounted && isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/hotels" className="flex items-center gap-2">
              <div className={`bg-[var(--color-brand)] rounded-full flex items-center justify-center transition-all duration-200 ${
                isMounted && isScrolled ? 'w-6 h-6' : 'w-8 h-8'
              }`}>
                <span className={`text-white font-bold transition-all duration-200 ${
                  isMounted && isScrolled ? 'text-xs' : 'text-sm'
                }`}>B</span>
              </div>
              <span className={`font-bold text-[var(--color-brand)] transition-all duration-200 ${
                isMounted && isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                BareStay
              </span>
            </Link>
          </div>

          {/* Center Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/hotels"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {t('nav.hotels')}
            </Link>

            <Link
              href="/properties"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-200 relative"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('nav.properties')}
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>

            <Link
              href="/become-provider"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-200 relative"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {t('nav.become_provider')}
            </Link>
          </div>

          {/* Right Side User Menu */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector - Always Visible */}
            <div className="relative" ref={currencyMenuRef}>
              <button 
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <span className="text-lg font-semibold text-gray-700">
                  {getCurrencySymbol(currency)}
                </span>
                <span className="text-xs text-gray-600 hidden sm:block">
                  {getCurrencyDisplayName(currency)}
                </span>
              </button>

              {/* Currency Dropdown Menu */}
              {showCurrencyMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => handleCurrencySelect('GBP')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      currency === 'GBP' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">£</span>
                      <span>{t('currency.gbp')}</span>
                    </div>
                    {currency === 'GBP' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleCurrencySelect('THB')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      currency === 'THB' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">฿</span>
                      <span>{t('currency.thb')}</span>
                    </div>
                    {currency === 'THB' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleCurrencySelect('IDR')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      currency === 'IDR' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">Rp</span>
                      <span>{t('currency.idr')}</span>
                    </div>
                    {currency === 'IDR' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector - Always Visible */}
            <div className="relative" ref={languageMenuRef}>
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="text-xs text-gray-600 hidden sm:block">
                  {getLanguageDisplayName(language)}
                </span>
              </button>

              {/* Language Dropdown Menu */}
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      language === 'en' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{t('lang.english')}</span>
                    {language === 'en' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('th')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      language === 'th' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{t('lang.thai')}</span>
                    {language === 'th' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('id')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      language === 'id' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{t('lang.indonesian')}</span>
                    {language === 'id' && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Dropdown Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-full border border-gray-300 hover:shadow-md hover:bg-gray-200 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {getDisplayName(profile?.full_name, user.email || '')}
                      </div>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t('nav.my_bookings')}
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t('nav.profile')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={async () => {
                          try {
                            const { error } = await signOut()
                            if (error) {
                              console.error('Sign out error:', error)
                            }
                            setShowUserMenu(false)
                          } catch (error) {
                            console.error('Sign out error:', error)
                            setShowUserMenu(false)
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('nav.sign_out')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Sign In and Sign Up buttons for non-authenticated users */}
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('nav.sign_in')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#e4b778] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d9a85c] transition-colors"
                >
                  {t('nav.sign_up')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
