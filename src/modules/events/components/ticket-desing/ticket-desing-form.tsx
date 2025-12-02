'use client'

import React, { useState, useRef, useEffect, useTransition } from 'react'
import {
  Plus,
  Trash2,
  Move,
  LayoutGrid,
  Save,
  MonitorPlay,
  MapPin,
  Loader2
} from 'lucide-react'
import { EventTicketform, EventMapZone } from '@/modules/events/schemas' // Ajusta tus imports
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
  deleteEventTicket
} from '@/services/events.ticket.service'

// Importa tus server actions
interface EventMapDesignerProps {
  eventId: string
  mapId: string
  initialTickets: EventTicketform[]
  initialZones: EventMapZone[]
}

export const EventMapDesigner: React.FC<EventMapDesignerProps> = ({
  eventId,
  mapId,
  initialTickets,
  initialZones
}) => {
  // --- Estados ---
  const [tickets, setTickets] = useState<EventTicketform[]>(initialTickets)
  // Inicializar items del canvas mapeando desde la BD
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(() =>
    initialZones.map((z) => mapZoneToCanvasItem(z, initialTickets))
  )

  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    totalCapacity: ''
  })
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

  // --- Lógica de Recalculo de Capacidades Visuales ---
  // Esto es solo visual, divide el aforo total del ticket entre las zonas creadas
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
            color: item.color || '#3b82f6' // Fallback color
          }
        }
      }
      return item
    })
  }

  const visualItems = getVisualItems()

  // --- Handlers: Gestión de Tickets (Server Actions) ---

  const handleCreateTicketType = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.name || !newTicket.price || !newTicket.totalCapacity) return

    startTransition(async () => {
      // 1. Crear el ticket en BD
      const payload: EventTicketform = {
        event_id: eventId,
        name: newTicket.name.toUpperCase(),
        price: parseFloat(newTicket.price),
        quantity_total: parseInt(newTicket.totalCapacity),
        currency: 'PEN', // Ojo: Ajustar según necesidad
        // Campos opcionales por defecto
        description: null,
        is_active: true
      } as EventTicketform

      const { data, error } = await createEventTicket(payload)

      if (error || !data) {
        alert('Error creando ticket: ' + error)
        return
      }

      // 2. Actualizar estado local
      setTickets((prev) => [...prev, data])
      setNewTicket({ name: '', price: '', totalCapacity: '' })
    })
  }

  const handleDeleteTicketType = async (ticketId: string) => {
    if (
      !confirm(
        '¿Estás seguro? Se eliminarán todas las zonas asociadas en el mapa.'
      )
    )
      return

    startTransition(async () => {
      const { error } = await deleteEventTicket(ticketId)
      if (error) {
        alert('Error al eliminar: ' + error)
        return
      }
      setTickets((prev) => prev.filter((t) => t.id !== ticketId))
      // Eliminar visualmente las zonas asociadas
      setCanvasItems((prev) =>
        prev.filter((item) => item.ticketId !== ticketId)
      )
      // NOTA: Las zonas en BD también deberían borrarse.
      // Idealmente tu backend tiene "Cascade Delete". Si no, deberías borrar las zonas aquí también.
    })
  }

  // --- Handlers: Drag & Drop (Creación) ---

  type SidebarDraggablePayload = EventTicketform | { label: string }
  type SidebarDragType = 'STAGE' | 'TICKET_ZONE'
  type SidebarDragData = {
    source: 'sidebar'
    type: SidebarDragType
    data: SidebarDraggablePayload
  }

  const handleDragStartFromSidebar = (
    e: React.DragEvent,
    data: SidebarDraggablePayload,
    type: SidebarDragType
  ): void => {
    if (!e.dataTransfer) return
    const dragData: SidebarDragData = { source: 'sidebar', type, data }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'copyMove'
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
        // Validación Escenario Único
        if (parsedData.type === 'STAGE') {
          const stageExists = canvasItems.some((i) => i.type === 'STAGE')
          if (stageExists) {
            alert('Solo puede haber un escenario.')
            return
          }
        }

        const color =
          parsedData.type === 'TICKET_ZONE'
            ? PRESET_COLORS[tickets.length % PRESET_COLORS.length] // O un color aleatorio
            : '#000000'

        const newItem: CanvasItem = {
          id: crypto.randomUUID(), // ID temporal para React
          type: parsedData.type,
          x,
          y,
          width: parsedData.type === 'STAGE' ? 300 : 200,
          height: parsedData.type === 'STAGE' ? 120 : 100,
          ticketId: parsedData.data?.id, // ID real del ticket
          name: parsedData.data?.name || parsedData.data?.label,
          color: color,
          isNew: true, // Marcado para guardar
          isDirty: true
        }

        setCanvasItems((prev) => [...prev, newItem])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- Handlers: Manipulación Canvas ---

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
    // Marcar como eliminado para procesar en Save, o eliminar directamente si es nuevo
    const item = canvasItems.find((i) => i.id === id)
    if (!item) return

    if (item.dbId) {
      // Si ya existía en BD, lo marcamos como deleted (podríamos usar un estado separado o filtrar)
      // Para simplificar este ejemplo, llamaremos a delete server action directamente para items existentes
      // O lo sacamos del array y en "Save" calculamos el diff.
      // Estrategia: Sacar del array 'canvasItems'. Guardar en un ref 'deletedIds'.
      setDeletedIds((prev) => [...prev, item.dbId!])
    }
    setCanvasItems((prev) => prev.filter((i) => i.id !== id))
  }

  // Estado para trackear eliminaciones
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragItem) {
        const deltaX = e.clientX - dragItem.startX
        const deltaY = e.clientY - dragItem.startY
        const newX = snapToGrid(dragItem.originalX + deltaX)
        const newY = snapToGrid(dragItem.originalY + deltaY)

        setCanvasItems((items) =>
          items.map((item) =>
            item.id === dragItem.id
              ? { ...item, x: newX, y: newY, isDirty: true }
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

  // --- GUARDADO FINAL ---
  const handleSaveMap = async () => {
    startTransition(async () => {
      try {
        // 1. Eliminar
        for (const id of deletedIds) {
          await deleteEventMapZone(id)
        }
        setDeletedIds([]) // Reset

        // 2. Upsert (Crear o Actualizar)
        // Filtramos solo los que han cambiado o son nuevos
        const itemsToSave = canvasItems.filter((i) => i.isNew || i.isDirty)

        for (const item of itemsToSave) {
          const payload = mapCanvasItemToZonePayload(item, mapId)
          // Ojo: upsertEventMapZone espera { zoneId?, payload }
          // Si item.dbId existe, lo pasamos como zoneId
          const response = await upsertEventMapZone({
            zoneId: item.dbId,
            payload: payload
          })

          if (response.error) {
            console.error('Error guardando item', item, response.error)
          } else if (response.data) {
            // Actualizar el item local con el ID real y limpiar flags
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
      } catch (e) {
        console.error(e)
        alert('Hubo un error al guardar')
      }
    })
  }

  const totalRevenue = canvasItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.capacity || 0),
    0
  )

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100 font-sans text-gray-800 overflow-hidden select-none border rounded-xl">
      {/* Sidebar de Controles */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col shadow-xl z-20">
        <div className="p-5 bg-black text-white shadow-md">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-wider">
            <LayoutGrid className="text-pink-500" /> EVENT MAP
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-mono">
            Diseñador de Planos
          </p>
        </div>

        {/* Formulario Nueva Zona */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xs font-bold text-gray-900 uppercase mb-3 tracking-widest">
            Nueva Zona
          </h2>
          <form onSubmit={handleCreateTicketType} className="space-y-2">
            <input
              className="w-full p-2 text-sm border-2 border-gray-200 focus:border-black transition-colors uppercase font-bold outline-none"
              placeholder="NOMBRE (EJ. VIP)"
              value={newTicket.name}
              onChange={(e) =>
                setNewTicket({ ...newTicket, name: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                className="w-1/2 p-2 text-sm border-2 border-gray-200 focus:border-black outline-none"
                type="number"
                placeholder="S/ Precio"
                value={newTicket.price}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, price: e.target.value })
                }
              />
              <input
                className="w-1/2 p-2 text-sm border-2 border-gray-200 focus:border-black outline-none"
                type="number"
                placeholder="Cap. Total"
                value={newTicket.totalCapacity}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, totalCapacity: e.target.value })
                }
              />
            </div>
            <button
              disabled={isPending}
              className="w-full bg-black text-white py-2 text-sm hover:bg-gray-800 font-bold tracking-widest flex justify-center gap-2 items-center disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Plus size={16} /> AGREGAR
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de Elementos Draggable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div
            draggable
            onDragStart={(e) =>
              handleDragStartFromSidebar(e, { label: 'ESCENARIO' }, 'STAGE')
            }
            className="p-4 bg-black text-white cursor-grab flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg border-b-4 border-gray-800"
          >
            <MonitorPlay size={20} />{' '}
            <span className="font-black tracking-widest">ESCENARIO</span>
          </div>

          <div className="h-px bg-gray-300 my-4"></div>

          {tickets.map((t, idx) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) =>
                handleDragStartFromSidebar(e, t, 'TICKET_ZONE')
              }
              className="p-3 bg-white border-2 border-transparent hover:border-black shadow-sm cursor-grab active:cursor-grabbing relative group transition-all"
              style={{
                borderLeft: `4px solid ${
                  PRESET_COLORS[idx % PRESET_COLORS.length]
                }`
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-sm tracking-wide uppercase">
                  {t.name}
                </span>
                <button
                  onClick={() => handleDeleteTicketType(t.id!)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs text-gray-500 font-bold flex justify-between items-center">
                <span>CAP: {t.quantity_total}</span>
                <span>S/ {t.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Total */}
        <div className="p-4 bg-white text-sm border-t-2 border-gray-200">
          <div className="flex justify-between font-black text-lg text-gray-900">
            <span>TOTAL:</span>
            <span>S/ {totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-12 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase">
            <Move size={14} /> Arrastra bloques al lienzo
          </div>
          <button
            onClick={handleSaveMap}
            disabled={
              isPending ||
              (!deletedIds.length &&
                !canvasItems.some((i) => i.isDirty || i.isNew))
            }
            className="bg-green-600 text-white text-xs font-bold hover:bg-green-700 px-4 py-2 rounded uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            Guardar Cambios
          </button>
        </div>

        <div className="flex-1 bg-[#e5e5e5] overflow-auto flex items-center justify-center p-10 relative">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
            }}
          />

          <div
            ref={canvasRef}
            className="relative w-full h-full min-h-[800px] min-w-[800px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {visualItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <MapPin size={64} className="mb-4 opacity-20" />
                <span className="text-3xl font-black uppercase tracking-widest opacity-20">
                  Lienzo Vacío
                </span>
              </div>
            )}

            {visualItems.map((item) => {
              const isVertical = item.height > item.width
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => startMovingItem(e, item.id)}
                  className={`absolute group hover:z-50 transition-shadow ${
                    dragItem?.id === item.id
                      ? 'cursor-grabbing z-50 ring-4 ring-yellow-400'
                      : 'cursor-grab z-10 hover:ring-2 hover:ring-white/50'
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
                            transform: isVertical ? 'rotate(-90deg)' : 'none',
                            width: isVertical ? item.height - 10 : '100%',
                            maxWidth: isVertical ? item.height : item.width
                          }}
                        >
                          <h3
                            className={`text-white font-black tracking-wide text-center uppercase drop-shadow-md leading-none select-none wrap-break-words ${
                              isVertical ? 'text-lg' : 'text-2xl md:text-3xl'
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
                    <button
                      onClick={(e) => deleteItem(e, item.id)}
                      className="absolute top-1 right-1 bg-black text-white hover:bg-red-600 rounded p-1 opacity-0 group-hover:opacity-100 transition-all z-30"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div
                      onMouseDown={(e) => startResizingItem(e, item.id, 'se')}
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
  )
}
