'use server'
import { getSupabase } from './core.supabase'
import { EventDetails } from '@/types'

export async function getEventDetailsByIdEvent(
  eventId: string
): Promise<{ data: EventDetails | null; error: string }> {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('events_details')
      .select('*')
      .eq('id', eventId)
      .single()

    return {
      data: data as EventDetails | null,
      error: error ? error.message : ''
    }
  } catch (err) {
    console.error('Error fetching event details:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}
