export interface IUser {
  id?: string // UUID del usuario autenticado
  first_name: string
  last_name: string
  profile_image: string | null
  country: string | null
  birth_date: string | null
  phone: string
  email: string
  created_at: Date
  updated_at: Date
  gender: string | null
  userName?: string
}
