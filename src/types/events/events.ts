import { Pagination } from '../core'

export interface Event {
  id: string
  event_name: string
  description?: string | null
  start_date: string // ISO 8601 format
  end_date?: string | null // ISO 8601 format
  location?: string | null
  status?: string | null
  created_at?: string | null // ISO 8601 format
  updated_at?: string | null // ISO 8601 format
  institution_id?: string | null
  user_id?: string | null
  cover_image_url?: string | null
}

export interface EventFilterByInstitution extends Pagination {
  institution_id: string
  user_id?: string | null
  searchQuery?: string
}
