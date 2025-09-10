'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Event, ResponsePagination } from '@/types'
import { EventCardUser } from '../components'
import { Button } from '@/components/ui/button'
import { Loader2, Calendar } from 'lucide-react'

interface EventsListProps {
  initialData?: ResponsePagination<Event>
  onLoadMore?: (page: number) => Promise<{
    data: Event[]
    total: number
    error: Error | null
  }>
  onViewDetails?: (eventId: string) => void
  currentPage?: number
}

export function EventsList({
  initialData,
  onLoadMore,
  onViewDetails = () => {}
}: EventsListProps) {
  const searchParams = useSearchParams()
  const urlPage = parseInt(searchParams.get('page') || '1')

  const [events, setEvents] = useState<Event[]>(initialData?.data || [])
  const [totalEvents, setTotalEvents] = useState(initialData?.total || 0)
  const [loading, setLoading] = useState(false)

  // Sincronizar con parámetros de URL
  useEffect(() => {
    if (initialData) {
      setEvents(initialData.data || [])
      setTotalEvents(initialData.total || 0)
    }
  }, [initialData])

  const hasMoreEvents = events.length < totalEvents

  const handleLoadMore = async () => {
    if (!onLoadMore || loading || !hasMoreEvents) return

    setLoading(true)
    try {
      const nextPage = urlPage + 1
      const response = await onLoadMore(nextPage)

      if (!response.error) {
        setEvents((prev) => [...prev, ...response.data])
        setTotalEvents(response.total)
      }
    } catch (error) {
      console.error('Error loading more events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!events.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No hay eventos</h3>
        <p className="text-muted-foreground max-w-md">
          Aún no tienes eventos creados. Crea tu primer evento para comenzar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCardUser
            key={event.id}
            event={event}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreEvents && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              `Ver más resultados (${events.length} de ${totalEvents})`
            )}
          </Button>
        </div>
      )}

      {/* Results Counter */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {events.length} de {totalEvents} eventos
      </div>
    </div>
  )
}
