'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Edit3, Map as MapIcon, MoreVertical, Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DesingnerForm } from './desingner-form'
import { toast } from 'react-toastify'

// Importamos los sub-componentes refactorizados
import { TicketsSection } from './tickets-section'
import { MapCreatorActions } from './map-creator-actions'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

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
    width: number
    height: number
    bg?: string | null
    config?: MapConfig
  }) => {
    startTransition(async () => {
      const newMapPayload: EventMap = {
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
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-xl tracking-tight uppercase font-semibold">
              2. Distribución de Escenario
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Crea uno o más mapas y distribuye los tickets.
            </p>
          </div>

          <MapCreatorActions
            onCreateMap={handleCreateMap}
            isPending={isPending}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {maps.map((map, index) => (
            <div
              key={map.id}
              className="border rounded-lg p-4 flex flex-col gap-4 bg-gray-50 hover:bg-gray-100 transition-colors relative group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md">
                  <MapIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase">
                    Escenario #{index + 1}
                  </h4>
                  <p className="text-xs text-gray-500">
                    ID: ...{map.id?.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  size="sm"
                  onClick={() => router.push(`?map=${map.id}`)}
                >
                  <Edit3 size={14} className="mr-2" /> DISEÑAR
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setMapToDelete(map.id!)}
                    >
                      <Trash2 size={14} className="mr-2" /> Eliminar Mapa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {maps.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              No hay mapas creados. Crea uno para comenzar a diseñar.
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
