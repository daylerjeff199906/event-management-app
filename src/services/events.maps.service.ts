'use server'
import { getSupabase } from './core.supabase'
import { EventMapZone } from "@/modules/events/schemas";
import { revalidatePath } from 'next/cache'

export async function fetchEventMapZonesByEventId(
    eventId: string
): Promise<{ data: EventMapZone[] | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .select('*')
            .eq('event_id', eventId)

        return {
            data: result.data as EventMapZone[] | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load map zones:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function fetchEventMapZoneById(
    zoneId: string
): Promise<{ data: EventMapZone | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
            .select('*')
            .eq('id', zoneId)
            .single()

        return {
            data: result.data as EventMapZone | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function createEventMapZone(
    zone: EventMapZone
): Promise<{ data: EventMapZone | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('event_maps')
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
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function updateEventMapZone(
    zoneId: string,
    patch: Partial<EventMapZone>
): Promise<{ data: EventMapZone | null; error: string }> {
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
            data: result.data as EventMapZone | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not update map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
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
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function deleteEventMapZone(
    zoneId: string
): Promise<{ data: EventMapZone | null; error: string }> {
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
            data: result.data as EventMapZone | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not remove map zone:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}