'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  institutionSchema,
  InstitutionForm,
  InstitutionStatus,
  InstitutionValidationStatus
} from '@/modules/portal/lib/register.institution'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'
import { Globe, Instagram, Linkedin, LinkIcon, Twitter } from 'lucide-react'
import Facebook from 'next-auth/providers/facebook'
import { institutionTypes } from '@/modules/portal/lib/register.institution'
import { BannerUploadModal } from './banner-upload-modal'

// --- Configuración de Iconos para limpieza visual ---
const SOCIAL_NETWORKS = [
  {
    key: 'website',
    label: 'Sitio Web',
    icon: Globe,
    placeholder: 'https://mi-institucion.com'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/...'
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/...'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/...'
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    icon: Twitter,
    placeholder: 'https://twitter.com/...'
  }
] as const

// --- Sub-componentes para limpieza visual ---

const SectionHeader = ({
  title,
  description
}: {
  title: string
  description?: string
}) => (
  <div className="mb-4">
    <h3 className="text-lg font-medium">{title}</h3>
    {description && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
    <Separator className="my-2" />
  </div>
)

const normalizeSocialMedia = (
  social?: InstitutionForm['social_media']
): InstitutionForm['social_media'] => ({
  website: social?.website ?? '',
  facebook: social?.facebook ?? '',
  instagram: social?.instagram ?? '',
  linkedin: social?.linkedin ?? '',
  twitter: social?.twitter ?? ''
})

const normalizeInstitutionForm = (data?: InstitutionForm): InstitutionForm => ({
  id: data?.id,
  institution_name: data?.institution_name ?? '',
  institution_type: data?.institution_type ?? '',
  institution_email: data?.institution_email ?? '',
  mission: data?.mission ?? '',
  vision: data?.vision ?? '',
  primary_color: data?.primary_color ?? '',
  whatsapp_number: data?.whatsapp_number ?? '',
  description: data?.description ?? '',
  contact_phone: data?.contact_phone ?? '',
  address: data?.address ?? '',
  acronym: data?.acronym ?? '',
  document_number: data?.document_number ?? '',
  brand: data?.brand ?? '',
  cover_image_url: data?.cover_image_url ?? '',
  slug: data?.slug ?? '',
  social_media: normalizeSocialMedia(data?.social_media),
  status: data?.status,
  validation_status: data?.validation_status,
  logo_url: data?.logo_url,
  about_us: data?.about_us,
  map_iframe_url: data?.map_iframe_url ?? undefined,
  documents: data?.documents
})

interface InstitutionFormDataProps {
  initialData?: InstitutionForm
  onSubmit: (data: InstitutionForm) => void
  onCancel: () => void
  isLoading: boolean
  canChangeStatus: boolean
}

export const InstitutionFormData = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  canChangeStatus
}: InstitutionFormDataProps) => {
  const form = useForm<InstitutionForm>({
    resolver: zodResolver(institutionSchema),
    defaultValues: normalizeInstitutionForm(initialData)
  })

  const errors = form.formState.errors

  // Generador automático de slug simple si el nombre cambia (UX)
  const name = form.watch('institution_name')
  useEffect(() => {
    if (!initialData && name) {
      const slug = name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
      form.setValue('slug', slug)
    }
  }, [name, initialData, form])

  return (
    <>
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md max-w-5xl mx-auto dark:bg-red-900/10">
          <h4 className="font-medium text-red-800 mb-2 text-sm dark:text-red-400">
            Por favor, corrige los siguientes errores:
          </h4>
          <ul className="list-disc list-inside text-red-700 dark:text-red-300">
            {Object.entries(errors).map(([key, error]) => {
              const message =
                // If the error entry is a simple string
                typeof error === 'string'
                  ? error
                  : // If it's an object with a message property
                  error && typeof error.message === 'string'
                  ? error.message
                  : // Fallback
                    'Error desconocido'

              return (
                <li key={key} className="text-xs">
                  {key}: {message}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-5xl mx-auto space-y-8 pb-10"
        >
          {/* --- 1. Información General --- */}
          <section>
            <SectionHeader
              title="Información General"
              description="Datos básicos de identificación de la institución."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="institution_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Institución *</FormLabel>
                    <FormControl>
                      <Input placeholder="Universidad Ejemplar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acronym"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acrónimo</FormLabel>
                    <FormControl>
                      <Input placeholder="UE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                        N. Documento
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* --- 2. Identidad Visual --- */}
          <section>
            <SectionHeader
              title="Identidad Visual"
              description="Personaliza la apariencia en el portal."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Wrapper para el Cover Image */}
              <div className="space-y-2">
                <FormLabel>Imagen de Portada (Banner)</FormLabel>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <BannerUploadModal
                    onUpload={(url) => form.setValue('cover_image_url', url)}
                    defaultImage={form.getValues('cover_image_url')}
                    title="Subir Portada"
                    description="1920x400 recomendado"
                    folder="institutions/covers"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="primary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Primario (Hex)</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="#000000"
                            {...field}
                            type="color"
                          />
                        </FormControl>
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: field.value || '#ffffff' }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca / Slogan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Educación para el futuro"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          {/* --- 3. Contenido Institucional --- */}
          <section>
            <SectionHeader
              title="Sobre Nosotros"
              description="Historia, misión y visión."
            />
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Corta</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve resumen..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Misión</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nuestra misión es..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visión</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nuestra visión es..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          {/* --- 4. Contacto y Redes --- */}
          <section className="space-y-6">
            <SectionHeader title="Contacto y Redes Sociales" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="institution_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Oficial *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (Número internacional)</FormLabel>
                    <FormControl>
                      <Input placeholder="51999999999" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* --- SECCIÓN 4: REDES SOCIALES (ACTUALIZADA) --- */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" /> Redes Sociales
                </h3>
                <Separator className="my-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SOCIAL_NETWORKS.map(({ key, label, placeholder }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    // NOTA IMPORTANTE: Usamos notación de punto para acceder al objeto
                    name={`social_media.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          {/* <Icon className="w-4 h-4 text-muted-foreground" /> */}
                          {label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            {...field}
                            // Aseguramos que nunca sea null para evitar advertencias de React
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </section>
          </section>

          {/* --- 5. Administración (Solo Admin) --- */}
          {canChangeStatus && (
            <section className="bg-red-50 p-4 rounded-lg border border-red-100">
              <SectionHeader
                title="Zona Administrativa"
                description="Control de estado y validación."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Sistema</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={InstitutionStatus.ACTIVE}>
                            Activo
                          </SelectItem>
                          <SelectItem value={InstitutionStatus.INACTIVE}>
                            Inactivo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validation_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Validación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={InstitutionValidationStatus.PENDING}
                          >
                            Pendiente
                          </SelectItem>
                          <SelectItem
                            value={InstitutionValidationStatus.APPROVED}
                          >
                            Aprobado
                          </SelectItem>
                          <SelectItem
                            value={InstitutionValidationStatus.REJECTED}
                          >
                            Rechazado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </section>
          )}

          {/* --- Botones de Acción --- */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
