'use client'
import { ImageUploadModal, InstitutionFormData } from '@/modules/admin'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import {
  updateInstitutionById,
  upsertInstitutionById
} from '@/services/institution.services'
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

  const onAvatarChange = async (url: string) => {
    try {
      const response = await upsertInstitutionById({
        id: institutionData?.id?.toString() || '',
        updates: {
          ...institutionData,
          brand: url
        }
      })
      if (response.data) {
        toast.success(
          <ToastCustom
            title="Perfil actualizado"
            description="Tu perfil se ha actualizado con éxito."
          />
        )

        // window.location.reload()
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Error desconocido'
          : 'Error desconocido'
      toast.error(
        <ToastCustom
          title="Error al actualizar el avatar"
          description={errorMessage}
        />
      )
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center border rounded-md p-4">
        <div className="flex items-center gap-4">
          <ImageUploadModal
            onUpload={onAvatarChange}
            title="Cambiar Logo de la Institución"
            defaultImage={institutionData?.brand || undefined}
            nameInstitution={
              institutionData?.acronym ||
              institutionData?.institution_name ||
              'Institución'
            }
            description="Logo de la institución (se recomienda una imagen cuadrada para mejores resultados)"
            folder="institutions"
          />
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {institutionData?.institution_name || 'Nombre de la Institución'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {institutionData?.institution_email || '    '}
            </p>
          </div>
        </div>
      </div>
      <InstitutionFormData
        initialData={institutionData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  )
}
