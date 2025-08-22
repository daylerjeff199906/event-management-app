'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  ProgressIndicator,
  StepOne,
  StepTwo,
  ProfilePreview,
  StepThree
} from '@/modules/portal/pages'
import type {
  PersonalInfo,
  Interests,
  Notifications,
  CompleteOnboarding
} from '@/modules/portal/lib/validations'

const STORAGE_KEY = 'eventify-onboarding-progress'

const stepTitles = ['Perfil', 'Intereses', 'Configuración']

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<
    Partial<CompleteOnboarding>
  >({
    firstName: '',
    lastName: '',
    profileImage: '',
    interests: [],
    eventTypes: [],
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    weeklyDigest: false,
    profileVisibility: 'public',
    showLocation: false
  })

  // Cargar progreso guardado al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOnboardingData(parsed.data || {})
        setCurrentStep(parsed.currentStep || 1)
        toast.info('Progreso restaurado desde donde lo dejaste')
      } catch (error) {
        console.error('Error loading saved progress:', error)
      }
    }
  }, [])

  // Guardar progreso automáticamente
  const saveProgress = (data: Partial<CompleteOnboarding>, step: number) => {
    const progressData = {
      data,
      currentStep: step,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData))
  }

  const handleStepOneNext = (data: PersonalInfo) => {
    const updatedData = { ...onboardingData, ...data }
    setOnboardingData(updatedData)
    setCurrentStep(2)
    saveProgress(updatedData, 2)
    toast.success('Información personal guardada')
  }

  const handleStepTwoNext = (data: Interests) => {
    const updatedData = { ...onboardingData, ...data }
    setOnboardingData(updatedData)
    setCurrentStep(3)
    saveProgress(updatedData, 3)
    toast.success('Intereses guardados')
  }

  const handleStepThreeNext = async (data: Notifications) => {
    const completeData = { ...onboardingData, ...data }
    setOnboardingData(completeData)

    try {
      // Aquí enviarías los datos a tu API/Supabase
      // await saveUserProfile(completeData)

      // Limpiar el progreso guardado
      localStorage.removeItem(STORAGE_KEY)

      toast.success('¡Onboarding completado! Bienvenido a Eventify')

      // Simular redirección a la app principal
      setTimeout(() => {
        // window.location.href = "/dashboard"
        toast.info('Redirigiendo a la aplicación principal...')
      }, 2000)
    } catch (error) {
      toast.error('Error al completar el onboarding. Inténtalo de nuevo.')
      console.error('Error saving user profile:', error)
    }
  }

  const handleSkip = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      saveProgress(onboardingData, nextStep)
      toast.info(`Paso ${currentStep} omitido`)
    } else {
      // Omitir el último paso
      handleStepThreeNext({
        emailNotifications: true,
        pushNotifications: true,
        eventReminders: true,
        weeklyDigest: false,
        profileVisibility: 'public',
        showLocation: false
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      saveProgress(onboardingData, prevStep)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Eventify</h1>
            <p className="text-muted-foreground">
              Configura tu perfil en solo unos minutos
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={3}
            stepTitles={stepTitles}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <StepOne
                  data={{
                    firstName: onboardingData.firstName || '',
                    lastName: onboardingData.lastName || '',
                    profileImage: onboardingData.profileImage || ''
                  }}
                  onNext={handleStepOneNext}
                  onSkip={handleSkip}
                />
              )}

              {currentStep === 2 && (
                <StepTwo
                  data={{
                    interests: onboardingData.interests || [],
                    eventTypes: onboardingData.eventTypes || []
                  }}
                  onNext={handleStepTwoNext}
                  onBack={handleBack}
                  onSkip={handleSkip}
                />
              )}

              {currentStep === 3 && (
                <StepThree
                  data={{
                    emailNotifications:
                      onboardingData.emailNotifications ?? true,
                    pushNotifications: onboardingData.pushNotifications ?? true,
                    eventReminders: onboardingData.eventReminders ?? true,
                    weeklyDigest: onboardingData.weeklyDigest ?? false,
                    profileVisibility:
                      onboardingData.profileVisibility || 'public',
                    showLocation: onboardingData.showLocation ?? false
                  }}
                  onNext={handleStepThreeNext}
                  onBack={handleBack}
                  onSkip={handleSkip}
                />
              )}
            </div>

            {/* Profile Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ProfilePreview data={onboardingData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
