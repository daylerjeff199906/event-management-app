import { z } from 'zod'

export enum InstitutionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Esquema para la tabla institutions
export const institutionSchema = z.object({
  id: z.string().optional(),
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  description: z.string().optional(),
  institution_email: z.string('Ingresa un correo electrónico válido'),
  document_number: z.string().optional(),
  brand: z.string().optional().nullable(),
  acronym: z.string().optional(),
  cover_image_url: z.string().optional(),
  map_iframe_url: z.string().optional().nullable(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  documents: z.any().optional(), // jsonb field
  validation_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  status: z
    .enum([InstitutionStatus.ACTIVE, InstitutionStatus.INACTIVE])
    .optional()
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
