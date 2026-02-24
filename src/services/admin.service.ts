'use server'
import { getSupabase } from './core.supabase'

// Types
interface RecentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  profile_image: string | null
}

export interface RecentEvent {
  id: string
  event_name: string
  start_date: string
  created_at: string
  cover_image_url: string | null
  institution_name: string | null
  institution_id: string | null
}

interface PendingRequest {
  id: string
  institution_name: string
  contact_email: string
  contact_person: string | null
  created_at: string
  request_status: string
}

interface DashboardStats {
  totalEvents: number
  totalUsers: number
  totalActiveInstitutions: number
  totalRegistrationRequests: number
  recentUsers: RecentUser[]
  recentEvents: RecentEvent[]
  pendingRequests: PendingRequest[]
}

interface CountQueryResult {
  data: null
  error: PostgrestError | null
  count: number | null
}

interface DataQueryResult<T> {
  data: T | null
  error: PostgrestError | null
}

interface Institution {
  institution_name: string
  id: string
}

export interface EventWithInstitution {
  id: string
  event_name: string
  start_date: string
  created_at: string
  cover_image_url: string | null
  institution: Institution | null
}

// Constants
const RECENT_USERS_LIMIT = 5
const RECENT_EVENTS_LIMIT = 5
const PENDING_REQUESTS_LIMIT = 10

type PostgrestError = {
  message: string
  details: string
  hint: string
  code: string
}

class DashboardService {
  private supabase: Awaited<ReturnType<typeof getSupabase>>

  private constructor(supabase: Awaited<ReturnType<typeof getSupabase>>) {
    this.supabase = supabase
  }

  static async create(): Promise<DashboardService> {
    const supabase = await getSupabase()
    return new DashboardService(supabase)
  }

  private async executeCountQuery(
    table: string,
    filter?: string
  ): Promise<CountQueryResult> {
    let query = this.supabase
      .from(table)
      .select('id', { count: 'exact', head: true })

    if (filter === 'active_institutions') {
      query = query.not('status', 'is', null)
    }

    return (await query) as CountQueryResult
  }

  private async getTotalEvents(): Promise<CountQueryResult> {
    return await this.executeCountQuery('events')
  }

  private async getTotalUsers(): Promise<CountQueryResult> {
    return await this.executeCountQuery('profiles')
  }

  private async getActiveInstitutions(): Promise<CountQueryResult> {
    return await this.executeCountQuery('institutions', 'active_institutions')
  }

  private async getTotalRegistrationRequests(): Promise<CountQueryResult> {
    return await this.executeCountQuery('registration_requests')
  }

  private async getRecentUsers(): Promise<DataQueryResult<RecentUser[]>> {
    return await this.supabase
      .from('profiles')
      .select('id, first_name, last_name, email, created_at, profile_image')
      .order('created_at', { ascending: false })
      .limit(RECENT_USERS_LIMIT)
  }

  private async getRecentEvents(): Promise<
    DataQueryResult<EventWithInstitution[]>
  > {
    return await this.supabase
      .from('events')
      .select()
      .order('created_at', { ascending: false })
      .limit(RECENT_EVENTS_LIMIT)
  }

  private async getPendingRequests(): Promise<
    DataQueryResult<PendingRequest[]>
  > {
    return await this.supabase
      .from('registration_requests')
      .select(
        'id, institution_name, contact_email, contact_person, created_at, request_status'
      )
      .eq('request_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(PENDING_REQUESTS_LIMIT)
  }

  private processEventData(events: EventWithInstitution[]): RecentEvent[] {
    return events.map((event) => ({
      id: event.id,
      event_name: event.event_name,
      start_date: event.start_date,
      created_at: event.created_at,
      cover_image_url: event.cover_image_url,
      institution_name: event.institution?.institution_name || null,
      institution_id: event.institution?.id || null
    }))
  }

  private validateQueryResults(
    countResults: CountQueryResult[],
    dataResults: DataQueryResult<unknown>[]
  ): void {
    const allErrors = [
      ...countResults.map((result) => result.error),
      ...dataResults.map((result) => result.error)
    ].filter((error): error is PostgrestError => error !== null)

    if (allErrors.length > 0) {
      const errorMessages = allErrors.map((error) => error.message).join(', ')
      throw new Error(`Database errors: ${errorMessages}`)
    }
  }

  private buildStatsResponse(
    counts: number[],
    recentUsers: RecentUser[],
    recentEvents: EventWithInstitution[],
    pendingRequests: PendingRequest[]
  ): DashboardStats {
    const [
      totalEvents,
      totalUsers,
      totalActiveInstitutions,
      totalRegistrationRequests
    ] = counts
    const processedEvents = this.processEventData(recentEvents)

    return {
      totalEvents,
      totalUsers,
      totalActiveInstitutions,
      totalRegistrationRequests,
      recentUsers,
      recentEvents: processedEvents,
      pendingRequests
    }
  }

  async getStats(): Promise<{
    data: DashboardStats | null
    error: Error | null
  }> {
    try {
      const [
        eventsCount,
        usersCount,
        institutionsCount,
        requestsCount,
        recentUsers,
        recentEvents,
        pendingRequests
      ] = await Promise.all([
        this.getTotalEvents(),
        this.getTotalUsers(),
        this.getActiveInstitutions(),
        this.getTotalRegistrationRequests(),
        this.getRecentUsers(),
        this.getRecentEvents(),
        this.getPendingRequests()
      ])

      const countResults = [
        eventsCount,
        usersCount,
        institutionsCount,
        requestsCount
      ]
      const dataResults = [recentUsers, recentEvents, pendingRequests]

      this.validateQueryResults(countResults, dataResults)

      const counts = [
        eventsCount.count || 0,
        usersCount.count || 0,
        institutionsCount.count || 0,
        requestsCount.count || 0
      ]

      const stats = this.buildStatsResponse(
        counts,
        recentUsers.data || [],
        recentEvents.data || [],
        pendingRequests.data || []
      )

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return { data: null, error: error as Error }
    }
  }
}

// Main export function
export async function getDashboardStats(): Promise<{
  data: DashboardStats | null
  error: Error | null
}> {
  const service = await DashboardService.create()
  return await service.getStats()
}
