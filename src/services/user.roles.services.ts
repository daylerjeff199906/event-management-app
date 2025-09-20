'use server'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { getSupabase } from './core.supabase'
import { IUserRoleFull } from '@/types'

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

export async function getfullUserRoleByInstitution(
  institutionId: string
): Promise<IUserRoleFull[]> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('user_roles')
    .select('*, user:user_id(*)')
    .eq('institution_id', institutionId)
  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }
  return data ?? []
}
