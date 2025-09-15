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
import { APP_URL } from '@/data/config-app-url'
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
  }

  const handleBack = () => {
    setCurrentStep('search')
  }

  if (foundInstitution) {
    // Si se encontró una institución, se muestra su información y un mensaje de contacto
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <InstitutionFound
          searchResults={{
            institution_email: foundInstitution.institution_email,
            institution_name: foundInstitution.institution_name
          }}
          onBack={() =>
            window.location.replace(APP_URL.PORTAL.INSTITUTION_REQUEST)
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
      <Image
        src={BG_AUTH_INSTITUTION}
        alt="Background"
        width={1080}
        height={1080}
      />
    </div>
  )
}
