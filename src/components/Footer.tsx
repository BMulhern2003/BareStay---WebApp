'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--color-brand)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-[var(--color-brand)]">
                BareStay
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Premium stays and experiences, thoughtfully curated for your next adventure.
            </p>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/safety" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Safety Information
                </Link>
              </li>
              <li>
                <Link 
                  href="/cancellation" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/become-provider" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link 
                  href="/experiences" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Host an Experience
                </Link>
              </li>
              <li>
                <Link 
                  href="/referrals" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Refer a Friend
                </Link>
              </li>
              <li>
                <Link 
                  href="/community" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/press" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 hover:text-[var(--color-brand)] transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
              <span>© 2024 BareStay, Inc.</span>
              <div className="flex items-center gap-4">
                <Link 
                  href="/privacy" 
                  className="hover:text-[var(--color-brand)] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="hover:text-[var(--color-brand)] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/cookies" 
                  className="hover:text-[var(--color-brand)] transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Follow us:</span>
              <div className="flex items-center gap-3">
                <a 
                  href="#" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281h-1.281v1.281h1.281V7.707zm-3.323 1.281c-2.026 0-3.323 1.297-3.323 3.323s1.297 3.323 3.323 3.323 3.323-1.297 3.323-3.323-1.297-3.323-3.323-3.323z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
