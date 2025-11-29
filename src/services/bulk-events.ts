'use server'

import { APP_URL } from '@/data/config-app-url'
import { getSupabase } from './core.supabase'
import {
  eventActivitySchema,
  EventActivityForm
} from '@/modules/events/schemas'
import { revalidatePath } from 'next/cache'

export type BulkImportResult = {
  successCount: number
  skippedCount: number
  errors: string[]
}

// Recibimos eventId aparte para inyectarlo en cada registro
export async function bulkCreateEventActivities(
  eventId: string,
  activities: Partial<EventActivityForm>[]
): Promise<{ data: BulkImportResult | null; error: string | null }> {
  const supabase = await getSupabase()

  const result: BulkImportResult = {
    successCount: 0,
    skippedCount: 0,
    errors: []
  }

  try {
    // Validar que el eventId sea válido antes de empezar
    if (!eventId) {
      return { data: null, error: 'El ID del evento principal es requerido.' }
    }

    for (const activity of activities) {
      // 1. Preparar el payload inyectando el event_id
      const payloadToValidate = {
        ...activity,
        event_id: eventId, // Inyectamos el ID padre
        status: activity.status || 'DRAFT'
      }

      // 2. Validar con Zod (Schema Verdadero)
      const parsed = eventActivitySchema.safeParse(payloadToValidate)

      if (!parsed.success) {
        // Formatear errores de Zod para que sean legibles
        const errorMsg = parsed.error.issues.map((i) => i.message).join(', ')
        result.errors.push(
          `Error en actividad "${
            activity.activity_name || 'Desconocida'
          }": ${errorMsg}`
        )
        continue
      }

      const cleanActivity = parsed.data

      // 3. Verificar duplicados
      // Usamos start_time (timestamp) y activity_name dentro del MISMO evento
      const { data: existing } = await supabase
        .from('event_activities')
        .select('id')
        .eq('event_id', eventId)
        .eq('activity_name', cleanActivity.activity_name)
        // Convertimos a ISO string para comparar en Supabase
        .eq('start_time', cleanActivity.start_time.toISOString())
        .maybeSingle()

      if (existing) {
        result.skippedCount++
        continue
      }

      // 4. Insertar
      const { error: insertError } = await supabase
        .from('event_activities')
        .insert([cleanActivity])

      if (insertError) {
        result.errors.push(
          `Error insertando "${cleanActivity.activity_name}": ${insertError.message}`
        )
      } else {
        result.successCount++
      }
    }

    // Ajusta esta ruta a la que uses para ver la lista de actividades
    revalidatePath(
      APP_URL.ORGANIZATION.INSTITUTION.ADD_SCHEDULE(eventId, eventId)
    )
    return { data: result, error: null }
  } catch (err) {
    console.error('Error masivo inesperado:', err)
    return {
      data: null,
      error: 'Ocurrió un error interno procesando el archivo.'
    }
  }
}
