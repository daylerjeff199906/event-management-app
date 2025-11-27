'use server'
import { getSupabase } from './core.supabase'
import { Category } from '@/types'

export async function fetchCategories(): Promise<Category[]> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })
    .limit(100) // Limitar a 100 categorías para evitar sobrecarga

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    console.error('Error fetching category by ID:', error)
    return null
  }
  return data || null
}
