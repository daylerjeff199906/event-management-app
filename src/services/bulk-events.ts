'use server'

import { getSupabase } from './core.supabase'
import { eventSchema, EventFormData } from '@/modules/events/schemas' // Ajusta la ruta a tu schema
import { revalidatePath } from 'next/cache'

export type BulkImportResult = {
  successCount: number
  skippedCount: number
  errors: string[]
}

export async function bulkCreateEventActivities(
  events: EventFormData[]
): Promise<{ data: BulkImportResult | null; error: string | null }> {
  const supabase = await getSupabase()
  const result: BulkImportResult = {
    successCount: 0,
    skippedCount: 0,
    errors: []
  }

  try {
    for (const event of events) {
      // 1. Validar con Zod (Doble chequeo servidor)
      const parsed = eventSchema.safeParse(event)

      if (!parsed.success) {
        result.errors.push(
          `Error en evento "${event.event_name}": Datos inválidos.`
        )
        continue
      }

      const cleanEvent = parsed.data

      // 2. Verificar duplicados
      // Buscamos por nombre y fecha exacta para determinar si es el "mismo" evento
      // NOTA: Ajusta 'activity_name' si tu columna en DB es 'event_name'
      const { data: existing } = await supabase
        .from('event_activities')
        .select('id')
        .eq('activity_name', cleanEvent.event_name)
        .eq('start_date', cleanEvent.start_date.toISOString())
        .maybeSingle()

      if (existing) {
        result.skippedCount++
        continue // Saltamos este ciclo, no creamos nada
      }

      // 3. Insertar si no existe
      // Mapeamos event_name a activity_name si la DB lo requiere, sino usa spread directo
      const payload = {
        ...cleanEvent,
        activity_name: cleanEvent.event_name, // Parche por si tu DB usa activity_name
        // Aseguramos status por defecto si no viene
        status: cleanEvent.status || 'DRAFT'
      }

      const { error: insertError } = await supabase
        .from('event_activities')
        .insert([payload])

      if (insertError) {
        result.errors.push(
          `Error insertando "${cleanEvent.event_name}": ${insertError.message}`
        )
      } else {
        result.successCount++
      }
    }

    revalidatePath('/events')
    return { data: result, error: null }
  } catch (err) {
    console.error('Error masivo inesperado:', err)
    return { data: null, error: 'Ocurrió un error procesando el archivo.' }
  }
}
