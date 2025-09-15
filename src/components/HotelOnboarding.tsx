'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { OnboardingFormData, OnboardingStep, HotelBasicInfo, RoomSetup, RoomTypeDetail } from '@/types/onboarding'
import BasicInfoStep from './onboarding/BasicInfoStep'
import RoomSetupStep from './onboarding/RoomSetupStep'
import RoomTypeDetailsStep from './onboarding/RoomTypeDetailsStep'
import ReviewSubmitStep from './onboarding/ReviewSubmitStep'

const STEPS: OnboardingStep[] = [
  { id: 1, title: 'Basic Info', description: 'Hotel details and contact information', isComplete: false },
  { id: 2, title: 'Room Setup', description: 'Room types and hotel amenities', isComplete: false },
  { id: 3, title: 'Room Details', description: 'Detailed room type information', isComplete: false },
  { id: 4, title: 'Review & Submit', description: 'Review and submit your application', isComplete: false },
]

const DRAFT_STORAGE_KEY = 'hotel_onboarding_draft'

export default function HotelOnboarding() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState(STEPS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    basicInfo: {
      name: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phone: '',
      email: '',
      description: '',
    },
    roomSetup: {
      numberOfRoomTypes: 1,
      totalNumberOfRooms: 1,
      amenities: [],
    },
    roomTypes: [],
  })

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup')
    }
  }, [user, loading, router])

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        if (parsedDraft.formData) {
          setFormData(parsedDraft.formData)
        }
        setCurrentStep(parsedDraft.currentStep || 1)
        
        // Update step completion status
        const updatedSteps = STEPS.map(step => ({
          ...step,
          isComplete: parsedDraft.completedSteps?.includes(step.id) || false
        }))
        setSteps(updatedSteps)
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  // Save draft to localStorage
  const saveDraft = (data: OnboardingFormData, step: number) => {
    const completedSteps = steps.filter(s => s.isComplete).map(s => s.id)
    const draftData = {
      formData: data,
      currentStep: step,
      completedSteps,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData))
  }

  const updateFormData = (stepData: Partial<OnboardingFormData>) => {
    const newFormData = { ...formData, ...stepData }
    setFormData(newFormData)
    saveDraft(newFormData, currentStep)
  }

  const markStepComplete = (stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isComplete: true } : step
    ))
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        const { basicInfo } = formData
        return !!(
          basicInfo.name &&
          basicInfo.street &&
          basicInfo.city &&
          basicInfo.state &&
          basicInfo.country &&
          basicInfo.zipCode &&
          basicInfo.phone &&
          basicInfo.email &&
          basicInfo.description
        )
      case 2:
        const { roomSetup } = formData
        return !!(
          roomSetup.numberOfRoomTypes > 0 &&
          roomSetup.totalNumberOfRooms > 0
        )
      case 3:
        return formData.roomTypes.length === formData.roomSetup.numberOfRoomTypes &&
               formData.roomTypes.every(room => 
                 room.name &&
                 room.numberOfRooms > 0 &&
                 room.pricePerNight > 0 &&
                 room.maxOccupancy > 0 &&
                 room.images.length > 0
               )
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      markStepComplete(currentStep)
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
        saveDraft(formData, currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      saveDraft(formData, currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/provider-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Clear draft after successful submission
        localStorage.removeItem(DRAFT_STORAGE_KEY)
        router.push('/profile?success=application-submitted')
      } else {
        console.error('Submission failed:', result)
        throw new Error(result.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Become a Hotel Provider</h1>
              <p className="mt-2 text-gray-600">Join our platform and start hosting guests</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="px-6 py-6 border-b border-gray-200">
            <nav aria-label="Onboarding progress" role="navigation">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${currentStep === step.id 
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white' 
                      : step.isComplete
                        ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }
                  `}>
                    {step.isComplete ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="ml-4 min-w-0 flex-1">
                    <p className={`text-sm font-medium ${
                      currentStep === step.id ? 'text-[var(--color-brand)]' : step.isComplete ? 'text-[var(--color-brand)]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block w-16 h-0.5 bg-gray-200 mx-4" />
                  )}
                </div>
              ))}
              </div>
            </nav>
          </div>

          {/* Step Content */}
          <div className="px-6 py-8">
            {currentStep === 1 && (
              <BasicInfoStep
                data={formData.basicInfo}
                onUpdate={(basicInfo: HotelBasicInfo) => updateFormData({ basicInfo })}
              />
            )}
            {currentStep === 2 && (
              <RoomSetupStep
                data={formData.roomSetup}
                onUpdate={(roomSetup: RoomSetup) => updateFormData({ roomSetup })}
              />
            )}
            {currentStep === 3 && (
              <RoomTypeDetailsStep
                data={formData.roomTypes}
                numberOfRoomTypes={formData.roomSetup.numberOfRoomTypes}
                onUpdate={(roomTypes: RoomTypeDetail[]) => updateFormData({ roomTypes })}
              />
            )}
            {currentStep === 4 && (
              <ReviewSubmitStep
                data={formData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className={`px-6 py-2 rounded-md text-sm font-medium ${
                  validateCurrentStep()
                    ? 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateCurrentStep()}
                className={`px-6 py-2 rounded-md text-sm font-medium ${
                  isSubmitting || !validateCurrentStep()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)]'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
