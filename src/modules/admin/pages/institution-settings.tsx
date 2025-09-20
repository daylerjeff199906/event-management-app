'use client'
import { InstitutionFormData } from '@/modules/admin'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { updateInstitutionById } from '@/services/institution.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useState } from 'react'

interface InstitutionSettingsProps {
  institutionData?: InstitutionForm
}

export const InstitutionSettings = (props: InstitutionSettingsProps) => {
  const { institutionData } = props
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: InstitutionForm) => {
    setIsLoading(true)
    const { error } = await updateInstitutionById(
      institutionData?.id?.toString() || '',
      formData
    )
    setIsLoading(false)

    if (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description={`No se pudo actualizar la institución: ${error}`}
        />
      )
    } else {
      toast.success(
        <ToastCustom
          title="Éxito"
          description="Institución actualizada correctamente"
        />
      )
    }
    setIsLoading(false)
  }

  return (
    <>
      <InstitutionFormData
        initialData={institutionData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  )
}
