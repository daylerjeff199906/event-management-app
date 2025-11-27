'use server'
import { getSupabase } from './core.supabase'
import { Category } from '@/types'
import { revalidatePath } from 'next/cache'
import { APP_URL } from '@/data/config-app-url'

export type CategoryPayload = {
  name: string
  description?: string | null
  icon?: string | null
}

const CATEGORY_REVALIDATE_PATHS = [
  APP_URL.ADMIN.CATEGORIES.BASE,
  APP_URL.PORTAL.BASE
]

const normalizeText = (value?: string | null) => {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeCategoryPayload = (payload: CategoryPayload) => ({
  name: payload.name.trim(),
  description: normalizeText(payload.description),
  icon: normalizeText(payload.icon)
})

const revalidateCategoryPaths = () => {
  CATEGORY_REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
}

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

export async function fetchCategoryById(
  id: string | number
): Promise<Category | null> {
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

export async function createCategory(
  payload: CategoryPayload
): Promise<{ data: Category | null; error: string | null }> {
  const supabase = await getSupabase()
  const normalizedPayload = normalizeCategoryPayload(payload)

  const { data, error } = await supabase
    .from('categories')
    .insert([normalizedPayload])
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return { data: null, error: error.message }
  }

  revalidateCategoryPaths()
  return { data, error: null }
}

export async function updateCategory(
  id: string | number,
  payload: CategoryPayload
): Promise<{ data: Category | null; error: string | null }> {
  const supabase = await getSupabase()
  const normalizedPayload = normalizeCategoryPayload(payload)

  const { data, error } = await supabase
    .from('categories')
    .update(normalizedPayload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    return { data: null, error: error.message }
  }

  revalidateCategoryPaths()
  return { data, error: null }
}

export async function deleteCategory(
  id: string | number
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await getSupabase()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }

  revalidateCategoryPaths()
  return { success: true, error: null }
}
