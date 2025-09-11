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
      .eq('event_id', eventId)
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

export async function createEventDetails(
  eventDetails: EventDetails
): Promise<{ data: EventDetails | null; error: string }> {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('events_details')
      .insert([eventDetails])
      .select('*')
      .single()

    return {
      data: data as EventDetails | null,
      error: error ? error.message : ''
    }
  } catch (err) {
    console.error('Error creating event details:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

export async function updateEventDetails(
  eventId: string,
  eventDetails: Partial<EventDetails>
): Promise<{ data: EventDetails | null; error: string }> {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('events_details')
      .update(eventDetails)
      .eq('id', eventId)
      .select('*')
      .single()

    return {
      data: data as EventDetails | null,
      error: error ? error.message : ''
    }
  } catch (err) {
    console.error('Error updating event details:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

export async function upsertInstitutionDetails({
  eventId,
  details
}: {
  eventId?: string
  details: Partial<EventDetails>
}): Promise<{ data: EventDetails | null; error: string }> {
  try {
    const supabase = await getSupabase()
    // Check if institution exists
    const { data: existing, error: fetchError } = await supabase
      .from('events_details')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116: No rows found
      return { data: null, error: fetchError.message }
    }

    if (!existing) {
      // Create new details
      const { data, error } = await supabase
        .from('events_details')
        .insert([{ ...details, event_id: eventId }])
        .select('*')
        .single()
      return {
        data: data as EventDetails | null,
        error: error ? error.message : ''
      }
    } else {
      // Update existing details
      const { data, error } = await supabase
        .from('events_details')
        .update(details)
        .eq('event_id', eventId)
        .select('*')
        .single()
      return {
        data: data as EventDetails | null,
        error: error ? error.message : ''
      }
    }
  } catch (err) {
    console.error('Error upserting institution details:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}
