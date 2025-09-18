'use server'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { getSupabase } from './core.supabase'

export async function getInstitutionsByUserRole(
  userId: string
): Promise<InstitutionForm[]> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('user_roles')
    .select('institutions(*)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching institutions:', error)
    return []
  }

  // Flatten the result to return only institutions
  return data?.flatMap((row) => row.institutions) ?? []
}
