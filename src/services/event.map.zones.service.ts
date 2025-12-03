'use server'
import { getSupabase } from './core.supabase'
import { EventMapZone } from '@/modules/events/schemas'
import { revalidatePath } from 'next/cache'

const TABLE_NAME = 'event_map_zones'

export async function fetchEventMapZonesByMapId(
  mapId: string
): Promise<{ data: EventMapZone[] | null; error: string }> {
  try {
    const client = await getSupabase()
    const result = await client
      .from(TABLE_NAME)
      .select('*')
      .eq('map_id', mapId)

    return {
      data: result.data as EventMapZone[] | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not load map zones:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function fetchEventMapZoneById(
  zoneId: string
): Promise<{ data: EventMapZone | null; error: string }> {
  try {
    const client = await getSupabase()
    const result = await client
      .from(TABLE_NAME)
      .select('*')
      .eq('id', zoneId)
      .single()

    return {
      data: result.data as EventMapZone | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not load map zone:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function createEventMapZone(
  zone: EventMapZone
): Promise<{ data: EventMapZone | null; error: string }> {
  try {
    const client = await getSupabase()
    const result = await client
      .from(TABLE_NAME)
      .insert([zone])
      .select('*')
      .single()

    revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

    return {
      data: result.data as EventMapZone | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not create map zone:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function updateEventMapZone(
  zoneId: string,
  patch: Partial<EventMapZone>
): Promise<{ data: EventMapZone | null; error: string }> {
  try {
    const client = await getSupabase()
    const result = await client
      .from(TABLE_NAME)
      .update(patch)
      .eq('id', zoneId)
      .select('*')
      .single()

    revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

    return {
      data: result.data as EventMapZone | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not update map zone:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function upsertEventMapZone({
  zoneId,
  payload
}: {
  zoneId?: string
  payload: Partial<EventMapZone>
}): Promise<{ data: EventMapZone | null; error: string }> {
  try {
    if (zoneId) {
      return await updateEventMapZone(zoneId, payload)
    } else {
      return await createEventMapZone(payload as EventMapZone)
    }
  } catch (e) {
    console.error('Could not upsert map zone:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function deleteEventMapZone(
  zoneId: string
): Promise<{ data: EventMapZone | null; error: string }> {
  try {
    const client = await getSupabase()
    const result = await client
      .from(TABLE_NAME)
      .delete()
      .eq('id', zoneId)
      .select('*')
      .single()

    revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

    return {
      data: result.data as EventMapZone | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not remove map zone:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}

export async function bulkUpsertEventMapZones(
  eventId: string,
  zones: Partial<EventMapZone>[]
): Promise<{ data: EventMapZone[] | null; error: string }> {
  try {
    const client = await getSupabase()
    const zonesWithEventId = zones.map((zone) => ({
      ...zone,
      event_id: eventId
    }))
    const result = await client
      .from('event_map_zones')
      .upsert(zonesWithEventId)
      .select('*')
    revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

    return {
      data: result.data as EventMapZone[] | null,
      error: result.error ? result.error.message : ''
    }
  } catch (e) {
    console.error('Could not bulk upsert map zones:', e)
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }
}
