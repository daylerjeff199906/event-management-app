'use client'

import { useState } from 'react'
import {
  RegistrationForm,
  SuccessMessage
} from '@/modules/portal/pages/institution'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import Image from 'next/image'
import { BG_AUTH_INSTITUTION } from '@/assets/images'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'

type Step = 'register' | 'success'

export default function InstitutionRequestPage() {
  const [currentStep, setCurrentStep] = useState<Step>('register')
  const [institutionCreated, setInstitutionCreated] =
    useState<InstitutionForm | null>(null)
  const router = useRouter()

  const handleRegistrationSuccess = () => {
    setCurrentStep('success')
  }

  const handleStartOver = () => {
    setCurrentStep('register')
    setInstitutionCreated(null)
  }

  const handleBack = () => {
    setCurrentStep('register')
    setInstitutionCreated(null)
    router.push(APP_URL.PORTAL.BASE)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Image
        src={BG_AUTH_INSTITUTION}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative w-full max-w-4xl z-20">
        {currentStep === 'register' && (
          <RegistrationForm
            onBack={handleBack}
            onSuccess={handleRegistrationSuccess}
            onInstitutionCreated={setInstitutionCreated}
          />
        )}

        {currentStep === 'success' && (
          <SuccessMessage
            onStartOver={handleStartOver}
            dataInstitution={institutionCreated || undefined}
          />
        )}
      </div>
    </div>
  )
}
