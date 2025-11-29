'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EventStatus, type Event, type ResponsePagination } from '@/types'
import { EventsList } from './events-list'
import { fetchEventList } from '@/services/events.services'
import { APP_URL } from '@/data/config-app-url'

interface UserEventsPageProps {
  isAuthenticated: boolean
}

export default function UserEventsPage({
  isAuthenticated
}: UserEventsPageProps) {
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
    router.push(APP_URL.DASHBOARD.EVENTS.DETAIL(eventId))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
        isAuthenticated={isAuthenticated}
      />
    </div>
  )
}
