'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  ProgressIndicator,
  StepOne,
  StepTwo,
  StepThree
} from '@/modules/portal/pages'
import type {
  PersonalInfo,
  Interests,
  Notifications,
  CompleteOnboarding
} from '@/modules/portal/lib/validations'
import { LogoRender } from '@/components/app/miscellaneous/logo-render'
import {
  insertUserData,
  insertInterestsAndNotifications
} from '@/services/user.services'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
import { LoadingAbsolute } from '@/components/app/miscellaneous/loading-absolute'

const STORAGE_KEY = 'eventify-onboarding-progress'

const stepTitles = ['Perfil', 'Intereses', 'Configuración']

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<
    Partial<CompleteOnboarding>
  >({
    first_name: '',
    last_name: '',
    profile_image: '',
    birth_date: '',
    country: '',
    phone: '',
    interests: [],
    eventTypes: [],
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    weeklyDigest: false,
    profileVisibility: 'public',
    showLocation: false
  })

  const router = useRouter()

  // Cargar progreso guardado al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOnboardingData(parsed.data || {})
        setCurrentStep(parsed.currentStep || 1)
        toast.info(
          <ToastCustom
            title="Progreso restaurado"
            description="Has vuelto a cargar tu progreso guardado."
          />
        )
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
  }

  const handleStepTwoNext = (data: Interests) => {
    const updatedData = { ...onboardingData, ...data }
    setOnboardingData(updatedData)
    setCurrentStep(3)
    saveProgress(updatedData, 3)
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

  const handleStepThreeNext = async (data: Notifications) => {
    setLoading(true)
    const completeData = { ...onboardingData, ...data }
    setOnboardingData(completeData)

    try {
      // Guardar datos personales
      await insertUserData({
        username: completeData.username || '',
        birth_date: completeData.birth_date || '',
        first_name: completeData.first_name || '',
        last_name: completeData.last_name || '',
        profile_image: completeData.profile_image || '',
        country: completeData.country || '',
        phone: completeData.phone || ''
      })
      // Guardar intereses y notificaciones
      await insertInterestsAndNotifications(
        {
          interests: completeData.interests || [],
          eventTypes: completeData.eventTypes || []
        },
        {
          emailNotifications: completeData.emailNotifications ?? true,
          pushNotifications: completeData.pushNotifications ?? true,
          eventReminders: completeData.eventReminders ?? true,
          weeklyDigest: completeData.weeklyDigest ?? false,
          profileVisibility: completeData.profileVisibility || 'public',
          showLocation: completeData.showLocation ?? false
        }
      )

      // Limpiar el progreso guardado
      localStorage.removeItem(STORAGE_KEY)

      toast.success(
        <ToastCustom
          title="¡Onboarding completado! Bienvenido a Eventify"
          description="Tu perfil ha sido configurado exitosamente."
        />
      )

      // Simular redirección a la app principal
      setTimeout(() => {
        toast.info(
          <ToastCustom
            title="Redirigiendo a la aplicación principal"
            description="Por favor espera un momento."
          />
        )
        router.push(APP_URL.DASHBOARD.BASE)
      }, 2000)
    } catch (error) {
      toast.error(
        <ToastCustom
          title="Error al completar el onboarding"
          description="Por favor intenta nuevamente."
        />
      )
      console.error('Error saving user profile:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-8 w-full">
            <div className="mb-2">
              <LogoRender href="#" size={220} />
            </div>
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
          <div className="grid grid-cols-1 gap-8">
            {/* Steps */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <StepOne
                  data={{
                    username: onboardingData.username || '',
                    first_name: onboardingData.first_name || '',
                    last_name: onboardingData.last_name || '',
                    profile_image: onboardingData.profile_image || '',
                    country: onboardingData.country || '',
                    birth_date: onboardingData.birth_date || '',
                    phone: onboardingData.phone || ''
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
                  disableNext={loading}
                  onNext={handleStepThreeNext}
                  onBack={handleBack}
                  onSkip={handleSkip}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <LoadingAbsolute show={loading} label="Configurando espacio ..." />
    </div>
  )
}
