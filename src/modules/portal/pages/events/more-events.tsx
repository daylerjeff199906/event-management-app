/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from 'react'
import { Event } from '@/types'
import { fetchEventsExcludingId } from '@/services/events.services'
import { EventCardUser } from '@/modules/events'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
import { EventCardSkeleton } from '../../components/event-card-skeleton'

interface MoreEventsSectionProps {
  uuid_event?: string
}

export function MoreEventsSection({ uuid_event }: MoreEventsSectionProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const handleViewDetails = (eventId: string) => {
    // Implementar navegación a página de detalles
    router.push(APP_URL.PORTAL.EVENTS.DETAIL(eventId))
  }

  const loadEvents = async () => {
    try {
      const data = await fetchEventsExcludingId(uuid_event || '')
      setEvents(data.data ?? [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl text-foreground">También te puede interesar</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? // Skeleton loading
            Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          : events.map((event) => (
              <EventCardUser
                key={event.id}
                event={event}
                onViewDetails={handleViewDetails}
                hiddenStatus
              />
            ))}
      </div>
    </div>
  )
}
