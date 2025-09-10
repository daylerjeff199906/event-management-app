'use server'
import { getSupabase } from './core.supabase'
import {
  Event,
  EventFilterByInstitution,
  ResponsePagination,
  EventsFilters
} from '@/types'

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
    user_id
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

export async function fetchEventList(): Promise<{
  filters: EventsFilters
  data: ResponsePagination<Event> | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  const filters: EventsFilters = {
    page: 1,
    pageSize: 10
  }
  try {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_name')
      .range(from, to)
    if (error) {
      console.error('Error fetching events:', error)
      return { filters, data: null, error }
    }
    const response: ResponsePagination<Event> = {
      data: data as Event[],
      total: count ?? 0,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 10
    }
    return { filters, data: response, error: null }
  } catch (err) {
    console.error('Unexpected error fetching events:', err)
    return { filters, data: null, error: err as Error }
  }
}
