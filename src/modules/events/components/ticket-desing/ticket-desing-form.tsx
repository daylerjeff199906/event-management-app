'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Circle,
  Edit3,
  LayoutTemplate,
  MoreVertical,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Trash2
} from 'lucide-react'
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
import { cn } from '@/lib/utils'

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

  // --- Helper para el Icono según la Forma ---
  const getShapeInfo = (shape?: string) => {
    switch (shape) {
      case 'square':
        return { icon: <Square size={20} />, label: 'Cuadrado' }
      case 'vertical':
        return { icon: <RectangleVertical size={20} />, label: 'Vertical' }
      case 'stadium':
        return {
          icon: <Circle className="scale-x-125" size={20} />,
          label: 'Estadio'
        } // Truco visual para estadio
      case 'circle':
        return { icon: <Circle size={20} />, label: 'Circular' }
      case 'rectangle':
      default:
        return { icon: <RectangleHorizontal size={20} />, label: 'Rectangular' }
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map, index) => {
            // Obtenemos la info visual basada en la config guardada
            const shapeInfo = getShapeInfo(map.config?.shape)

            return (
              <div
                key={map.id}
                className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                {/* Header de la Tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Icono Identificador de Forma */}
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                        'bg-gray-100 text-gray-600', // Light mode
                        'dark:bg-zinc-800 dark:text-zinc-300' // Dark mode
                      )}
                      title={`Forma: ${shapeInfo.label}`}
                    >
                      {shapeInfo.icon}
                    </div>

                    {/* Info Textual */}
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-tight">
                        {map.name || `Escenario #${index + 1}`}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          ID: {map.id?.slice(-4)}
                        </span>
                        {/* Badge de Dimensiones */}
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-full">
                          {map.width}x{map.height}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menú de Opciones */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-zinc-900 dark:border-zinc-800"
                    >
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                        onClick={() => setMapToDelete(map.id!)}
                      >
                        <Trash2 size={14} className="mr-2" /> Eliminar Mapa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Footer de la Tarjeta / Acciones */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 font-medium">
                      {shapeInfo.label}
                    </div>
                    <Button
                      className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-none transition-transform active:scale-95"
                      size="sm"
                      onClick={() => router.push(`?map=${map.id}`)}
                    >
                      <Edit3 size={14} className="mr-2" />
                      DISEÑAR
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Estado Vacío (Empty State) Mejorado */}
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
