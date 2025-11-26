export interface Address {
  id?: string
  created_at?: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  latitude?: string | null
  longitude?: string | null
  // Nuevos campos agregados
  place_name?: string | null
  instructions?: string | null
  online_url?: string | null
  platform?: string | null
  access_code?: string | null
  is_online?: boolean | null
}