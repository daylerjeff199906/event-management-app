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
  const [institutionCreated, setInstitutionCreated] =
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

  if (foundInstitution) {
    // Si se encontró una institución, se muestra su información y un mensaje de contacto
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Institución encontrada</h2>
        <p className="mb-1">
          <strong>Nombre:</strong> {foundInstitution.institution_name}
        </p>
        <p className="mb-4">
          <strong>Correo de contacto:</strong> {foundInstitution.contact_email}
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>
            No puedes crear una nueva cuenta para esta institución porque ya
            está registrada. Por favor, contacta al responsable o a los
            responsables de la institución para obtener acceso o resolver
            cualquier duda.
          </p>
        </div>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleStartOver}
        >
          Volver a buscar otra institución
        </button>
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
    </div>
  )
}
