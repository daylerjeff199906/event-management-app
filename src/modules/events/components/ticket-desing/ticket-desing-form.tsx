'use client'

import React, { useState, useRef, useEffect, useTransition } from 'react'
import {
  Plus,
  Trash2,
  Move,
  LayoutGrid,
  Save,
  MonitorPlay,
  Loader2,
  Edit3,
  Ticket,
  X,
  Edit
} from 'lucide-react'
import { EventTicketform, EventMapZone } from '@/modules/events/schemas'
import {
  CanvasItem,
  mapZoneToCanvasItem,
  mapCanvasItemToZonePayload,
  snapToGrid,
  PRESET_COLORS,
  GRID_SIZE
} from '../../data/types'
import {
  upsertEventMapZone,
  deleteEventMapZone
} from '@/services/events.maps.service'
import {
  createEventTicket,
  deleteEventTicket,
  updateEventTicket
} from '@/services/events.ticket.service'
import { Button } from '@/components/ui/button'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'

interface EventMapDesignerProps {
  eventId: string
  initialTickets: EventTicketform[]
  initialZones: EventMapZone[]
  mapId: string // Necesario para guardar las zonas
}

export const EventMapDesigner: React.FC<EventMapDesignerProps> = ({
  eventId,
  initialTickets,
  initialZones,
  mapId
}) => {
  // --- Estados ---
  const [tickets, setTickets] = useState<EventTicketform[]>(initialTickets)

  // Inicializar items del canvas
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(() =>
    initialZones.map((z) => mapZoneToCanvasItem(z, initialTickets))
  )

  const [isDesignerOpen, setIsDesignerOpen] = useState(false) // Estado del Modal

  // Estado del Formulario
  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    totalCapacity: '',
    description: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null) // ID del ticket en edición

  // Estado para AlertDialog de eliminación
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)

  // Estados del Canvas (Drag & Drop / Resize)
  const [dragItem, setDragItem] = useState<{
    id: string
    startX: number
    startY: number
    originalX: number
    originalY: number
  } | null>(null)

  const [resizeItem, setResizeItem] = useState<{
    id: string
    handleType: string
    startX: number
    startY: number
    originalX: number
    originalY: number
    originalWidth: number
    originalHeight: number
  } | null>(null)

  const [isPending, startTransition] = useTransition()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Estado para trackear eliminaciones en el canvas (para el botón Guardar)
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  // --- Helpers Visuales ---
  const getVisualItems = () => {
    const counts: Record<string, number> = {}
    canvasItems.forEach((item) => {
      if (item.type === 'TICKET_ZONE' && item.ticketId) {
        counts[item.ticketId] = (counts[item.ticketId] || 0) + 1
      }
    })

    return canvasItems.map((item) => {
      if (item.type === 'TICKET_ZONE' && item.ticketId) {
        const ticket = tickets.find((t) => t.id === item.ticketId)
        if (ticket && counts[item.ticketId] > 0) {
          return {
            ...item,
            capacity: Math.floor(ticket.quantity_total / counts[item.ticketId]),
            price: ticket.price,
            name: ticket.name,
            color: item.color || '#3b82f6'
          }
        }
      }
      return item
    })
  }

  const visualItems = getVisualItems()

  // --- Handlers: Gestión de Tickets (Crear / Editar / Eliminar) ---

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
        // --- MODO EDICIÓN ---
        const { data, error } = await updateEventTicket(editingId, payload)
        if (error || !data) {
          alert('Error actualizando ticket: ' + error)
          return
        }

        // Actualizar lista de tickets
        setTickets((prev) => prev.map((t) => (t.id === editingId ? data : t)))

        // Actualizar visualmente las zonas en el canvas si cambió el nombre
        setCanvasItems((prev) =>
          prev.map((item) => {
            if (item.ticketId === editingId) {
              return { ...item, name: data.name }
            }
            return item
          })
        )

        cancelEditing()
      } else {
        // --- MODO CREACIÓN ---
        const { data, error } = await createEventTicket(
          payload as EventTicketform
        )
        if (error || !data) {
          alert('Error creando ticket: ' + error)
          return
        }
        setTickets((prev) => [...prev, data])
        setNewTicket({
          name: '',
          price: '',
          totalCapacity: '',
          description: ''
        })
      }
    })
  }

  const startEditing = (ticket: EventTicketform) => {
    setEditingId(ticket.id!)
    setNewTicket({
      name: ticket.name,
      price: ticket.price.toString(),
      totalCapacity: ticket.quantity_total.toString(),
      description: ticket.description || ''
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setNewTicket({ name: '', price: '', totalCapacity: '', description: '' })
  }

  // Confirmación de eliminación (Triggered by Dialog)
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return

    startTransition(async () => {
      const { error } = await deleteEventTicket(ticketToDelete)
      if (error) {
        alert('Error al eliminar: ' + error)
        return
      }
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete))
      setCanvasItems((prev) =>
        prev.filter((item) => item.ticketId !== ticketToDelete)
      )
      setTicketToDelete(null)
    })
  }

  // --- Handlers: Canvas (Drag & Drop) ---

  // Ajuste de tipos para el drag handler
  type SidebarDragType = 'STAGE' | 'TICKET_ZONE'
  type SidebarDragData = { label?: string } | EventTicketform

  const handleDragStartFromSidebar = (
    e: React.DragEvent,
    data: SidebarDragData,
    type: SidebarDragType
  ) => {
    if (!e.dataTransfer) return
    const dragData = { source: 'sidebar', type, data }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return
    const canvasRect = canvasRef.current.getBoundingClientRect()

    const rawX = e.clientX - canvasRect.left
    const rawY = e.clientY - canvasRect.top
    const x = snapToGrid(rawX - 50)
    const y = snapToGrid(rawY - 25)

    try {
      const rawData = e.dataTransfer.getData('application/json')
      if (!rawData) return
      const parsedData = JSON.parse(rawData)

      if (parsedData.source === 'sidebar') {
        if (parsedData.type === 'STAGE') {
          const stageExists = canvasItems.some((i) => i.type === 'STAGE')
          if (stageExists) {
            alert('Solo puede haber un escenario.')
            return
          }
        }

        const color =
          parsedData.type === 'TICKET_ZONE'
            ? PRESET_COLORS[
                tickets.findIndex((t) => t.id === parsedData.data.id) %
                  PRESET_COLORS.length
              ]
            : '#000000'

        const newItem: CanvasItem = {
          id: crypto.randomUUID(),
          type: parsedData.type,
          x,
          y,
          width: parsedData.type === 'STAGE' ? 300 : 200,
          height: parsedData.type === 'STAGE' ? 120 : 100,
          ticketId: parsedData.data?.id,
          name: parsedData.data?.name || parsedData.data?.label,
          color: color,
          isNew: true,
          isDirty: true
        }

        setCanvasItems((prev) => [...prev, newItem])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- Handlers: Manipulación Items ---
  const startMovingItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (resizeItem) return
    const item = canvasItems.find((i) => i.id === id)
    if (!item) return
    setDragItem({
      id,
      startX: e.clientX,
      startY: e.clientY,
      originalX: item.x,
      originalY: item.y
    })
  }

  const startResizingItem = (
    e: React.MouseEvent,
    id: string,
    handleType: string
  ) => {
    e.stopPropagation()
    e.preventDefault()
    const item = canvasItems.find((i) => i.id === id)
    if (!item) return
    setResizeItem({
      id,
      handleType,
      startX: e.clientX,
      startY: e.clientY,
      originalX: item.x,
      originalY: item.y,
      originalWidth: item.width,
      originalHeight: item.height
    })
  }

  const deleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const item = canvasItems.find((i) => i.id === id)
    if (!item) return
    if (item.dbId) setDeletedIds((prev) => [...prev, item.dbId!])
    setCanvasItems((prev) => prev.filter((i) => i.id !== id))
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragItem) {
        const deltaX = e.clientX - dragItem.startX
        const deltaY = e.clientY - dragItem.startY
        setCanvasItems((items) =>
          items.map((item) =>
            item.id === dragItem.id
              ? {
                  ...item,
                  x: snapToGrid(dragItem.originalX + deltaX),
                  y: snapToGrid(dragItem.originalY + deltaY),
                  isDirty: true
                }
              : item
          )
        )
      } else if (resizeItem) {
        const deltaX = e.clientX - resizeItem.startX
        const deltaY = e.clientY - resizeItem.startY
        setCanvasItems((items) =>
          items.map((item) => {
            if (item.id === resizeItem.id) {
              let { width, height } = item
              if (resizeItem.handleType.includes('e'))
                width = Math.max(
                  40,
                  snapToGrid(resizeItem.originalWidth + deltaX)
                )
              if (resizeItem.handleType.includes('s'))
                height = Math.max(
                  40,
                  snapToGrid(resizeItem.originalHeight + deltaY)
                )
              return { ...item, width, height, isDirty: true }
            }
            return item
          })
        )
      }
    }
    const handleMouseUp = () => {
      setDragItem(null)
      setResizeItem(null)
    }
    if (dragItem || resizeItem) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragItem, resizeItem])

  // --- Guardar ---
  const handleSaveMap = async () => {
    startTransition(async () => {
      try {
        // 1. Eliminar
        for (const id of deletedIds) {
          await deleteEventMapZone(id)
        }
        setDeletedIds([])

        // 2. Upsert
        const itemsToSave = canvasItems.filter((i) => i.isNew || i.isDirty)
        for (const item of itemsToSave) {
          const payload = mapCanvasItemToZonePayload(item, mapId)
          const response = await upsertEventMapZone({
            zoneId: item.dbId,
            payload
          })

          if (response.data) {
            setCanvasItems((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? {
                      ...p,
                      dbId: response.data!.id,
                      isNew: false,
                      isDirty: false
                    }
                  : p
              )
            )
          }
        }
        alert('Mapa guardado correctamente')
        setIsDesignerOpen(false) // Cerrar modal al guardar
      } catch (e) {
        console.error(e)
        alert('Error al guardar')
      }
    })
  }

  // ================= RENDERIZADO =================

  return (
    <div className="w-full">
      {/* --- VISTA PRINCIPAL: GESTIÓN DE TICKETS (TABLA) --- */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-xl tracking-tight uppercase font-semibold">
              Gestión de Entradas
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Define los tipos de entrada y luego distribúyelos en el escenario.
            </p>
          </div>
          <Button
            onClick={() => setIsDesignerOpen(true)}
            className="bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Edit3 size={18} />
            DISEÑAR ESCENARIO / MAPA
          </Button>
        </div>

        {/* Formulario Creación / Edición */}
        <div
          className={`p-6 rounded-xl border border-gray-200 transition-colors ${
            editingId
              ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900 dark:border-indigo-700'
              : 'bg-gray-50 dark:bg-gray-800'
          }`}
        >
          <h3
            className={`font-bold text-sm uppercase mb-4 flex items-center gap-2 ${
              editingId
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Ticket size={16} />
            {editingId ? 'Editar Zona / Ticket' : 'Crear Nueva Zona / Ticket'}
          </h3>
          <form
            onSubmit={handleSaveTicketType}
            className="flex gap-4 items-end flex-wrap"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                Nombre Zona
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none font-bold uppercase"
                placeholder="EJ. BOX PRIMER PISO"
                value={newTicket.name}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, name: e.target.value })
                }
              />
            </div>
            <div className="w-full md:w-48">
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                Descripción / Aforo
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                placeholder="Ej. 08 personas..."
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
              />
            </div>
            <div className="w-1/2 md:w-32">
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                Cap. Total
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                placeholder="100"
                value={newTicket.totalCapacity}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, totalCapacity: e.target.value })
                }
              />
            </div>
            <div className="w-1/2 md:w-32">
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                Precio (S/)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none font-bold"
                placeholder="0.00"
                value={newTicket.price}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, price: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              {editingId && (
                <Button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-white border border-gray-300 text-gray-700 p-2.5 rounded hover:bg-gray-100 font-bold text-xs uppercase"
                >
                  Cancelar
                </Button>
              )}
              <Button
                disabled={
                  isPending ||
                  !newTicket.name ||
                  !newTicket.price ||
                  !newTicket.totalCapacity
                }
                size="lg"
                className={`text-white p-2.5 rounded disabled:opacity-50 flex items-center gap-2 font-bold text-xs uppercase px-4 ${
                  editingId
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : editingId ? (
                  'Actualizar'
                ) : (
                  <>
                    <Plus size={20} /> Agregar
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Tabla de Tickets (Estilo Imagen) */}
        <div className="space-y-4">
          {tickets.map((t, idx) => (
            <div
              key={t.id}
              className="flex flex-col md:flex-row border border-black md:h-24 overflow-hidden rounded-lg group transition-all bg-white dark:bg-gray-800"
            >
              {/* Columna Info */}
              <div className="flex-1 p-4 flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
                  }}
                />
                <div className="flex flex-col justify-center">
                  <h3 className="font-black  text-lg uppercase leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">
                    {t.description || `${t.quantity_total} personas`}
                  </p>
                </div>
              </div>

              {/* Columna Precio (Naranja) */}
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

              {/* Columna Opciones (Gris) */}
              <div className="w-full md:w-40 bg-gray-50 flex items-center justify-center text-gray-400 border-l border-gray-200 relative py-2 md:py-0 gap-2 dark:bg-gray-900 dark:border-gray-700">
                {/* Botón Editar */}
                <Button
                  onClick={() => startEditing(t)}
                  size="icon"
                  className="rounded-full"
                  variant="outline"
                  title="Editar Ticket"
                >
                  <Edit size={16} />
                </Button>

                {/* Botón Eliminar */}
                <Button
                  onClick={() => setTicketToDelete(t.id!)}
                  className="rounded-full"
                  title="Eliminar Ticket"
                  size="icon"
                  variant="destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              No hay tickets creados. Agrega uno arriba para comenzar.
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: DISEÑADOR DE ESCENARIO (FULL SCREEN) --- */}
      {isDesignerOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          {/* Header del Modal */}
          <div className="h-16 bg-black text-white flex items-center justify-between px-6 shadow-md z-20">
            <div className="flex items-center gap-4">
              <LayoutGrid className="text-pink-500" />
              <div>
                <h2 className="font-black tracking-wider text-lg leading-none">
                  DISEÑADOR DE ESCENARIO
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Arrastra los tickets creados al lienzo
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDesignerOpen(false)}
                className="px-4 py-2 rounded text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                CANCELAR
              </button>
              <button
                onClick={handleSaveMap}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                GUARDAR MAPA
              </button>
            </div>
          </div>

          {/* Cuerpo del Diseñador (Sidebar + Canvas) */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Draggable (Dentro del Modal) */}
            <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-4 overflow-y-auto">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-4 tracking-widest">
                Elementos Disponibles
              </h3>

              <div
                draggable
                onDragStart={(e) =>
                  handleDragStartFromSidebar(e, { label: 'ESCENARIO' }, 'STAGE')
                }
                className="p-4 bg-gray-900 text-white rounded cursor-grab flex items-center justify-center gap-2 mb-6 hover:scale-105 transition-transform shadow-lg"
              >
                <MonitorPlay size={20} />{' '}
                <span className="font-bold">ESCENARIO</span>
              </div>

              <div className="space-y-3">
                {tickets.map((t, idx) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStartFromSidebar(e, t, 'TICKET_ZONE')
                    }
                    className="p-3 bg-white border-2 border-transparent hover:border-black rounded shadow-sm cursor-grab active:cursor-grabbing group relative select-none"
                    style={{
                      borderLeftColor:
                        PRESET_COLORS[idx % PRESET_COLORS.length],
                      borderLeftWidth: '4px'
                    }}
                  >
                    <div className="font-black text-sm text-gray-800 uppercase mb-1">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>S/ {t.price}</span>
                      <span>Cap: {t.quantity_total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[#e5e5e5] relative overflow-hidden flex flex-col">
              {/* Toolbar Flotante Canvas */}
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-200 pointer-events-none flex items-center gap-2">
                <Move size={14} /> ARRASTRA Y SUELTA PARA DISTRIBUIR
              </div>

              {/* Viewport Scrollable */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-20">
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                  }}
                />

                {/* The Canvas */}
                <div
                  ref={canvasRef}
                  className="relative min-w-[1200px] min-h-[1000px] bg-white shadow-2xl"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {/* Renderizado de Items */}
                  {visualItems.map((item) => {
                    const isVertical = item.height > item.width
                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => startMovingItem(e, item.id)}
                        className={`absolute group hover:z-50 transition-shadow ${
                          dragItem?.id === item.id
                            ? 'cursor-grabbing z-50 ring-4 ring-yellow-400'
                            : 'cursor-grab z-10 hover:ring-2 hover:ring-black/20'
                        }`}
                        style={{
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          height: item.height,
                          backgroundColor:
                            item.type === 'STAGE' ? '#000000' : item.color,
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
                          {item.type === 'STAGE' ? (
                            <>
                              <div className="absolute top-0 w-1/3 h-2 bg-gray-800"></div>
                              <h3 className="text-white font-black text-2xl tracking-[0.2em] z-10 text-center leading-none">
                                ESCENARIO
                              </h3>
                              <div className="w-full h-1 bg-gray-800 mt-2"></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="flex flex-col items-center justify-center"
                                style={{
                                  transform: isVertical
                                    ? 'rotate(-90deg)'
                                    : 'none',
                                  width: isVertical ? item.height - 10 : '100%',
                                  maxWidth: isVertical
                                    ? item.height
                                    : item.width
                                }}
                              >
                                <h3
                                  className={`text-white font-black tracking-wide text-center uppercase drop-shadow-md leading-none select-none wrap-break-words ${
                                    isVertical
                                      ? 'text-lg'
                                      : 'text-2xl md:text-3xl'
                                  }`}
                                >
                                  {item.name}
                                </h3>
                              </div>
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                                <div className="bg-black/20 px-2 py-0.5 rounded text-white text-[10px] font-mono font-bold tracking-widest backdrop-blur-sm">
                                  CAP: {item.capacity}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Botón Borrar */}
                          <button
                            onClick={(e) => deleteItem(e, item.id)}
                            className="absolute top-1 right-1 bg-black text-white hover:bg-red-600 rounded p-1 opacity-0 group-hover:opacity-100 transition-all z-30"
                          >
                            <X size={12} />
                          </button>

                          {/* Manija de Resize */}
                          <div
                            onMouseDown={(e) =>
                              startResizingItem(e, item.id, 'se')
                            }
                            className="absolute w-4 h-4 bg-white border-2 border-black rounded-full z-20 hover:scale-125 cursor-se-resize shadow-md"
                            style={{ bottom: -6, right: -6 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmAlertDialog
        open={!!ticketToDelete}
        onOpenChange={(open) => !open && setTicketToDelete(null)}
        title="¿Estás completamente seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el ticket y todas las zonas del mapa que estén asociadas a este tipo de entrada."
        confirmText="Sí, eliminar"
        confirmVariant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
