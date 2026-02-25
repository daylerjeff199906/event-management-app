'use server'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { getSupabase } from './core.supabase'
import { IProfile, IUserRoleFull, InstitutionRole } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getInstitutionsByUserRole(
  userId: string,
  query?: string
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

  let institutions = data?.flatMap((row) => row.institutions) ?? []

  if (query) {
    institutions = institutions.filter((inst) =>
      inst.institution_name.toLowerCase().includes(query.toLowerCase())
    )
  }

  return institutions
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

export async function getUserRoleByIdInstitution(
  userId: string,
  institutionId: string
): Promise<IUserRoleFull | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('user_roles')
    .select('*, user:user_id(*)')
    .eq('user_id', userId)
    .eq('institution_id', institutionId)
    .single()
  if (error) {
    console.error('Error fetching user role by ID and institution:', error)
    return null
  }
  return data as IUserRoleFull
}

export async function getUsersPagination({
  page,
  pageSize,
  query
}: {
  page: number
  pageSize?: number
  query?: string
}): Promise<{ users: IProfile[]; total: number }> {
  const supabase = await getSupabase()
  const limit = pageSize ?? 20
  let queryBuilder = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .range((page - 1) * limit, page * limit - 1)
  if (query) {
    queryBuilder = queryBuilder.ilike('email', `%${query}%`)
  }
  const { data, error, count } = await queryBuilder
  if (error) {
    console.error('Error fetching paginated users:', error)
    return { users: [], total: 0 }
  }
  return { users: data ?? [], total: count ?? 0 }
}

export async function getUserById(userId: string): Promise<IProfile | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_roles(*)')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Error fetching user role by ID:', error)
    return null
  }
  return data as IProfile
}

export async function upsertUserRole({
  idRole,
  institutionId,
  userId,
  role,
  isSuperAdmin = false,
  urlRevalidate
}: {
  idRole?: string
  userId: string
  institutionId: string
  role: InstitutionRole
  isSuperAdmin?: boolean
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
        role_type: role,
        is_super_admin: isSuperAdmin
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

export async function upsertAccessEnabled({
  userRoleId,
  userId,
  institutionId,
  access_enabled,
  role,
  urlRevalidate
}: {
  userRoleId?: string
  userId: string
  institutionId: string
  access_enabled: boolean
  role: InstitutionRole
  urlRevalidate?: string
}): Promise<{ data: IUserRoleFull | null; error: Error | null }> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        id: userRoleId,
        user_id: userId,
        role_type: role,
        institution_id: institutionId,
        access_enabled
      })
      .select('*, user:user_id(*)')
      .single()
    if (error) {
      console.error('Error upserting access enabled:', error)
      return { data: null, error }
    }
    revalidatePath(urlRevalidate || '/portal/institution/users')
    return { data: data as IUserRoleFull, error: null }
  } catch (err) {
    console.error('Unexpected error upserting access enabled:', err)
    return { data: null, error: err as Error }
  }
}

export async function createUserRole({
  userId,
  institutionId,
  role,
  urlRevalidate
}: {
  userId: string
  institutionId: string
  role: InstitutionRole
  urlRevalidate?: string
}): Promise<{ data: IUserRoleFull | null; error: Error | null }> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        institution_id: institutionId,
        role_type: role
      })
      .select('*, user:user_id(*)')
      .single()
    if (error) {
      console.error('Error creating user role:', error)
      return { data: null, error }
    }

    revalidatePath(urlRevalidate || '/portal/institution/users')
    return { data: data as IUserRoleFull, error: null }
  } catch (err) {
    console.error('Unexpected error creating user role:', err)
    return { data: null, error: err as Error }
  }
}
