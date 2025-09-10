'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Event, ResponsePagination } from '@/types'
import { EventsList } from './events-list'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'
import { fetchEventList } from '@/services/events.services'

export default function UserEventsPage() {
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
          pageSize: 12
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
    console.log('Ver detalles del evento:', eventId)
    // router.push(`/events/${eventId}`)
  }

  const handleCreateEvent = () => {
    // Implementar navegación a página de creación
    console.log('Crear nuevo evento')
    // router.push('/events/create')
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
        <div>
          <h1 className="text-3xl font-bold text-balance">Mis Eventos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona y visualiza todos tus eventos creados
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={handleCreateEvent} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
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
