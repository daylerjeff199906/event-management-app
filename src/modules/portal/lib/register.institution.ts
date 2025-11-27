import { z } from 'zod'

export enum InstitutionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Schema para redes sociales (opcional para mantener orden)
const socialMediaSchema = z.object({
  facebook: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  twitter: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal(''))
})

export enum InstitutionValidationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export const institutionSchema = z.object({
  // --- Identificación Básica ---
  id: z.string().optional(),
  institution_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  // Slug para URL amigable (ej: universidad-central)
  slug: z.string().optional(),
  institution_type: z.string().min(1, 'Selecciona el tipo'),
  document_number: z.string().optional(), // RUC / NIT
  // --- Branding y Visual ---
  logo_url: z.string().optional(), // Logo específico
  cover_image_url: z.string().optional(), // Banner
  brand: z.string().optional().nullable(), // Nombre de marca o slogan
  primary_color: z.string().optional(), // Para botones/temas

  // --- Contenido ---
  description: z.string().optional(), // Descripción corta
  about_us: z.string().optional(), // Historia o descripción larga
  mission: z.string().optional(),
  vision: z.string().optional(),

  // --- Contacto y Ubicación ---
  institution_email: z.string().email('Ingresa un correo válido'),
  contact_phone: z.string().optional(),
  whatsapp_number: z.string().optional(), // Muy útil para botón flotante de chat
  address: z.string().optional(),
  map_iframe_url: z.string().optional().nullable(),

  // --- Redes Sociales (Agrupadas o planas, según prefieras en DB) ---
  social_media: socialMediaSchema.optional(),

  // --- Sistema ---
  acronym: z.string().optional(),
  documents: z.any().optional(),
  validation_status: z
    .enum([
      InstitutionValidationStatus.PENDING,
      InstitutionValidationStatus.APPROVED,
      InstitutionValidationStatus.REJECTED
    ])
    .optional(),
  status: z
    .enum([InstitutionStatus.ACTIVE, InstitutionStatus.INACTIVE])
    .optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

// Esquema para el formulario de búsqueda
export const searchInstitutionSchema = z.object({
  search_term: z.string().min(2, 'Ingresa al menos 2 caracteres para buscar')
})

export const institutionSearchResultSchema = z.object({
  id: z.string().uuid(),
  institution_name: z.string(),
  institution_type: z.string(),
  contact_email: z.string().email(),
  description: z.string().optional(),
  validation_status: z.enum(['pending', 'approved', 'rejected'])
})

export const registrationRequestSchema = z.object({
  id: z.string().optional(),
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  contact_email: z.string().email('Ingresa un correo electrónico válido'),
  contact_phone: z.string().optional(),
  contact_person: z
    .string()
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres')
    .optional(),
  documents: z.any().optional(),
  request_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  institution_uuid: z.string().optional()
})

//Test schema
export const requestInstitutionSchema = z.object({
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  institution_email: z.string('Ingresa un correo electrónico válido'),
  contact_phone: z.string().optional(),
  description: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .optional(),
  contact_person: z
    .string()
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres'),
  contact_email: z.string().email('Ingresa un correo electrónico válido'),
  request_status: z.enum(['pending', 'approved', 'rejected']).optional()
})

export type InstitutionForm = z.infer<typeof institutionSchema>
export type SearchInstitution = z.infer<typeof searchInstitutionSchema>
export type InstitutionSearchResult = z.infer<
  typeof institutionSearchResultSchema
>
export type RegistrationInstitutionForm = z.infer<
  typeof requestInstitutionSchema
>
export type RegistrationRequestForm = z.infer<typeof registrationRequestSchema>

// Tipos de institución disponibles
export const institutionTypes = [
  { value: 'universidad', label: 'Universidad' },
  { value: 'ong', label: 'ONG' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'gobierno', label: 'Institución Gubernamental' },
  { value: 'fundacion', label: 'Fundación' },
  { value: 'asociacion', label: 'Asociación' },
  { value: 'cooperativa', label: 'Cooperativa' },
  { value: 'grupo-independiente', label: 'Grupo Independiente' },
  { value: 'otro', label: 'Otro' }
] as const
