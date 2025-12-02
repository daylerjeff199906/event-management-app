'use server'
import { getSupabase } from './core.supabase'
import { revalidatePath } from 'next/cache'
import { EventTicketform } from "@/modules/events/schemas/event_tickets";

export async function fetchEventTicketsByEventId(
    eventId: string
): Promise<{ data: EventTicketform[] | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('events_tickets')
            .select('*')
            .eq('event_id', eventId)

        return {
            data: result.data as EventTicketform[] | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load tickets:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function fetchEventTicketById(
    ticketId: string
): Promise<{ data: EventTicketform | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('events_tickets')
            .select('*')
            .eq('id', ticketId)
            .single()

        return {
            data: result.data as EventTicketform | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not load ticket:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function createEventTicket(
    ticket: EventTicketform
): Promise<{ data: EventTicketform | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('events_tickets')
            .insert([ticket])
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/tickets')

        return {
            data: result.data as EventTicketform | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not create ticket:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function updateEventTicket(
    ticketId: string,
    patch: Partial<EventTicketform>
): Promise<{ data: EventTicketform | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('events_tickets')
            .update(patch)
            .eq('id', ticketId)
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/tickets')

        return {
            data: result.data as EventTicketform | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not update ticket:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function upsertEventTicket({
    ticketId,
    payload
}: {
    ticketId?: string
    payload: Partial<EventTicketform>
}): Promise<{ data: EventTicketform | null; error: string }> {
    try {
        if (ticketId) {
            return await updateEventTicket(ticketId, payload)
        } else {
            // create requires full shape; cast to EventTicketform if appropriate
            return await createEventTicket(payload as EventTicketform)
        }
    } catch (e) {
        console.error('Could not upsert ticket:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export async function deleteEventTicket(
    ticketId: string
): Promise<{ data: EventTicketform | null; error: string }> {
    try {
        const client = await getSupabase()
        const result = await client
            .from('events_tickets')
            .delete()
            .eq('id', ticketId)
            .select('*')
            .single()

        revalidatePath('/(dashboard)/organizations/[slug]/events/[event]/tickets')

        return {
            data: result.data as EventTicketform | null,
            error: result.error ? result.error.message : ''
        }
    } catch (e) {
        console.error('Could not remove ticket:', e)
        return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}