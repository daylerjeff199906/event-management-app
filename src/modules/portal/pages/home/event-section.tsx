'use client'
import { useEffect, useState } from 'react'
import { Event, EventStatus } from '@/types'
import { fetchEventList } from '@/services/events.services'
import { EventCardComponent } from '../../components/card-event'

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handleLike = (eventId: string) => {
    console.log('Like toggled for event:', eventId)
  }

  const loadEvents = async () => {
    try {
      const data = await fetchEventList({
        status: EventStatus.PUBLIC
      })
      setEvents(data.data?.data || [])
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
    <div className="space-y-6 mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-32">
      <div className="text-center mb-10">
        <h1 className="text-5xl mb-4">Eventos Destacados</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          Descubre los eventos más emocionantes que tenemos preparados para ti.
          Desde conferencias hasta festivales, hay algo para todos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? // Skeleton loading
            Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          : events.map((event) => (
              <EventCardComponent
                key={event.id}
                event={event}
                onLike={handleLike}
                primaryButtonLabel="Me interesa"
              />
            ))}
      </div>
    </div>
  )
}

// Componente Skeleton para loading
function EventCardSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
