import { z } from 'zod'

// Esquema para la tabla institutions
export const institutionSchema = z.object({
  id: z.string().uuid().optional(),
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  description: z.string().optional(),
  contact_email: z.string().email('Ingresa un correo electrónico válido'),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  documents: z.any().optional(), // jsonb field
  validation_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
})

// Esquema para la tabla registration_requests
export const registrationRequestSchema = z.object({
  id: z.string().uuid().optional(),
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  contact_email: z.string().email('Ingresa un correo electrónico válido'),
  contact_phone: z.string().optional(),
  contact_person: z
    .string()
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres'),
  address: z.string().optional(),
  documents: z.any().optional(), // jsonb field
  request_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
})

// Esquema para el formulario de búsqueda
export const searchInstitutionSchema = z.object({
  search_term: z.string().min(2, 'Ingresa al menos 2 caracteres para buscar')
})

// Esquema para el formulario de registro
export const registrationFormSchema = z.object({
  institution_name: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres'),
  institution_type: z.string().min(1, 'Selecciona el tipo de institución'),
  contact_email: z.string().email('Ingresa un correo electrónico válido'),
  contact_phone: z.string().optional(),
  contact_person: z
    .string()
    .min(2, 'El nombre de contacto debe tener al menos 2 caracteres'),
  address: z.string().optional(),
  description: z.string().optional()
})

export const institutionSearchResultSchema = z.object({
  id: z.string().uuid(),
  institution_name: z.string(),
  institution_type: z.string(),
  contact_email: z.string().email(),
  description: z.string().optional(),
  validation_status: z.enum(['pending', 'approved', 'rejected'])
})

export type InstitutionForm = z.infer<typeof institutionSchema>
export type RegistrationRequest = z.infer<typeof registrationRequestSchema>
export type SearchInstitution = z.infer<typeof searchInstitutionSchema>
export type RegistrationForm = z.infer<typeof registrationFormSchema>
export type InstitutionSearchResult = z.infer<
  typeof institutionSearchResultSchema
>

// Tipos de institución disponibles
export const institutionTypes = [
  { value: 'universidad', label: 'Universidad' },
  { value: 'ong', label: 'ONG' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'gobierno', label: 'Institución Gubernamental' },
  { value: 'fundacion', label: 'Fundación' },
  { value: 'otro', label: 'Otro' }
] as const
