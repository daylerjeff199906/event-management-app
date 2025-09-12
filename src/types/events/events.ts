import { Pagination } from '../core'

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
  DELETE = 'DELETE'
}

export interface Event {
  id: string
  event_name: string
  description?: string | null
  start_date: string // ISO 8601 format
  end_date?: string | null // ISO 8601 format
  created_at?: string | null // ISO 8601 format
  updated_at?: string | null // ISO 8601 format
  institution_id?: string | null
  user_id?: string | null
  cover_image_url?: string | null
  status?: EventStatus
  category?: number | null
  author_id?: string | null
  location?: string | null
  location_type?: 'venue' | 'online' | 'tba' | null
  lon: number | null
  lat: number | null
  link_meeting?: string | null
  address_uuid?: string | null
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface EventFilterByInstitution extends Pagination {
  institution_id: string
  user_id?: string | null
  searchQuery?: string
  status?: EventStatus | null
}

export interface EventsFilters extends Pagination {
  user_id?: string | null
  status?: EventStatus | null
  exclude_status?: EventStatus | null
}
