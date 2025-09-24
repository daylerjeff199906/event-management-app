'use server'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { getSupabase } from './core.supabase'
import { IUserRoleFull } from '@/types'
import { revalidatePath } from 'next/cache'

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

export async function upsertUserRole({
  idRole,
  institutionId,
  userId,
  role,
  urlRevalidate
}: {
  idRole: string
  userId: string
  institutionId: string
  role: 'institution_owner' | 'member' | 'editor'
  urlRevalidate?: string
}): Promise<{ data: IUserRoleFull | null; error: Error | null }> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        id: idRole,
        user_id: userId,
        institution_id: institutionId,
        role
      })
      .select('*, user:user_id(*)')
      .single()
    if (error) {
      console.error('Error upserting user role:', error)
      return { data: null, error }
    }

    revalidatePath(urlRevalidate || '/portal/institution/users')
    return { data: data as IUserRoleFull, error: null }
  } catch (err) {
    console.error('Unexpected error upserting user role:', err)
    return { data: null, error: err as Error }
  }
}

export async function upsertAccessEnabled(
  userId: string,
  institutionId: string,
  access_enabled: boolean
): Promise<{ data: IUserRoleFull | null; error: Error | null }> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        institution_id: institutionId,
        access_enabled
      })
      .select('*, user:user_id(*)')
      .single()
    if (error) {
      console.error('Error upserting access enabled:', error)
      return { data: null, error }
    }
    return { data: data as IUserRoleFull, error: null }
  } catch (err) {
    console.error('Unexpected error upserting access enabled:', err)
    return { data: null, error: err as Error }
  }
}
