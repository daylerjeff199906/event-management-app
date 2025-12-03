'use client'

import React, { useState, useTransition, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Loader2,
  Edit3,
  Ticket,
  Edit,
  Map as MapIcon,
  MoreVertical
} from 'lucide-react'
import {
  EventTicketform,
  EventMapZone,
  EventMap
} from '@/modules/events/schemas'
import { PRESET_COLORS } from '../../data/types'
import {
  createEventTicket,
  deleteEventTicket,
  updateEventTicket
} from '@/services/events.ticket.service'
import { createEventMap, deleteEventMap } from '@/services/events.maps.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DesingnerForm } from './desingner-form'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

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
  const pathname = usePathname() // Necesario para limpiar la URL al cerrar

  // --- Estados de Datos ---
  const [tickets, setTickets] = useState<EventTicketform[]>(initialTickets)
  const [maps, setMaps] = useState<EventMap[]>(initialMaps)

  // --- Estados de UI ---
  const [selectedMap, setSelectedMap] = useState<EventMap | null>(null)
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false)

  // --- Estados de Edición/Creación Ticket ---
  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    totalCapacity: '',
    description: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // --- Estados de Confirmación ---
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)
  const [mapToDelete, setMapToDelete] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const mapIdFromUrl = searchParams.get('map')

    if (mapIdFromUrl) {
      const mapFound = maps.find((m) => m.id === mapIdFromUrl)
      if (mapFound) {
        setSelectedMap(mapFound)
      }
    } else {
      setSelectedMap(null)
    }
  }, [searchParams, maps])

  // ================= LÓGICA DE TICKETS =================
  const openCreateModal = () => {
    setEditingId(null)
    setNewTicket({ name: '', price: '', totalCapacity: '', description: '' })
    setIsTicketFormOpen(true)
  }

  const startEditing = (ticket: EventTicketform) => {
    setEditingId(ticket.id!)
    setNewTicket({
      name: ticket.name,
      price: ticket.price.toString(),
      totalCapacity: ticket.quantity_total.toString(),
      description: ticket.description || ''
    })
    setIsTicketFormOpen(true)
  }

  const handleSaveTicketType = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.name || !newTicket.price || !newTicket.totalCapacity) return

    startTransition(async () => {
      const payload: Partial<EventTicketform> = {
        event_id: eventId,
        name: newTicket.name.toUpperCase(),
        price: parseFloat(newTicket.price),
        quantity_total: parseInt(newTicket.totalCapacity),
        currency: 'PEN',
        description:
          newTicket.description || `${newTicket.totalCapacity} personas`,
        is_active: true
      }

      if (editingId) {
        const { data, error } = await updateEventTicket(editingId, payload)
        if (error || !data) {
          alert('Error actualizando ticket: ' + error)
          return
        }
        setTickets((prev) => prev.map((t) => (t.id === editingId ? data : t)))
      } else {
        const { data, error } = await createEventTicket(
          payload as EventTicketform
        )
        if (error || !data) {
          alert('Error creando ticket: ' + error)
          return
        }
        setTickets((prev) => [...prev, data])
      }
      setIsTicketFormOpen(false)
      setNewTicket({ name: '', price: '', totalCapacity: '', description: '' })
      setEditingId(null)
    })
  }

  const handleConfirmDeleteTicket = async () => {
    if (!ticketToDelete) return
    startTransition(async () => {
      const { error } = await deleteEventTicket(ticketToDelete)
      if (error) {
        alert('Error al eliminar: ' + error)
        return
      }
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete))
      setTicketToDelete(null)
    })
  }

  // ================= LÓGICA DE MAPAS (ESCENARIOS) =================

  const handleCreateMap = () => {
    startTransition(async () => {
      // Creamos un mapa por defecto
      const newMapPayload: EventMap = {
        event_id: eventId,
        width: 1200,
        height: 1000,
        background_image_url: null
      }

      const { data, error } = await createEventMap(newMapPayload)

      if (error || !data) {
        alert('Error al crear el mapa')
        return
      }

      setMaps((prev) => [...prev, data])

      // CAMBIO: Al crear, solo empujamos la URL.
      // El useEffect detectará el cambio y abrirá el diseñador.
      router.push(`?map=${data.id}`)
    })
  }

  const handleSelectMap = (map: EventMap) => {
    // CAMBIO: Solo empujamos la URL, no seteamos estado manual.
    router.push(`?map=${map.id}`)
  }

  const handleCloseDesigner = () => {
    // CAMBIO: Para cerrar, limpiamos los searchParams volviendo al pathname base.
    router.push(pathname)
  }

  const handleConfirmDeleteMap = async () => {
    if (!mapToDelete) return
    startTransition(async () => {
      const { error } = await deleteEventMap(mapToDelete)
      if (error) {
        alert('Error al eliminar mapa')
        return
      }
      setMaps((prev) => prev.filter((m) => m.id !== mapToDelete))
      setMapToDelete(null)
    })
  }

  // ================= RENDERIZADO =================

  return (
    <div className="w-full space-y-10">
      {/* 1. SECCIÓN GESTIÓN DE TICKETS */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-xl tracking-tight uppercase font-semibold">
              1. Gestión de Entradas
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Define los tipos de entrada y sus precios.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={18} className="mr-2" />
            CREAR TICKET
          </Button>
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {tickets.map((t, idx) => (
            <div
              key={t.id}
              className="flex flex-col md:flex-row border border-black md:h-24 overflow-hidden rounded-lg group transition-all bg-white dark:bg-gray-800"
            >
              <div className="flex-1 p-4 flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
                  }}
                />
                <div className="flex flex-col justify-center">
                  <h3 className="font-black text-lg uppercase leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {t.description || `${t.quantity_total} personas`}
                  </p>
                </div>
              </div>
              <div
                className="w-full md:w-48 text-white flex flex-col items-center justify-center relative py-2 md:py-0"
                style={{
                  backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
                }}
              >
                <span className="font-bold text-2xl tracking-tight">
                  S/{' '}
                  {t.price.toLocaleString('es-PE', {
                    minimumFractionDigits: 2
                  })}
                </span>
                <span className="text-[10px] uppercase font-bold opacity-80 tracking-widest">
                  Precio
                </span>
              </div>
              <div className="w-full md:w-40 bg-gray-50 flex items-center justify-center gap-2 py-2 md:py-0 border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <Button
                  onClick={() => startEditing(t)}
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  onClick={() => setTicketToDelete(t.id!)}
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              No hay tickets creados.
            </div>
          )}
        </div>
      </div>

      {/* 2. SECCIÓN GESTIÓN DE ESCENARIOS (MAPAS) */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-xl tracking-tight uppercase font-semibold">
              2. Distribución de Escenario
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Crea uno o más mapas y distribuye los tickets visualmente.
            </p>
          </div>
          <Button
            onClick={handleCreateMap}
            disabled={isPending}
            variant="outline"
            className="border-black"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Plus size={18} className="mr-2" />
            )}
            NUEVO MAPA
          </Button>
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
                  onClick={() => handleSelectMap(map)}
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

      {/* --- MODAL FORMULARIO DE TICKET --- */}
      <Dialog open={isTicketFormOpen} onOpenChange={setIsTicketFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 uppercase">
              <Ticket className="w-5 h-5" />
              {editingId ? 'Editar Ticket' : 'Nuevo Ticket'}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles de la entrada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTicketType} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold text-gray-500 uppercase"
              >
                Nombre
              </Label>
              <Input
                id="name"
                className="font-bold uppercase"
                placeholder="EJ. GENERAL"
                value={newTicket.name}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="desc"
                className="text-xs font-bold text-gray-500 uppercase"
              >
                Descripción
              </Label>
              <Input
                id="desc"
                placeholder="Detalles..."
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="capacity"
                  className="text-xs font-bold text-gray-500 uppercase"
                >
                  Capacidad
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={newTicket.totalCapacity}
                  onChange={(e) =>
                    setNewTicket({
                      ...newTicket,
                      totalCapacity: e.target.value
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="price"
                  className="text-xs font-bold text-gray-500 uppercase"
                >
                  Precio (S/)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  className="font-bold"
                  value={newTicket.price}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, price: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTicketFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !newTicket.name}
                className="bg-black text-white"
              >
                {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {editingId ? 'Guardar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: DISEÑADOR DE ESCENARIO (FULL SCREEN) --- */}
      {selectedMap && (
        <DesingnerForm
          mapData={selectedMap}
          ticketsData={tickets}
          // Filtramos las zonas que pertenecen SOLO a este mapa
          initialMapZones={initialZones.filter(
            (z) => z.map_id === selectedMap.id
          )}
          onClose={handleCloseDesigner}
        />
      )}

      {/* Alertas de Confirmación */}
      <ConfirmAlertDialog
        open={!!ticketToDelete}
        onOpenChange={(open) => !open && setTicketToDelete(null)}
        title="¿Eliminar Ticket?"
        description="Esta acción eliminará el ticket y sus zonas asociadas en todos los mapas."
        confirmText="Sí, eliminar"
        confirmVariant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirmDeleteTicket}
      />

      <ConfirmAlertDialog
        open={!!mapToDelete}
        onOpenChange={(open) => !open && setMapToDelete(null)}
        title="¿Eliminar Mapa?"
        description="Se eliminará este diagrama y toda su distribución visual. Los tickets no se borrarán."
        confirmText="Sí, eliminar"
        confirmVariant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirmDeleteMap}
      />
    </div>
  )
}
