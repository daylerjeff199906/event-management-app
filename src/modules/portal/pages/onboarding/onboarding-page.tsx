'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  ProgressIndicator,
  StepOne,
  StepTwo,
  StepThree,
  CompletionScreen
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
  insertInterestsAndNotifications,
  completeOnboarding
} from '@/services/user.services'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
import { LoadingAbsolute } from '@/components/app/miscellaneous/loading-absolute'

const STORAGE_KEY = 'eventify-onboarding-progress'

interface OnboardingPageProps {
  email?: string
  photoURL?: string
}

export const OnboardingPage = (props: OnboardingPageProps) => {
  const { email, photoURL } = props
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
    email_notifications: true,
    push_notifications: true,
    event_reminders: true,
    weekly_digest: false,
    profile_visibility: 'public',
    show_location: false
  })

  const router = useRouter()

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
      await insertUserData({
        username: email || '',
        birth_date: completeData.birth_date || '',
        first_name: completeData.first_name || '',
        last_name: completeData.last_name || '',
        profile_image: photoURL || '',
        country: completeData.country || '',
        phone: completeData.phone || ''
      })

      await insertInterestsAndNotifications(
        {
          interests: completeData.interests || [],
          eventTypes: completeData.eventTypes || []
        },
        {
          email_notifications: completeData.email_notifications ?? true,
          push_notifications: completeData.push_notifications ?? true,
          event_reminders: completeData.event_reminders ?? true,
          weekly_digest: completeData.weekly_digest ?? false,
          profile_visibility: completeData.profile_visibility || 'public',
          show_location: completeData.show_location ?? false
        }
      )

      await completeOnboarding()

      localStorage.removeItem(STORAGE_KEY)

      toast.success(
        <ToastCustom
          title="¡Onboarding completado! Bienvenido a Eventify"
          description="Tu perfil ha sido configurado exitosamente."
        />
      )
      setCurrentStep(4)
      setTimeout(() => {
        toast.info(
          <ToastCustom
            title="Redirigiendo a la aplicación principal"
            description="Por favor espera un momento."
          />
        )
        router.replace(APP_URL.DASHBOARD.BASE)
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
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        {/* Header Logo */}
        <div className="mb-14">
          <LogoRender href="#" size={200} />
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={3}
        />

        {/* Steps Content */}
        <div className="w-full">
          {currentStep === 1 && (
            <StepOne
              data={{
                first_name: onboardingData.first_name || '',
                last_name: onboardingData.last_name || '',
                profile_image: onboardingData.profile_image || '',
                country: onboardingData.country || '',
                birth_date: onboardingData.birth_date || '',
                phone: onboardingData.phone || ''
              }}
              onNext={handleStepOneNext}
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
            />
          )}

          {currentStep === 3 && (
            <StepThree
              data={{
                email_notifications:
                  onboardingData.email_notifications ?? true,
                push_notifications:
                  onboardingData.push_notifications ?? true,
                event_reminders: onboardingData.event_reminders ?? true,
                weekly_digest: onboardingData.weekly_digest ?? false,
                profile_visibility:
                  onboardingData.profile_visibility || 'public',
                show_location: onboardingData.show_location ?? false
              }}
              disableNext={loading}
              onNext={handleStepThreeNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <CompletionScreen
              title="¡Configuración Completa!"
              description="¡Felicidades! Has completado el proceso de configuración. Ahora estás listo para explorar todas las funcionalidades de Eventify. ¡Vamos a comenzar!"
            />
          )}
        </div>
      </div>
      <LoadingAbsolute show={loading} label="Configurando espacio ..." />
    </div>
  )
}
