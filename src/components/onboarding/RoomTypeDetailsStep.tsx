'use client'

import { useState, useRef, useEffect } from 'react'
import { RoomTypeDetail, ROOM_AMENITIES } from '@/types/onboarding'

interface RoomTypeDetailsStepProps {
  data: RoomTypeDetail[]
  numberOfRoomTypes: number
  onUpdate: (data: RoomTypeDetail[]) => void
}

export default function RoomTypeDetailsStep({ 
  data, 
  numberOfRoomTypes, 
  onUpdate 
}: RoomTypeDetailsStepProps) {
  const [currentRoomTypeIndex, setCurrentRoomTypeIndex] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Initialize room types if needed
  const initializeRoomTypes = () => {
    if (data.length < numberOfRoomTypes) {
      const newRoomTypes: RoomTypeDetail[] = []
      for (let i = 0; i < numberOfRoomTypes; i++) {
        if (data[i]) {
          newRoomTypes.push(data[i])
        } else {
          newRoomTypes.push({
            id: `room-type-${i + 1}`,
            name: '',
            numberOfRooms: 1,
            pricePerNight: 0,
            maxOccupancy: 1,
            images: [],
            imagePreviewUrls: [],
            amenities: [],
          })
        }
      }
      onUpdate(newRoomTypes)
      return newRoomTypes
    }
    return data
  }

  const roomTypes = initializeRoomTypes()
  const currentRoomType = roomTypes[currentRoomTypeIndex] || roomTypes[0]

  // Cleanup object URLs when component unmounts or room type changes
  useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      currentRoomType.imagePreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [currentRoomTypeIndex])

  const updateCurrentRoomType = (updates: Partial<RoomTypeDetail>) => {
    const updatedRoomTypes = roomTypes.map((room, index) =>
      index === currentRoomTypeIndex ? { ...room, ...updates } : room
    )
    onUpdate(updatedRoomTypes)
  }

  const handleFieldChange = (field: keyof RoomTypeDetail, value: string | number) => {
    updateCurrentRoomType({ [field]: value })
  }

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = currentRoomType.amenities.includes(amenity)
      ? currentRoomType.amenities.filter(a => a !== amenity)
      : [...currentRoomType.amenities, amenity]
    
    updateCurrentRoomType({ amenities: updatedAmenities })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const newImages = [...currentRoomType.images, ...files]
    const newPreviewUrls = [...currentRoomType.imagePreviewUrls]

    files.forEach(file => {
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      newPreviewUrls.push(url)
    })

    updateCurrentRoomType({
      images: newImages,
      imagePreviewUrls: newPreviewUrls,
    })

    // Clear the input so the same file can be selected again
    event.target.value = ''
  }

  const removeImage = (index: number) => {
    const newImages = currentRoomType.images.filter((_, i) => i !== index)
    const newPreviewUrls = currentRoomType.imagePreviewUrls.filter((_, i) => i !== index)
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(currentRoomType.imagePreviewUrls[index])
    
    updateCurrentRoomType({
      images: newImages,
      imagePreviewUrls: newPreviewUrls,
    })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    
    // Use the full container as drag image (no preview)
    const container = e.currentTarget as HTMLElement
    e.dataTransfer.setDragImage(container, container.offsetWidth / 2, container.offsetHeight / 2)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newImages = [...currentRoomType.images]
    const newPreviewUrls = [...currentRoomType.imagePreviewUrls]

    // Remove dragged item
    const draggedImage = newImages.splice(draggedIndex, 1)[0]
    const draggedUrl = newPreviewUrls.splice(draggedIndex, 1)[0]

    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage)
    newPreviewUrls.splice(dropIndex, 0, draggedUrl)

    updateCurrentRoomType({
      images: newImages,
      imagePreviewUrls: newPreviewUrls,
    })

    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Create a reordered array for display that shows live preview
  const getDisplayOrder = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      return currentRoomType.imagePreviewUrls.map((url, index) => ({ url, originalIndex: index }))
    }

    const items = currentRoomType.imagePreviewUrls.map((url, index) => ({ url, originalIndex: index }))
    const draggedItem = items[draggedIndex]
    
    // Remove dragged item
    items.splice(draggedIndex, 1)
    
    // Insert at hover position
    items.splice(dragOverIndex, 0, draggedItem)
    
    return items
  }

  const isCurrentRoomValid = () => {
    return !!(
      currentRoomType.name &&
      currentRoomType.numberOfRooms > 0 &&
      currentRoomType.pricePerNight > 0 &&
      currentRoomType.maxOccupancy > 0 &&
      currentRoomType.images.length > 0
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Type Details</h2>
        <p className="text-gray-600 mb-6">
          Configure each room type with detailed information and images.
        </p>
      </div>

      {/* Room Type Navigation */}
      {numberOfRoomTypes > 1 && (
        <div className="border-b border-gray-200 pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {Array.from({ length: numberOfRoomTypes }, (_, index) => {
              const roomType = roomTypes[index]
              const isValid = roomType && !!(
                roomType.name &&
                roomType.numberOfRooms > 0 &&
                roomType.pricePerNight > 0 &&
                roomType.maxOccupancy > 0 &&
                roomType.images.length > 0
              )
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentRoomTypeIndex(index)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                    currentRoomTypeIndex === index
                      ? 'bg-[var(--color-brand)] text-white'
                      : isValid
                        ? 'bg-[var(--color-brand)]/10 text-gray-700 hover:bg-[var(--color-brand)]/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Room Type {index + 1}
                  {isValid && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Current Room Type Form */}
      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Room Type {currentRoomTypeIndex + 1} Configuration
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Room Type Name */}
            <div>
              <label htmlFor="roomTypeName" className="block text-sm font-medium text-gray-700 mb-2">
                Room Type Name *
              </label>
              <input
                type="text"
                id="roomTypeName"
                value={currentRoomType.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g., Deluxe Suite, Standard Room, Presidential Suite"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                required
              />
            </div>

            {/* Room Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="text"
                  id="numberOfRooms"
                  value={currentRoomType.numberOfRooms === 0 ? '' : currentRoomType.numberOfRooms}
                  placeholder="e.g., 10"
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow digits and empty string
                    if (value === '' || /^\d+$/.test(value)) {
                      handleFieldChange('numberOfRooms', value === '' ? 0 : parseInt(value) || 0)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night ($) *
                </label>
                <input
                  type="text"
                  id="pricePerNight"
                  value={currentRoomType.pricePerNight === 0 ? '' : currentRoomType.pricePerNight}
                  placeholder="e.g., 150"
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow digits and empty string
                    if (value === '' || /^\d+$/.test(value)) {
                      handleFieldChange('pricePerNight', value === '' ? 0 : parseInt(value) || 0)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxOccupancy" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Occupancy *
                </label>
                <input
                  type="text"
                  id="maxOccupancy"
                  value={currentRoomType.maxOccupancy === 0 ? '' : currentRoomType.maxOccupancy}
                  placeholder="e.g., 4"
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow digits and empty string
                    if (value === '' || /^\d+$/.test(value)) {
                      handleFieldChange('maxOccupancy', value === '' ? 0 : parseInt(value) || 0)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Images * (At least 6 required)
              </label>
              
              <div className="space-y-4">
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    ref={(el) => { fileInputRefs.current[currentRoomType.id] = el }}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[currentRoomType.id]?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)]"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Images
                  </button>
                  <p className="mt-1 text-xs text-gray-600">
                    Upload high-quality images of this room type. Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                {/* Image Preview Grid */}
                {currentRoomType.imagePreviewUrls.length > 0 ? (
                  <div className="space-y-4">
                    {/* Disclaimer */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Drag and drop images to reorder them. This will be the display order if your application is approved.
                      </p>
                    </div>
                    
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {getDisplayOrder().map((item, displayIndex) => {
                        const originalIndex = item.originalIndex
                        const url = item.url
                        const isDragged = draggedIndex === originalIndex
                        const isDropTarget = dragOverIndex === displayIndex && draggedIndex !== null
                        
                        return (
                          <div 
                            key={`${currentRoomType.id}-image-${originalIndex}-${url.slice(-10)}`} 
                            className={`relative group cursor-move border-2 border-dashed rounded-lg p-1 transition-all duration-200 ${
                              isDragged 
                                ? 'opacity-30 border-blue-400 bg-blue-50 scale-105' 
                                : isDropTarget
                                  ? 'border-blue-400 bg-blue-50 scale-102'
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, originalIndex)}
                            onDragOver={(e) => handleDragOver(e, displayIndex)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, displayIndex)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex items-center justify-center h-32">
                              <img
                                src={url}
                                alt={`Room preview ${originalIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onError={(e) => {
                                  // Handle broken image URLs (e.g., after server restart)
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(originalIndex)}
                              className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
                              aria-label={`Remove image ${originalIndex + 1}`}
                            >
                              ×
                            </button>
                            {/* Drag indicator */}
                            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {displayIndex + 1}
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Empty slots for visual reference */}
                      {Array.from({ length: Math.max(0, 4 - currentRoomType.imagePreviewUrls.length) }).map((_, index) => (
                        <div 
                          key={`empty-${index}`}
                          className="border-2 border-dashed border-gray-200 rounded-lg p-2 h-40 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                          onClick={() => fileInputRefs.current[currentRoomType.id]?.click()}
                        >
                          <div className="text-gray-400 text-center">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs">Click to add</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
                    <p className="text-xs text-gray-500">Upload at least 6 images to continue</p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Amenities */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Room Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROOM_AMENITIES.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={currentRoomType.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className={`p-4 rounded-lg border ${
          isCurrentRoomValid() 
            ? 'bg-[var(--color-brand)]/5 border-[var(--color-brand)]/20' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center">
            {isCurrentRoomValid() ? (
              <>
                <svg className="w-5 h-5 text-[var(--color-brand)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  Room Type {currentRoomTypeIndex + 1} is complete
                </span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-yellow-800">
                  Please complete all required fields for Room Type {currentRoomTypeIndex + 1}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        {numberOfRoomTypes > 1 && (
          <div className="bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-[var(--color-brand)] mb-2">Progress Summary</h4>
            <div className="text-sm text-gray-700">
              {roomTypes.filter(room => 
                room.name && room.numberOfRooms > 0 && room.pricePerNight > 0 && 
                room.maxOccupancy > 0 && room.images.length > 0
              ).length} of {numberOfRoomTypes} room types completed
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
