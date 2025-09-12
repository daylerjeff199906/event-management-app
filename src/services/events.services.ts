'use server'
import { getSupabase } from './core.supabase'
import {
  Event,
  EventFilterByInstitution,
  ResponsePagination,
  EventsFilters,
  EventStatus,
  EventItemDetails
} from '@/types'

import { EventFormData } from '@/modules/events/schemas'

export async function fetchEventsByInstitution(
  filter: EventFilterByInstitution
): Promise<{
  data: ResponsePagination<Event> | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  const {
    searchQuery = '',
    page = 1,
    pageSize = 10,
    institution_id,
    user_id,
    status
  } = filter

  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_name')
      .range(from, to)

    // Apply search filter
    if (searchQuery) {
      query = query.or(
        `event_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      )
    }

    // Apply institution_id filter if provided
    if (institution_id) {
      query = query.eq('institution_id', institution_id)
    }

    // Apply user_id filter if provided
    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    // Only show deleted if status === 'deleted'
    if (status === EventStatus.DELETE) {
      query = query.eq('status', EventStatus.DELETE)
    } else {
      // Otherwise, show only public and draft
      query = query.in('status', [EventStatus.PUBLIC, EventStatus.DRAFT])
      // If status filter is provided and not 'deleted', filter by it
      if (status) {
        query = query.eq('status', status)
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching institution:', error)
      return { data: null, error }
    }

    const response: ResponsePagination<Event> = {
      data: data as Event[],
      total: count ?? 0,
      page,
      pageSize
    }

    return { data: response, error: null }
  } catch (err) {
    console.error('Unexpected error fetching institution:', err)
    return { data: null, error: err as Error }
  }
}

export async function fetchEventById(eventId: string): Promise<{
  data: Event | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    if (error) {
      console.error('Error fetching event by ID:', error)
      return { data: null, error }
    }
    return { data: data as Event, error: null }
  } catch (err) {
    console.error('Unexpected error fetching event by ID:', err)
    return { data: null, error: err as Error }
  }
}

export async function fetchEventList(filter: EventsFilters): Promise<{
  data: ResponsePagination<Event> | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  const {
    page = 1,
    pageSize = 10,
    searchQuery,
    status,
    exclude_status
  } = filter

  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_name')
      .range(from, to)

    // Apply search filter
    if (searchQuery) {
      query = query.or(
        `event_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      )
    }

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Apply exclude_status filter if provided
    if (exclude_status) {
      query = query.neq('status', exclude_status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return { data: null, error }
    }

    const response: ResponsePagination<Event> = {
      data: data as Event[],
      total: count ?? 0,
      page,
      pageSize
    }

    return { data: response, error: null }
  } catch (err) {
    console.error('Unexpected error fetching events:', err)
    return { data: null, error: err as Error }
  }
}

export async function createEvent(eventData: EventFormData): Promise<{
  data: Event | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()
    if (error) {
      console.error('Error creating event:', error)
      return { data: null, error }
    }

    return { data: data as Event, error: null }
  } catch (err) {
    console.error('Unexpected error creating event:', err)
    return { data: null, error: err as Error }
  }
}

export async function updateEvent(
  eventId: string,
  eventData: EventFormData
): Promise<{
  data: Event | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single()
    if (error) {
      console.error('Error updating event:', error)
      return { data: null, error }
    }
    return { data: data as Event, error: null }
  } catch (err) {
    console.error('Unexpected error updating event:', err)
    return { data: null, error: err as Error }
  }
}

export async function updateEventField({
  eventId,
  fieldName,
  fieldValue
}: {
  eventId: string
  fieldName: keyof Event
  fieldValue: string | number | boolean | null
}): Promise<{
  data: Event | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ [fieldName]: fieldValue })
      .eq('id', eventId)
      .select()
      .single()
    if (error) {
      console.error('Error updating event field:', error)
      return { data: null, error }
    }
    return { data: data as Event, error: null }
  } catch (err) {
    console.error('Unexpected error updating event field:', err)
    return { data: null, error: err as Error }
  }
}

export async function fetchEventFullDetails(eventId: string): Promise<{
  data: EventItemDetails | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, categorydata(*), institution(*), userdata(*), author(*)')
      .eq('id', eventId)
      .single()
    if (error) {
      console.error('Error fetching event full details:', error)
      return { data: null, error }
    }
    return { data: data as EventItemDetails, error: null }
  } catch (err) {
    console.error('Unexpected error fetching event full details:', err)
    return { data: null, error: err as Error }
  }
}
