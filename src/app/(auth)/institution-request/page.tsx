'use client'

import { useState } from 'react'
import {
  InstitutionSearch,
  RegistrationForm,
  SuccessMessage
} from '@/modules/portal/pages/institution'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'

type Step = 'search' | 'register' | 'success'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [searchTerm, setSearchTerm] = useState('')
  const [foundInstitution, setFoundInstitution] =
    useState<InstitutionForm | null>(null)

  const handleInstitutionNotFound = (term: string) => {
    setSearchTerm(term)
    setCurrentStep('register')
  }

  const handleInstitutionFound = (institution: InstitutionForm) => {
    setFoundInstitution(institution)
    // En este caso, podrías mostrar información de que ya está registrada
    // Por ahora, volvemos a la búsqueda
    alert(`La institución ${institution.institution_name} ya está registrada.`)
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
          />
        )}

        {currentStep === 'success' && (
          <SuccessMessage onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  )
}
