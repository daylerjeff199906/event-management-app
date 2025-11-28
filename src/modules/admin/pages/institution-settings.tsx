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
import { BannerUploadModal } from '../components/banner-upload-modal'

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

      if (urlRedirect) {
        router.push(urlRedirect)
      } else {
        window.location.reload()
      }
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

  // Manejo específico para cambio rápido de banner (Header)
  const onBannerChange = async (url: string) => {
    if (!institutionData?.id) return
    try {
      await upsertInstitutionById({
        id: institutionData.id,
        updates: { ...institutionData, cover_image_url: url }
      })
      toast.success(
        <ToastCustom
          title="Portada actualizada"
          description="La portada se ha actualizado correctamente."
        />
      )
      router.refresh()
    } catch {
      toast.error(
        <ToastCustom
          title="Error"
          description="No se pudo actualizar la portada."
        />
      )
    }
  }

  return (
    <>
      {/* Header con cambio rápido de logo (solo si existe data previa) */}
      {institutionData && (
        <div className="max-w-5xl mx-auto mb-6 bg-background rounded-xl shadow-sm border overflow-hidden">
          {/* 1. SECCIÓN DEL BANNER (Ocupa todo el ancho superior) */}
          <div className="w-full relative">
            <BannerUploadModal
              onUpload={onBannerChange}
              defaultImage={institutionData.cover_image_url || undefined}
              title="Subir Portada"
              description="Arrastra y ajusta tu portada"
              folder="institutions/covers"
            />
          </div>

          {/* 2. SECCIÓN DE PERFIL (Logo superpuesto + Info) */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Contenedor del Logo con margen negativo para subirlo sobre el banner */}
              <div className="-mt-12 relative z-10">
                <div className="p-1.5 bg-background rounded-full shadow-sm">
                  <ImageUploadModal
                    onUpload={onLogoChange}
                    title="Cambiar Logo"
                    defaultImage={institutionData.logo_url || undefined}
                    nameInstitution={institutionData.institution_name}
                    folder="institutions/logos"
                  />
                </div>
              </div>

              {/* Información de texto (Alineada a la derecha del logo) */}
              <div className="mt-2 sm:mt-4 space-y-1 flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {institutionData.institution_name}
                </h2>
                <p className="text-muted-foreground">
                  {institutionData.institution_email ||
                    'Sin correo de contacto'}
                </p>
              </div>
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
