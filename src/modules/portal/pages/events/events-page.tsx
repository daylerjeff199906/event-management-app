'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EventStatus, type Event, type ResponsePagination } from '@/types'
import { EventsList } from '@/modules/events/page/events-list'
import { fetchEventList } from '@/services/events.services'
import { APP_URL } from '@/data/config-app-url'
import { EventCardSkeleton } from '../../components/event-card-skeleton'

export const EventsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [initialData, setInitialData] = useState<
    ResponsePagination<Event> | undefined
  >()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchEventList({
          page: currentPage,
          pageSize: 12,
          status: EventStatus.PUBLIC
        })
        setInitialData(data.data?.data ? data.data : undefined)
      } catch (error) {
        console.error('Error loading initial events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [currentPage])

  const handleLoadMore = async (
    page: number
  ): Promise<{
    data: Event[]
    total: number
    error: Error | null
  }> => {
    try {
      // Actualizar la URL con el nuevo número de página
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`?${params.toString()}`, { scroll: false })

      const response = await fetchEventList({
        page,
        pageSize: 10
      })

      return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        error: null
      }
    } catch (error) {
      console.error('Error loading more events:', error)
      return {
        data: [],
        total: 0,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  const handleViewDetails = (eventId: string) => {
    // Implementar navegación a página de detalles
    router.push(APP_URL.PORTAL.EVENTS.DETAIL(eventId))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl text-foreground">
            ¿Qué evento quieres descubrir hoy?
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[400px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl text-foreground">
          ¿Qué evento quieres descubrir hoy?
        </h1>
      </div>

      {/* Events List */}
      <EventsList
        initialData={initialData}
        onLoadMore={handleLoadMore}
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
      />
    </div>
  )
}
