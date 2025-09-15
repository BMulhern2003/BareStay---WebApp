'use client'

import { HotelBasicInfo } from '@/types/onboarding'

interface BasicInfoStepProps {
  data: HotelBasicInfo
  onUpdate: (data: HotelBasicInfo) => void
}

export default function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
  const handleChange = (field: keyof HotelBasicInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Hotel Information</h2>
        <p className="text-gray-600 mb-6">Please provide the basic details about your hotel.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Hotel Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Name *
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your hotel name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
            required
            aria-describedby="name-help"
            aria-required="true"
          />
          <p id="name-help" className="mt-1 text-sm text-gray-500">
            Enter the official name of your hotel
          </p>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-medium text-gray-900">Hotel Address</h3>
          
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              value={data.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="New York"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State/Province *
              </label>
              <input
                type="text"
                id="state"
                value={data.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="NY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                value={data.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="United States"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                id="zipCode"
                value={data.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="10001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="hotel@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Hotel Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Description *
          </label>
          <textarea
            id="description"
            rows={4}
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your hotel, its unique features, location highlights, and what makes it special for guests..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide a compelling description that will attract potential guests.
          </p>
        </div>
      </div>
    </div>
  )
}
