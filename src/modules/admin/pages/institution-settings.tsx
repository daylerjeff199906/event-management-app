'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { ImageUploadModal } from '@/modules/admin' // Tu componente existente
import { InstitutionFormData } from '../components/institution-form-data'
import {
  InstitutionForm,
  InstitutionStatus,
  InstitutionValidationStatus
} from '@/modules/portal/lib/register.institution'
import {
  createInstitution,
  updateInstitutionById,
  upsertInstitutionById
} from '@/services/institution.services'

interface InstitutionSettingsProps {
  institutionData?: InstitutionForm
  urlRedirect?: string
  isAdmin?: boolean // Prop para controlar permisos
}

export const InstitutionSettings = (props: InstitutionSettingsProps) => {
  const { institutionData, urlRedirect, isAdmin = false } = props
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Manejo del envío del formulario completo
  const handleSubmit = async (formData: InstitutionForm) => {
    setIsLoading(true)
    try {
      const { error } = institutionData?.id
        ? await updateInstitutionById(institutionData.id, formData)
        : await createInstitution({
            ...formData,
            // Si no es admin y está creando, valores por defecto seguros
            status: institutionData
              ? formData.status
              : InstitutionStatus.ACTIVE,
            validation_status: institutionData
              ? formData.validation_status
              : InstitutionValidationStatus.PENDING
          })

      if (error) throw new Error(error)

      toast.success(
        <ToastCustom
          title="Éxito"
          description={
            institutionData ? 'Institución actualizada.' : 'Institución creada.'
          }
        />
      )

      if (urlRedirect) router.push(urlRedirect)
    } catch (error) {
      const err = error as Error
      const message = err.message || 'Error desconocido'
      toast.error(
        <ToastCustom
          title="Error"
          description={`No se pudo guardar: ${message}`}
        />
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Manejo específico para cambio rápido de logo (Header)
  const onLogoChange = async (url: string) => {
    if (!institutionData?.id) return

    try {
      await upsertInstitutionById({
        id: institutionData.id,
        updates: { ...institutionData, logo_url: url } // Actualizado a logo_url
      })
      toast.success(
        <ToastCustom
          title="Logo actualizado"
          description="El logo se ha actualizado correctamente."
        />
      )
      router.refresh()
    } catch {
      toast.error(
        <ToastCustom
          title="Error"
          description="No se pudo actualizar el logo."
        />
      )
    }
  }

  return (
    <>
      {/* Header con cambio rápido de logo (solo si existe data previa) */}
      {institutionData && (
        <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center border rounded-md p-4 bg-background shadow-sm">
          <div className="flex items-center gap-4">
            <ImageUploadModal
              onUpload={onLogoChange}
              title="Cambiar Logo"
              defaultImage={institutionData.logo_url || undefined}
              nameInstitution={institutionData.institution_name}
              folder="institutions/logos"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {institutionData.institution_name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {institutionData.institution_email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario Principal */}
      <InstitutionFormData
        initialData={institutionData}
        onSubmit={handleSubmit}
        onCancel={() =>
          urlRedirect ? router.push(urlRedirect) : router.back()
        }
        isLoading={isLoading}
        canChangeStatus={isAdmin} // Pasamos el control de permisos
      />
    </>
  )
}
