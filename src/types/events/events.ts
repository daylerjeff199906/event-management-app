import { EventMode } from '@/modules/events/schemas'
import { Address, IProfile, Pagination } from '../core'
import { Category } from './categories'
import { EventDetails } from './events-details'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
  DELETE = 'DELETE'
}

export interface EventImage {
  id: string
  event_id: string
  image_url: string
  is_main: boolean
  created_at?: string
}

export interface Event {
  id: string
  created_at?: string | null // ISO 8601 format
  updated_at?: string | null // ISO 8601 format
  event_name: string
  description?: string | null
  start_date: string // ISO 8601 format
  end_date?: string | null // ISO 8601 format
  institution_id?: string | null
  user_id?: string | null
  status?: EventStatus
  category?: number | null
  author_id?: string | null
  // DB address key(s)
  address_uuid?: string | null
  address_id?: string | null
  time?: string | null
  duration?: number | null
  full_description?: string | null
  // is_featured?: boolean | null
  // Campos añadidos para recurrencia
  is_recurring?: boolean | null
  recurrence_pattern?: string | null
  recurrence_interval?: number | null
  recurrence_end_date?: string | null // ISO 8601 format
  // Campos adicionales según el esquema SQL
  meeting_url?: string | null
  custom_location?: string | null
  event_mode?: EventMode | null
  images?: EventImage[]
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

export interface EventItemDetails extends Event {
  categorydata: Category | null
  institution: InstitutionForm | null
  user: IProfile | null
  author: IProfile | null
  // Database external key
  adressdata: Address | null
  // Extended details
  infodata: EventDetails | null
}
