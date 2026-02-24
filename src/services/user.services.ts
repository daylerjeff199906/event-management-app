'use server'
import {
  PersonalInfo,
  Interests,
  Notifications
} from '@/modules/portal/lib/validations'
import { getSupabase } from './core.supabase'
import {
  IProfile,
  IProfileFilter,
  IProfileFull,
  ResponsePagination,
  EventLimitCheck,
  GlobalRole,
  AccountType
} from '@/types'
import { revalidatePath } from 'next/cache'

export async function checkOnboardingCompleted(userId: string): Promise<boolean> {
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc('check_onboarding_completed', {
    user_id: userId
  })

  if (error) {
    console.error('Error checking onboarding:', error)
    return false
  }

  return data ?? false
}

export async function completeOnboarding(userId: string): Promise<boolean> {
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc('complete_onboarding', {
    user_id: userId
  })

  if (error) {
    console.error('Error completing onboarding:', error)
    return false
  }

  return data ?? false
}

export async function checkEventLimit(userId: string): Promise<EventLimitCheck> {
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc('check_event_limit', {
    user_id: userId
  })

  if (error) {
    console.error('Error checking event limit:', error)
    return {
      allowed: false,
      limit: 0,
      current: 0,
      reason: 'Error al verificar límite'
    }
  }

  return data as EventLimitCheck
}

export async function getUserInstitutions(userId: string): Promise<IProfileFull['institutions']> {
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc('get_user_institutions', {
    p_user_id: userId
  })

  if (error) {
    console.error('Error getting user institutions:', error)
    return []
  }

  return data ?? []
}

export async function getUserInstitutionRole(
  userId: string,
  institutionId: string
): Promise<{ has_access: boolean; role: string | null; is_super_admin: boolean }> {
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc('get_user_institution_role', {
    p_user_id: userId,
    p_institution_id: institutionId
  })

  if (error) {
    console.error('Error getting user institution role:', error)
    return { has_access: false, role: null, is_super_admin: false }
  }

  return data
}

export async function insertUserData(formData: PersonalInfo) {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase.from('profiles').upsert([
      {
        id: user.user?.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile_image: null,
        country: null,
        birth_date: null,
        phone: formData.phone,
        email: user.user?.email,
        gender: null
      }
    ])
    if (error) {
      console.error('Error inserting profile data:', error)
    } else {
      console.log('Profile data inserted:', data)
    }
  }
}

export async function insertInterestsAndNotifications(
  interestsData: Interests,
  notificationsData: Notifications
) {
  const supabase = await getSupabase()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (user) {
    const { data: interests, error: interestsError } = await supabase
      .from('interests')
      .upsert([
        {
          user_id: user.id,
          interests: interestsData.interests,
          event_types: interestsData.eventTypes
        }
      ])

    if (interestsError) {
      console.error('Error inserting interests:', interestsError)
    } else {
      console.log('Interests inserted:', interests)
    }

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .upsert([
        {
          user_id: user.id,
          email_notifications: notificationsData.email_notifications,
          push_notifications: notificationsData.push_notifications,
          event_reminders: notificationsData.event_reminders,
          weekly_digest: notificationsData.weekly_digest,
          profile_visibility: notificationsData.profile_visibility,
          show_location: notificationsData.show_location
        }
      ])

    if (notificationsError) {
      console.error('Error inserting notifications:', notificationsError)
    } else {
      console.log('Notifications inserted:', notifications)
    }
  }
}

export async function updateUserData({
  id,
  dataForm
}: {
  id: string
  dataForm: Partial<PersonalInfo>
}) {
  const supabase = await getSupabase()
  const { error, data, status, statusText } = await supabase
    .from('profiles')
    .update(dataForm)
    .eq('id', id)
    .select()
    .single()

  return { error, data, status, statusText }
}

export async function updateProfileField<K extends keyof IProfile>(
  id: string,
  field: K,
  value: IProfile[K]
) {
  const supabase = await getSupabase()
  const payload = { [field]: value, updated_at: new Date().toISOString() } as Record<string, unknown>

  const { error, data, status, statusText } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  return { error, data, status, statusText }
}

export async function updateProfileRole(
  id: string,
  role: GlobalRole
) {
  const supabase = await getSupabase()
  const { error, data, status, statusText } = await supabase
    .from('profiles')
    .update({ global_role: role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { error, data, status, statusText }
}

export async function updateProfileAccountType(
  id: string,
  accountType: AccountType
) {
  const supabase = await getSupabase()
  const { error, data, status, statusText } = await supabase
    .from('profiles')
    .update({ account_type: accountType, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { error, data, status, statusText }
}

export async function getProfileById(profileId: string): Promise<IProfile | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data as IProfile
}

export async function getProfileList(
  filters: IProfileFilter
): Promise<ResponsePagination<IProfile>> {
  const supabase = await getSupabase()

  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('profiles').select('*', { count: 'exact' })

  if (filters.first_name) {
    query = query.ilike('first_name', `%${filters.first_name}%`)
  }
  if (filters.last_name) {
    query = query.ilike('last_name', `%${filters.last_name}%`)
  }
  if (filters.searchQuery) {
    query = query.or(
      `email.ilike.%${filters.searchQuery}%,username.ilike.%${filters.searchQuery}%`
    )
  }
  if (filters.account_type) {
    query = query.eq('account_type', filters.account_type)
  }
  if (filters.global_role) {
    query = query.eq('global_role', filters.global_role)
  }
  if (filters.onboarding_completed !== undefined) {
    query = query.eq('onboarding_completed', filters.onboarding_completed)
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching profiles:', error)
    return {
      data: [],
      total: 0,
      page,
      pageSize
    }
  }

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize
  }
}

export async function getProfileFull(profileId: string): Promise<IProfileFull | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('user_profile_with_institutions')
    .select('*')
    .eq('id', profileId)
    .single()

  if (error) {
    console.error('Error fetching full profile:', error)
    return null
  }

  return data as IProfileFull
}
export async function updateInterest(userId: string, data: Interests) {
  const supabase = await getSupabase()

  const { data: interests, error, status, statusText } = await supabase
    .from('interests')
    .upsert([
      {
        user_id: userId,
        interests: data.interests,
        event_types: data.eventTypes,
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  return { data: interests, error, status, statusText }
}

export async function updateNotifications({
  id,
  dataForm
}: {
  id: string
  dataForm: Notifications
}) {
  const supabase = await getSupabase()

  const { data, error, status, statusText } = await supabase
    .from('notifications')
    .upsert([
      {
        user_id: id,
        email_notifications: dataForm.email_notifications,
        push_notifications: dataForm.push_notifications,
        event_reminders: dataForm.event_reminders,
        weekly_digest: dataForm.weekly_digest,
        profile_visibility: dataForm.profile_visibility,
        show_location: dataForm.show_location,
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  return { data, error, status, statusText }
}

export async function updateUserRoles({
  userId,
  roles,
  revalidateUrl
}: {
  userId: string
  roles: string[] | null
  revalidateUrl?: string
}) {
  const supabase = await getSupabase()

  // Mapear el array de roles al nuevo Enum global_role
  let globalRole: GlobalRole = 'user'
  if (roles && roles.length > 0) {
    if (roles.includes('SUPER_ADMIN')) {
      globalRole = 'super_admin'
    } else if (roles.includes('ADMIN')) {
      globalRole = 'admin'
    }
  }

  const { data, error, status, statusText } = await supabase
    .from('profiles')
    .update({ global_role: globalRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (revalidateUrl) {
    revalidatePath(revalidateUrl)
  }

  return { data, error, status, statusText }
}
