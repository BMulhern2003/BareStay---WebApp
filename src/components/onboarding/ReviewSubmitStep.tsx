'use client'

import { OnboardingFormData } from '@/types/onboarding'

interface ReviewSubmitStepProps {
  data: OnboardingFormData
  onSubmit: () => void
  isSubmitting: boolean
}

export default function ReviewSubmitStep({ data, onSubmit, isSubmitting }: ReviewSubmitStepProps) {
  const { basicInfo, roomSetup, roomTypes } = data

  const totalRoomsConfigured = roomTypes.reduce((sum, room) => sum + room.numberOfRooms, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review all the information below before submitting your application.
        </p>
      </div>

      {/* Basic Information Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hotel Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Hotel Name:</span>
            <p className="text-gray-900">{basicInfo.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <p className="text-gray-900">{basicInfo.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-900">{basicInfo.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Address:</span>
            <p className="text-gray-900">
              {basicInfo.street}, {basicInfo.city}, {basicInfo.state} {basicInfo.zipCode}, {basicInfo.country}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <span className="font-medium text-gray-700">Description:</span>
          <p className="text-gray-900 mt-1">{basicInfo.description}</p>
        </div>
      </div>

      {/* Room Setup Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Room Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Room Types:</span>
            <p className="text-gray-900">{roomSetup.numberOfRoomTypes}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Rooms:</span>
            <p className="text-gray-900">{roomSetup.totalNumberOfRooms}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Configured Rooms:</span>
            <p className="text-gray-900">{totalRoomsConfigured}</p>
          </div>
        </div>
        
        {roomSetup.amenities.length > 0 && (
          <div className="mt-4">
            <span className="font-medium text-gray-700">Hotel Amenities:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {roomSetup.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room Types Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Room Types</h3>
          <div className="space-y-6">
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className="border-l-4 border-[var(--color-brand)] pl-4">
              <h4 className="font-medium text-gray-900 mb-2">{roomType.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Rooms:</span>
                  <p className="text-gray-900">{roomType.numberOfRooms}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Price/Night:</span>
                  <p className="text-gray-900">${roomType.pricePerNight}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Max Occupancy:</span>
                  <p className="text-gray-900">{roomType.maxOccupancy} guests</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Images:</span>
                  <p className="text-gray-900">{roomType.images.length} uploaded</p>
                </div>
              </div>
              
              {roomType.amenities.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium text-gray-700 text-sm">Amenities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {roomType.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {roomType.imagePreviewUrls.length > 0 ? (
                <div className="mt-3">
                  <span className="font-medium text-gray-700 text-sm">Images:</span>
                  <div className="flex space-x-2 mt-1 overflow-x-auto">
                    {roomType.imagePreviewUrls.slice(0, 4).map((url, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`${roomType.name} ${imgIndex + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-300 flex-shrink-0"
                        onError={(e) => {
                          // Handle broken image URLs
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ))}
                    {roomType.imagePreviewUrls.length > 4 && (
                      <div className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-500">
                          +{roomType.imagePreviewUrls.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <span className="font-medium text-gray-700 text-sm">Images:</span>
                  <div className="mt-1 text-sm text-gray-500">
                    {roomType.images.length} image{roomType.images.length !== 1 ? 's' : ''} uploaded
                    {roomType.images.length === 0 && ' (preview not available)'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Warnings */}
      {totalRoomsConfigured !== roomSetup.totalNumberOfRooms && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Room Count Mismatch</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You configured {totalRoomsConfigured} rooms but specified {roomSetup.totalNumberOfRooms} total rooms. 
                This discrepancy will be noted in your application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Application</h3>
        <div className="space-y-4">
          <div className="bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-[var(--color-brand)] mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your application will be reviewed by our team</li>
              <li>• We may contact you for additional information</li>
              <li>• Approval typically takes 3-5 business days</li>
              <li>• You&apos;ll receive an email notification about the status</li>
              <li>• Once approved, you can start managing your hotel listing</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg text-white font-medium ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[var(--color-brand)] hover:bg-[var(--color-brand-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Application...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By submitting this application, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
