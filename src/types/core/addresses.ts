export interface Address {
  id?: string
  created_at?: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  // Nuevos campos agregados
  place_name?: string | null
  instructions?: string | null
  access_code?: string | null
}
