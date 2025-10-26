export interface Category {
  id: number
  created_at: string // ISO timestamp
  name: string
  description?: string | null
  icon?: string | null
}
