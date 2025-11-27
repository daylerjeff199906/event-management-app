'use client'

import { useState } from 'react'
import {
  InstitutionSearch,
  RegistrationForm,
  SuccessMessage
} from '@/modules/portal/pages/institution'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import InstitutionFound from '@/modules/portal/pages/institution/institution-found'
import Image from 'next/image'
import { BG_AUTH_INSTITUTION } from '@/assets/images'

type Step = 'search' | 'register' | 'success'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [searchTerm, setSearchTerm] = useState('')
  const [foundInstitution, setFoundInstitution] =
    useState<InstitutionForm | null>(null)
  const [institutionCreated, setInstitutionCreated] =
    useState<InstitutionForm | null>(null)

  const handleInstitutionNotFound = (term: string) => {
    setSearchTerm(term)
    setFoundInstitution(null)
    setInstitutionCreated(null)
    setCurrentStep('register')
  }

  const handleInstitutionFound = (institution: InstitutionForm) => {
    setFoundInstitution(institution)
    toast.info(
      <ToastCustom
        title="Institución ya registrada"
        description={`La institución ${institution.institution_name} ya está registrada.`}
      />
    )
  }

  const handleRegistrationSuccess = () => {
    setCurrentStep('success')
  }

  const handleStartOver = () => {
    setCurrentStep('search')
    setSearchTerm('')
    setFoundInstitution(null)
    setInstitutionCreated(null)
  }

  const handleBack = () => {
    setCurrentStep('search')
    setFoundInstitution(null)
    setInstitutionCreated(null)
  }

  if (foundInstitution) {
    // Si se encontró una institución, se muestra su información y un mensaje de contacto
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
        {/* Background image with dark overlay */}
        <Image
          src={BG_AUTH_INSTITUTION}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <InstitutionFound
          searchResults={{
            institution_email: foundInstitution.institution_email,
            institution_name: foundInstitution.institution_name
          }}
          onBack={handleStartOver}
        />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      {/* Background image with dark overlay */}
      <Image
        src={BG_AUTH_INSTITUTION}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Form content */}
      <div className="relative w-full max-w-4xl z-20">
        {currentStep === 'search' && (
          <InstitutionSearch
            onInstitutionNotFound={handleInstitutionNotFound}
            onInstitutionFound={handleInstitutionFound}
          />
        )}

        {currentStep === 'register' && (
          <RegistrationForm
            initialName={searchTerm}
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
