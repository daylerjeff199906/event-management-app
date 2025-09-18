export interface Category {
  id: bigint
  created_at: string // ISO timestamp
  name: string
  description?: string | null
  icon?: string | null
}
