export interface InstitutionEvent {
  id: string
  institution_name: string
  institution_type: string
  description?: string
  institution_email: string
  contact_phone?: string
  address?: string
  documents?: string | null // Use a more specific type if you know the JSON structure
  validation_status?: string
  created_at?: string // ISO date string
  updated_at?: string // ISO date string
  information_external?: string
  document_number?: string
  brand?: string
  cover_image_url?: string
  map_iframe_url?: string
  acronym?: string
  status?: string
}
