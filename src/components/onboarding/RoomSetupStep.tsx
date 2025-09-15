'use client'

import { RoomSetup, HOTEL_AMENITIES } from '@/types/onboarding'

interface RoomSetupStepProps {
  data: RoomSetup
  onUpdate: (data: RoomSetup) => void
}

export default function RoomSetupStep({ data, onUpdate }: RoomSetupStepProps) {
  const handleNumberChange = (field: 'numberOfRoomTypes' | 'totalNumberOfRooms', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0
    onUpdate({
      ...data,
      [field]: numValue,
    })
  }

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = data.amenities.includes(amenity)
      ? data.amenities.filter(a => a !== amenity)
      : [...data.amenities, amenity]
    
    onUpdate({
      ...data,
      amenities: updatedAmenities,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Setup</h2>
        <p className="text-gray-600 mb-6">Configure your hotel&apos;s room structure and amenities.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Room Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numberOfRoomTypes" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Different Room Types *
            </label>
            <input
              type="number"
              id="numberOfRoomTypes"
              max="20"
              value={data.numberOfRoomTypes}
              onChange={(e) => handleNumberChange('numberOfRoomTypes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              e.g., Standard, Deluxe, Suite (max 20 types)
            </p>
          </div>

          <div>
            <label htmlFor="totalNumberOfRooms" className="block text-sm font-medium text-gray-700 mb-2">
              Total Number of Rooms *
            </label>
            <input
              type="number"
              id="totalNumberOfRooms"
              max="1000"
              value={data.totalNumberOfRooms}
              onChange={(e) => handleNumberChange('totalNumberOfRooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Total rooms across all types (max 1000)
            </p>
          </div>
        </div>

        {/* Hotel Amenities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hotel Amenities</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the amenities available at your hotel (optional but recommended)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {HOTEL_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        {(data.numberOfRoomTypes > 0 || data.totalNumberOfRooms > 0) && (
          <div className="bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-[var(--color-brand)] mb-2">Configuration Summary</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• {data.numberOfRoomTypes} different room type{data.numberOfRoomTypes !== 1 ? 's' : ''} to configure</p>
              <p>• {data.totalNumberOfRooms} total room{data.totalNumberOfRooms !== 1 ? 's' : ''} in your hotel</p>
              {data.amenities.length > 0 && (
                <p>• {data.amenities.length} amenity/amenities selected</p>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              You&apos;ll configure details for each room type in the next step.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
