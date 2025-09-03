'use server'
import { getSupabase } from './core.supabase'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'

// Función de búsqueda combinada (por nombre o email)
export async function searchInstitutionFunction(query: string) {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .or(`institution_name.ilike.%${query}%,contact_email.eq.${query}`)
    .order('institution_name')

  if (error) {
    console.error('Error buscando institución:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createInstitution(institutionData: InstitutionForm) {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('institutions')
    .insert([institutionData])
    .select()
    .single()

  if (error) {
    console.error('Error creando institución:', error)
    throw new Error(`Error al crear institución: ${error.message}`)
  }

  return { data, error: null }
}
