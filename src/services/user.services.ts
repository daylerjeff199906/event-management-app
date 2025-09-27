'use server'
import {
  PersonalInfo,
  Interests,
  Notifications
} from '@/modules/portal/lib/validations'
import { getSupabase } from './core.supabase'
import { IUser, IUserFilter, ResponsePagination } from '@/types'

export async function insertUserData(formData: PersonalInfo) {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase.from('users').upsert([
      {
        id: user.user?.id, // Asociamos el UUID del usuario autenticado
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile_image: null,
        country: null,
        birth_date: null,
        phone: formData.phone,
        email: user.user?.email, // Guardamos el email del usuario autenticado
        gender: null
      }
    ])
    if (error) {
      console.error('Error insertando los datos:', error)
    } else {
      console.log('Datos del usuario insertados:', data)
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
    // Insertar intereses
    const { data: interests, error: interestsError } = await supabase
      .from('interests')
      .upsert([
        {
          user_id: user.id, // Asociamos el UUID del usuario
          interests: interestsData.interests,
          event_types: interestsData.eventTypes
        }
      ])

    if (interestsError) {
      console.error('Error insertando los intereses:', interestsError)
    } else {
      console.log('Intereses insertados:', interests)
    }

    // Insertar notificaciones
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .upsert([
        {
          user_id: user.id, // Asociamos el UUID del usuario
          email_notifications: notificationsData.email_notifications,
          push_notifications: notificationsData.push_notifications,
          event_reminders: notificationsData.event_reminders,
          weekly_digest: notificationsData.weekly_digest,
          profile_visibility: notificationsData.profile_visibility,
          show_location: notificationsData.show_location
        }
      ])

    if (notificationsError) {
      console.error('Error insertando las notificaciones:', notificationsError)
    } else {
      console.log('Notificaciones insertadas:', notifications)
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
    .from('users')
    .update(dataForm)
    .eq('id', id)
    .select()
    .single()

  return { error, data, status, statusText }
}

export async function updateInterest(id: string, dataForm: Partial<Interests>) {
  const supabase = await getSupabase()
  console.log('ID del interés a actualizar:', id)
  const { error, data, status, statusText } = await supabase
    .from('interests')
    .update({
      interests: dataForm.interests,
      event_types: dataForm.eventTypes
    })
    .eq('user_id', id)
    .select()

  return { error, data, status, statusText }
}

export async function updateNotifications({
  id,
  dataForm
}: {
  id: string
  dataForm: Partial<Notifications>
}) {
  const supabase = await getSupabase()
  console.log('ID de las notificaciones a actualizar:', id)
  const { error, data, status, statusText } = await supabase
    .from('notifications')
    .update({
      email_notifications: dataForm.email_notifications,
      push_notifications: dataForm.push_notifications,
      event_reminders: dataForm.event_reminders,
      weekly_digest: dataForm.weekly_digest,
      profile_visibility: dataForm.profile_visibility,
      show_location: dataForm.show_location
    })
    .eq('user_id', id)
    .select()

  return { error, data, status, statusText }
}

export async function getUserList(
  filters: IUserFilter
): Promise<ResponsePagination<IUser>> {
  const supabase = await getSupabase()

  // Default pagination values
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('users').select('*', { count: 'exact' })

  // Apply filters if present
  if (filters.first_name) {
    query = query.ilike('first_name', `%${filters.first_name}%`)
  }
  if (filters.last_name) {
    query = query.ilike('last_name', `%${filters.last_name}%`)
  }
  if (filters.searchQuery) {
    // Busca por email o username usando OR
    query = query.or(
      `email.ilike.%${filters.searchQuery}%,username.ilike.%${filters.searchQuery}%`
    )
  }
  // Add more filters as needed

  // Pagination
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching users:', error)
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
