'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { LayoutTemplate } from 'lucide-react'
import {
  EventTicketform,
  EventMapZone,
  EventMap,
  MapConfig
} from '@/modules/events/schemas'
import {
  createEventTicket,
  deleteEventTicket,
  updateEventTicket
} from '@/services/events.ticket.service'
import { createEventMap, deleteEventMap } from '@/services/events.maps.service'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'
import { DesingnerForm } from './desingner-form'
import { toast } from 'react-toastify'

// Importamos los sub-componentes refactorizados
import { TicketsSection } from './tickets-section'
import { MapCreatorActions } from './map-creator-actions'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { MapCard } from './map-card'

interface EventMapDesignerProps {
  eventId: string
  initialTickets: EventTicketform[]
  initialZones: EventMapZone[]
  initialMaps: EventMap[]
}

export const EventMapDesigner: React.FC<EventMapDesignerProps> = ({
  eventId,
  initialTickets,
  initialZones,
  initialMaps
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // --- Estados de Datos ---
  const [tickets, setTickets] = useState<EventTicketform[]>(initialTickets)
  const [maps, setMaps] = useState<EventMap[]>(initialMaps)

  // --- Estados de UI ---
  const [selectedMap, setSelectedMap] = useState<EventMap | null>(null)
  const [mapToDelete, setMapToDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Sincronizar URL con estado de diseñador
  useEffect(() => {
    const mapIdFromUrl = searchParams.get('map')
    if (mapIdFromUrl) {
      const mapFound = maps.find((m) => m.id === mapIdFromUrl)
      if (mapFound) setSelectedMap(mapFound)
    } else {
      setSelectedMap(null)
    }
  }, [searchParams, maps])

  // --- HANDLERS TICKETS ---
  const handleSaveTicket = async (
    ticketData: Partial<EventTicketform>,
    editingId: string | null
  ) => {
    startTransition(async () => {
      const payload: Partial<EventTicketform> = {
        event_id: eventId,
        currency: 'PEN',
        is_active: true,
        ...ticketData,
        description:
          ticketData.description || `${ticketData.quantity_total} personas`
      }

      if (editingId) {
        const { data, error } = await updateEventTicket(editingId, payload)
        if (!error && data) {
          setTickets((prev) => prev.map((t) => (t.id === editingId ? data : t)))
        } else {
          toast.error(
            <ToastCustom
              title="Error"
              description="No se pudo actualizar el ticket."
            />,
            { autoClose: 5000 }
          )
        }
      } else {
        const { data, error } = await createEventTicket(
          payload as EventTicketform
        )
        if (!error && data) {
          setTickets((prev) => [...prev, data])
        } else {
          toast.error(
            <ToastCustom
              title="Error"
              description="No se pudo crear el ticket."
            />,
            { autoClose: 5000 }
          )
        }
      }
    })
  }

  const handleDeleteTicket = async (id: string) => {
    startTransition(async () => {
      const { error } = await deleteEventTicket(id)
      if (!error) {
        setTickets((prev) => prev.filter((t) => t.id !== id))
      } else {
        toast.error(
          <ToastCustom
            title="Error"
            description="No se pudo eliminar el ticket."
          />,
          { autoClose: 5000 }
        )
      }
    })
  }

  // --- HANDLERS MAPAS ---
  const handleCreateMap = async (config: {
    name?: string
    width: number
    height: number
    bg?: string | null
    config?: MapConfig
  }) => {
    startTransition(async () => {
      const newMapPayload: EventMap = {
        name: config.name || 'Mapa sin título',
        event_id: eventId,
        width: config.width,
        height: config.height,
        background_image_url: config.bg || null,
        config: config?.config
      }
      const { data, error } = await createEventMap(newMapPayload)
      if (!error && data) {
        setMaps((prev) => [...prev, data])
        router.push(`?map=${data.id}`)
      } else {
        toast.error(
          <ToastCustom title="Error" description="No se pudo crear el mapa." />,
          { autoClose: 5000 }
        )
      }
    })
  }

  const handleDeleteMap = async () => {
    if (!mapToDelete) return
    startTransition(async () => {
      const { error } = await deleteEventMap(mapToDelete)
      if (!error) {
        setMaps((prev) => prev.filter((m) => m.id !== mapToDelete))
        setMapToDelete(null)
      } else {
        toast.error(
          <ToastCustom
            title="Error"
            description="No se pudo eliminar el mapa."
          />,
          { autoClose: 5000 }
        )
      }
    })
  }

  // --- RENDER ---
  return (
    <div className="w-full space-y-10">
      {/* 1. SECCIÓN TICKETS */}
      <TicketsSection
        tickets={tickets}
        onSaveTicket={handleSaveTicket}
        onDeleteTicket={handleDeleteTicket}
        isPending={isPending}
      />

      {/* 2. SECCIÓN MAPAS */}
      <div className="w-full flex flex-col gap-8">
        {/* Header de la Sección */}
        <div className="flex flex-col sm:flex-row justify-between items-end border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div>
            <h2 className="text-xl tracking-tight uppercase font-semibold">
              2. Gestión de Mapas y Escenarios
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Crea y administra los planos de distribución para tus eventos.
            </p>
          </div>
          {/* Tu componente de acciones existente */}
          <div className="mt-4 sm:mt-0">
            <MapCreatorActions
              onCreateMap={handleCreateMap}
              isPending={isPending}
            />
          </div>
        </div>

        {/* Grid de Escenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map, index) => (
            <MapCard
              key={map.id}
              map={map}
              index={index}
              onDesign={(id) => router.push(`?map=${id}`)}
              onDelete={(id) => setMapToDelete(id)}
            />
          ))}

          {/* Estado Vacío (Empty State) */}
          {maps.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30 dark:border-zinc-800">
              <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                <LayoutTemplate size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No hay escenarios creados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                Comienza creando tu primer plano de distribución para gestionar
                las zonas y asientos.
              </p>
              {/* Aquí podrías poner el botón que abre el modal de crear */}
              {/* <Button onClick={() => setIsCreateOpen(true)}>Crear Escenario</Button> */}
            </div>
          )}
        </div>
      </div>
      {/* MODAL DISEÑADOR (FULL SCREEN) */}
      {selectedMap && (
        <DesingnerForm
          mapData={selectedMap}
          ticketsData={tickets}
          initialMapZones={initialZones.filter(
            (z) => z.map_id === selectedMap.id
          )}
          onClose={() => router.push(pathname)}
        />
      )}

      {/* CONFIRMACIÓN BORRAR MAPA */}
      <ConfirmAlertDialog
        open={!!mapToDelete}
        onOpenChange={(open) => !open && setMapToDelete(null)}
        title="¿Eliminar Mapa?"
        description="Se eliminará este diagrama y toda su distribución visual."
        confirmText="Sí, eliminar"
        confirmVariant="destructive"
        isLoading={isPending}
        onConfirm={handleDeleteMap}
      />
    </div>
  )
}
