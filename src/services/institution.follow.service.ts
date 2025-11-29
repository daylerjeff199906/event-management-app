'use server'

import { getSupabase } from './core.supabase' // Tu cliente supabase existente
import { revalidatePath } from 'next/cache'
import {
  ToggleFollowSchema,
  ToggleFollowInput
} from '@/modules/events/schemas/toggle-follow-schema'

/**
 * Acción para SEGUIR a una institución
 */
export async function followInstitution(input: ToggleFollowInput) {
  // 1. Validar datos con Zod
  const result = ToggleFollowSchema.safeParse(input)
  if (!result.success) {
    return { error: 'Datos inválidos', details: result.error }
  }

  const { institutionId, path } = result.data
  const supabase = await getSupabase()

  // 2. Obtener usuario autenticado (Seguridad crítica)
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Debes iniciar sesión para seguir instituciones.' }
  }

  // 3. Insertar en la base de datos
  const { error } = await supabase.from('institution_followers').insert({
    user_id: user.id,
    institution_id: institutionId
  })

  // 4. Manejo de errores (ej. si ya lo sigue)
  if (error) {
    // Código 23505 es violación de unique constraint (ya lo sigue)
    if (error.code === '23505') {
      return { error: 'Ya sigues a esta institución.' }
    }
    console.error('Error al seguir:', error)
    return { error: 'No se pudo seguir a la institución.' }
  }

  // 5. Actualizar la caché de Next.js para que la UI cambie al instante
  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}

/**
 * Acción para DEJAR DE SEGUIR (Unfollow)
 */
export async function unfollowInstitution(input: ToggleFollowInput) {
  const result = ToggleFollowSchema.safeParse(input)
  if (!result.success) return { error: 'Datos inválidos' }

  const { institutionId, path } = result.data
  const supabase = await getSupabase()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('institution_followers')
    .delete()
    .match({
      user_id: user.id,
      institution_id: institutionId
    })

  if (error) {
    console.error('Error al dejar de seguir:', error)
    return { error: 'Error al procesar la solicitud.' }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}

/**
 * Función de lectura (no es una acción de mutación)
 * Para saber si el botón debe decir "Seguir" o "Siguiendo" al cargar la página
 */
export async function getInstitutionFollowStatus(institutionId: string) {
  const supabase = await getSupabase()

  // No necesitamos lanzar error si no hay usuario, simplemente retornamos false
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { isFollowing: false }

  const { data, error } = await supabase
    .from('institution_followers')
    .select('id')
    .eq('user_id', user.id)
    .eq('institution_id', institutionId)
    .single()

  return { isFollowing: !!data && !error }
}
