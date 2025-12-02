'use server'
import { getSupabase } from './core.supabase'
import { EventMap } from "@/modules/events/schemas";
import { revalidatePath } from 'next/cache'

export async function fetchEventMapsByEventId(
    eventId: string
): Promise<{ data: EventMap[] | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .select('*')
            .eq('event_id', eventId)

        return {
            data: result.data as EventMap[] | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load map zones:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function fetchEventMapById(
    zoneId: string
): Promise<{ data: EventMap | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .select('*')
            .eq('id', zoneId)
            .single()

        return {
            data: result.data as EventMap | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function createEventMap(
    zone: EventMap
): Promise<{ data: EventMap | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .insert([zone])
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

        return {
            data: result.data as EventMap | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not create map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function updateEventMap(
    zoneId: string,
    patch: Partial<EventMap>
): Promise<{ data: EventMap | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .update(patch)
            .eq('id', zoneId)
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

        return {
            data: result.data as EventMap | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not update map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function upsertEventMap({
    zoneId,
    payload
}: {
    zoneId?: string
    payload: Partial<EventMap>
}): Promise<{ data: EventMap | null; error: string }> {
    try {
        if (zoneId) {
            return await updateEventMap(zoneId, payload)
        } else {
            return await createEventMap(payload as EventMap)
        }
    } catch (e) {
        console.error('Could not upsert map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function deleteEventMap(
    zoneId: string
): Promise<{ data: EventMap | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .delete()
            .eq('id', zoneId)
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/maps')

        return {
            data: result.data as EventMap | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not remove map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

