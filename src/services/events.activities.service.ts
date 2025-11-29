'use server'
import { getSupabase } from './core.supabase'
import { EventActivityForm } from "@/modules/events/schemas";
import { EventActivity, ResponsePagination } from "@/types";
import { revalidatePath } from 'next/cache'

export type EventActivitiesFilters = {
    page?: number
    pageSize?: number
    searchQuery?: string
    status?: string
    exclude_status?: string
    event_id?: string
}

export async function fetchEventActivityList(
    filter: EventActivitiesFilters
): Promise<{ data: ResponsePagination<EventActivity> | null; error: Error | null }> {
    const supabase = await getSupabase()
    const {
        page = 1,
        pageSize = 10,
        searchQuery,
        status,
        exclude_status,
        event_id
    } = filter

    try {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('event_activities')
            .select('*', { count: 'exact' })
            .order('activity_name')
            .range(from, to)

        if (searchQuery) {
            query = query.or(
                `activity_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
            )
        }

        if (status) {
            query = query.eq('status', status)
        }

        if (exclude_status) {
            query = query.neq('status', exclude_status)
        }

        if (event_id) {
            query = query.eq('event_id', event_id)
        }

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching event activities:', error)
            return { data: null, error }
        }

        const response: ResponsePagination<EventActivity> = {
            data: (data as EventActivity[]) ?? [],
            total: count ?? 0,
            page,
            pageSize
        }

        return { data: response, error: null }
    } catch (err) {
        console.error('Unexpected error fetching event activities:', err)
        return { data: null, error: err as Error }
    }
}

export async function fetchAllEventActivities(
    opts: { event_id?: string; status?: string; searchQuery?: string } = {}
): Promise<{ data: EventActivity[] | null; error: Error | null }> {
    const supabase = await getSupabase()
    const { event_id, status, searchQuery } = opts

    try {
        let query = supabase.from('event_activities').select('*').order('activity_name')

        if (event_id) query = query.eq('event_id', event_id)
        if (status) query = query.eq('status', status)
        if (searchQuery) {
            query = query.or(
                `activity_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
            )
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching all event activities:', error)
            return { data: null, error }
        }

        return { data: (data as EventActivity[]) ?? [], error: null }
    } catch (err) {
        console.error('Unexpected error fetching all event activities:', err)
        return { data: null, error: err as Error }
    }
}

export async function createEventActivity(
    payload: EventActivityForm
): Promise<{ data: EventActivity | null; error: Error | null }> {
    const supabase = await getSupabase()
    try {
        const { data, error } = await supabase
            .from('event_activities')
            .insert([payload])
            .select('*')
            .single()

        if (error) {
            console.error('Error creating event activity:', error)
            return { data: null, error }
        }

        // revalidate pages that may depend on activities
        revalidatePath('/events')

        return { data: data as EventActivity, error: null }
    } catch (err) {
        console.error('Unexpected error creating event activity:', err)
        return { data: null, error: err as Error }
    }
}

export async function updateEventActivity(
    id: string,
    payload: Partial<EventActivityForm>
): Promise<{ data: EventActivity | null; error: Error | null }> {
    const supabase = await getSupabase()
    try {
        const { data, error } = await supabase
            .from('event_activities')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single()

        if (error) {
            console.error('Error updating event activity:', error)
            return { data: null, error }
        }

        revalidatePath('/events')

        return { data: data as EventActivity, error: null }
    } catch (err) {
        console.error('Unexpected error updating event activity:', err)
        return { data: null, error: err as Error }
    }
}

export async function updateEventActivityField(
    id: string,
    field: string,
    value: unknown
): Promise<{ data: EventActivity | null; error: Error | null }> {
    const supabase = await getSupabase()
    try {
        const payload: Record<string, unknown> = { [field]: value }
        const { data, error } = await supabase
            .from('event_activities')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single()

        if (error) {
            console.error('Error updating event activity field:', error)
            return { data: null, error }
        }

        revalidatePath('/events')

        return { data: data as EventActivity, error: null }
    } catch (err) {
        console.error('Unexpected error updating event activity field:', err)
        return { data: null, error: err as Error }
    }
}

export async function deleteEventActivity(
    id: string
): Promise<{ data: EventActivity | null; error: Error | null }> {
    const supabase = await getSupabase()
    try {
        const { data, error } = await supabase
            .from('event_activities')
            .delete()
            .eq('id', id)
            .select('*')
            .single()

        if (error) {
            console.error('Error deleting event activity:', error)
            return { data: null, error }
        }

        revalidatePath('/events')

        return { data: data as EventActivity, error: null }
    } catch (err) {
        console.error('Unexpected error deleting event activity:', err)
        return { data: null, error: err as Error }
    }
}