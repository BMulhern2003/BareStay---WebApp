'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import { ROOM_AMENITIES } from '@/types/onboarding'

// Application Details Modal Component
function ApplicationDetailsModal({ application, onClose }: { application: any, onClose: () => void }) {
  const [currentRoomTypeIndex, setCurrentRoomTypeIndex] = useState(0)
  
  const roomTypes = application.room_types || []
  const currentRoomType = roomTypes[currentRoomTypeIndex] || roomTypes[0]
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'approved'
        ? 'bg-green-100 text-green-800'
        : status === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {application.hotel_name}
            </h3>
            <p className="text-sm text-gray-700">
              Submitted {new Date(application.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={application.status} />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 7-Day Review Disclaimer */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Review Process</h4>
              <p className="text-sm text-blue-700 mt-1">
                Applications are reviewed by our team and can take up to 7 business days. 
                You will be notified via email once your application has been reviewed.
              </p>
            </div>
          </div>
        </div>

        {/* Room Type Navigation */}
        {roomTypes.length > 1 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-1 overflow-x-auto">
              {roomTypes.map((roomType: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentRoomTypeIndex(index)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                    currentRoomTypeIndex === index
                      ? 'bg-[var(--color-brand)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {roomType.name || `Room Type ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Application Content */}
        <div className="px-6 py-3 space-y-4">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Hotel Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 font-medium">Hotel Name:</p>
                <p className="font-semibold text-gray-900">{application.hotel_name}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Total Room Types:</p>
                <p className="font-semibold text-gray-900">{application.number_of_room_types || roomTypes.length}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Total Rooms:</p>
                <p className="font-semibold text-gray-900">{application.total_number_of_rooms || '—'}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Application Status:</p>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>

          {/* Current Room Type Details */}
          {currentRoomType && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  {currentRoomType.name || `Room Type ${currentRoomTypeIndex + 1}`} Details
                </h4>
                
                {/* Room Type Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Number of Rooms</p>
                    <p className="text-lg font-semibold text-gray-900">{currentRoomType.number_of_rooms || currentRoomType.numberOfRooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Price per Night</p>
                    <p className="text-lg font-semibold text-gray-900">${currentRoomType.price_per_night || currentRoomType.pricePerNight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Max Occupancy</p>
                    <p className="text-lg font-semibold text-gray-900">{currentRoomType.max_occupancy || currentRoomType.maxOccupancy} guests</p>
                  </div>
                </div>

                {/* Room Images */}
                {currentRoomType.images && currentRoomType.images.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-md font-medium text-gray-900 mb-2">Room Images</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {currentRoomType.images.map((image: any, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url || image}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room Amenities */}
                {currentRoomType.amenities && currentRoomType.amenities.length > 0 && (
                  <div>
                    <h5 className="text-md font-medium text-gray-900 mb-2">Room Amenities</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {currentRoomType.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviewer Note */}
          {application.note && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h5 className="text-sm font-medium text-yellow-800 mb-1">Reviewer Note:</h5>
              <p className="text-sm text-yellow-700">{application.note}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[var(--color-brand)] text-white rounded-md hover:bg-[var(--color-brand-600)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: profile?.email || ''
  })

  // Provider Applications state
  const [applications, setApplications] = useState<any[]>([])
  const [appsLoading, setAppsLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<any | null>(null)

  // Fetch provider applications
  useEffect(() => {
    if (!user?.id) return
    let mounted = true
    setAppsLoading(true)
    
    fetch(`/api/provider-applications?userId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        if (!mounted) return
        setApplications(d.success ? (d.applications || []) : [])
      })
      .catch(() => mounted && setApplications([]))
      .finally(() => mounted && setAppsLoading(false))
    
    return () => { mounted = false }
  }, [user?.id])

  // Normalize application data (handles different API response formats)
  const normalizeApp = (app: any) => {
    const data = app.application_data || app
    return {
      id: app.id,
      status: (app.status || data.status || 'pending') as 'approved' | 'pending' | 'rejected',
      created_at: app.created_at,
      updated_at: app.updated_at,
      hotel_name: data.hotel_name || 'Provider Application',
      note: data.review_note || app.review_note || null,
      number_of_room_types: data.number_of_room_types,
      total_number_of_rooms: data.total_number_of_rooms,
      room_types: data.room_types
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'approved'
        ? 'bg-green-100 text-green-800'
        : status === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
          <a 
            href="/auth/signin" 
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Profile</h1>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    // TODO: Implement profile update
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      email: profile.email || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg mb-8 mt-4">
          <div className="mt-12 px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profile.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.full_name || 'User'}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.role === 'ADMIN' 
                      ? 'bg-red-100 text-red-800' 
                      : profile.role === 'HOTEL_MANAGER'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {profile.role}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.is_verified 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              
              {/* Edit Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              </div>
              <div className="px-6 py-4 space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Applications Section */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Provider Applications</h2>
                <a 
                  href="/become-provider" 
                  className="text-sm text-[var(--color-brand)] hover:underline"
                >
                  New Application
                </a>
              </div>
              <div className="px-6 py-4">
                {appsLoading ? (
                  <div className="py-8 text-center text-gray-500 text-sm">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="py-8 text-center text-gray-600 text-sm">
                    You have no provider applications yet. Start one from the "New Application" link above.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {applications.map((app) => {
                      const a = normalizeApp(app)
                      return (
                        <li key={a.id}>
                          <button
                            onClick={() => setSelectedApp(a)}
                            className="w-full text-left flex items-center justify-between py-3 hover:bg-gray-50 rounded-md px-2 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{a.hotel_name}</p>
                              <p className="text-xs text-gray-500">
                                Submitted {new Date(a.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <StatusBadge status={a.status} />
                              <span className="text-gray-400 text-lg">›</span>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Last Updated */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <p className="text-xs text-gray-500 font-mono break-all">
                    {profile.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <a
                  href="/bookings"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  View My Bookings
                </a>
                <a
                  href="/hotels"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Browse Hotels
                </a>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Application Details Modal */}
        {selectedApp && (
          <ApplicationDetailsModal 
            application={selectedApp} 
            onClose={() => setSelectedApp(null)} 
          />
        )}
      </div>
    </div>
  )
}
