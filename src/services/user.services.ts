'use server'
import {
  PersonalInfo,
  Interests,
  Notifications
} from '@/modules/portal/lib/validations'
import { getSupabase } from './core.supabase'

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
          email_notifications: notificationsData.emailNotifications,
          push_notifications: notificationsData.pushNotifications,
          event_reminders: notificationsData.eventReminders,
          weekly_digest: notificationsData.weeklyDigest,
          profile_visibility: notificationsData.profileVisibility,
          show_location: notificationsData.showLocation
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
