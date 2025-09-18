import { InstitutionEvent, Pagination } from '../core'

export interface RegistrationRequest {
  id: string
  institution_name: string
  institution_type: string
  contact_email: string
  contact_phone?: string | null
  contact_person?: string | null
  documents?: string | null // You can replace 'any' with a more specific type if you know the structure
  request_status?: string | null
  created_at?: string | null // ISO date string
  updated_at?: string | null // ISO date string
  institution_uuid?: string | null
}

export interface RegistrationRequestFilter extends Pagination {
  request_status?: string | null
  institution_id?: string
  user_id?: string
  status?: string
}

export interface RegistrationRequestList extends RegistrationRequest {
  institution: InstitutionEvent | null
}
