'use client'

import { useRef, useState, useEffect, useTransition } from 'react'
import { X, Save, MonitorPlay, Move, Loader2 } from 'lucide-react'
import {
  EventMapZone,
  EventTicketform,
  EventMap
} from '@/modules/events/schemas'
import {
  upsertEventMapZone,
  deleteEventMapZone
} from '@/services/event.map.zones.service'
import {
  CanvasItem,
  mapZoneToCanvasItem,
  mapCanvasItemToZonePayload,
  snapToGrid,
  PRESET_COLORS,
  GRID_SIZE
} from '../../data/types'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { Button } from '@/components/ui/button'

interface DesingnerFormProps {
  mapData: EventMap // El mapa seleccionado actualmente
  ticketsData: EventTicketform[] // Los tickets disponibles
  initialMapZones: EventMapZone[] // Las zonas YA filtradas para este mapa
  onClose: () => void
}

export const DesingnerForm: React.FC<DesingnerFormProps> = ({
  mapData,
  ticketsData,
  initialMapZones,
  onClose
}) => {
  const [isPending, startTransition] = useTransition()

  // Inicializamos el canvas SOLO con las zonas de este mapa
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(() =>
    initialMapZones.map((z) => mapZoneToCanvasItem(z, ticketsData))
  )

  const [deletedIds, setDeletedIds] = useState<string[]>([])

  // Estados del Drag & Drop / Resize
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

  const canvasRef = useRef<HTMLDivElement>(null)

  // --- Helpers Visuales (Conteo de capacidad) ---
  const visualItems = canvasItems.map((item) => {
    // Lógica de cálculo de capacidad visual basada en tickets totales / zonas
    // Simplificada para este ejemplo:
    if (item.type === 'TICKET_ZONE' && item.ticketId) {
      const ticket = ticketsData.find((t) => t.id === item.ticketId)
      // Contamos cuántas zonas hay de este mismo ticket en el canvas actual
      const count = canvasItems.filter(
        (i) => i.ticketId === item.ticketId
      ).length
      if (ticket && count > 0) {
        return {
          ...item,
          capacity: Math.floor(ticket.quantity_total / count),
          price: ticket.price,
          name: ticket.name,
          color: item.color || '#3b82f6'
        }
      }
    }
    return item
  })

  // --- Handlers Drag From Sidebar ---
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
        // Validación Escenario único
        if (parsedData.type === 'STAGE') {
          const stageExists = canvasItems.some((i) => i.type === 'STAGE')
          if (stageExists) {
            alert('Solo puede haber un escenario por mapa.')
            return
          }
        }

        const color =
          parsedData.type === 'TICKET_ZONE'
            ? PRESET_COLORS[
                ticketsData.findIndex((t) => t.id === parsedData.data.id) %
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
          ticketId: parsedData.data?.id, // ID del ticket si aplica
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

  // --- Manejo del movimiento y resize dentro del canvas ---
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

  // Effect para Drag & Resize Global
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

  // --- Guardado ---
  const handleSaveMap = async () => {
    if (!mapData.id) return

    startTransition(async () => {
      try {
        // 1. Eliminar
        for (const id of deletedIds) {
          await deleteEventMapZone(id)
        }
        setDeletedIds([])

        // 2. Upsert (Crear o Actualizar)
        const itemsToSave = canvasItems.filter((i) => i.isNew || i.isDirty)

        for (const item of itemsToSave) {
          // IMPORTANTE: Pasamos mapData.id para asociar la zona al mapa actual
          const payload = mapCanvasItemToZonePayload(item, mapData.id!)

          const response = await upsertEventMapZone({
            zoneId: item.dbId,
            payload
          })

          if (response.data) {
            // Actualizamos estado local para que ya no sean "nuevos" ni "sucios"
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
            toast.success(
              <ToastCustom
                title="Guardado"
                description={`Zona "${item.name}" guardada correctamente.`}
              />
            )
          }
        }

        onClose() // Cerramos el diseñador al guardar
      } catch (e) {
        console.error(e)
        alert('Error al guardar')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="h-16 bg-black text-white flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-semibold tracking-wider text-lg leading-none">
              DISEÑADOR DE ESCENARIO
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Editando Mapa ID: {mapData.id?.slice(0, 8)}...
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={onClose} variant="ghost">
            CERRAR
          </Button>
          <Button
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
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-4 overflow-y-auto">
          <h3 className="font-bold text-xs text-gray-400 uppercase mb-4 tracking-widest">
            Elementos Disponibles
          </h3>
          {/* Draggable Stage */}
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
          {/* Draggable Tickets */}
          <div className="space-y-3">
            {ticketsData.map((t, idx) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) =>
                  handleDragStartFromSidebar(e, t, 'TICKET_ZONE')
                }
                className="p-3 bg-white border-2 border-transparent hover:border-black rounded shadow-sm cursor-grab active:cursor-grabbing group relative select-none"
                style={{
                  borderLeftColor: PRESET_COLORS[idx % PRESET_COLORS.length],
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

        {/* Canvas */}
        <div className="flex-1 bg-[#e5e5e5] relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-200 pointer-events-none flex items-center gap-2">
            <Move size={14} /> ARRASTRA Y SUELTA
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-20">
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
              className="relative bg-white shadow-2xl transition-all"
              style={{
                minWidth: mapData.width || 520,
                minHeight: mapData.height || 1000
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
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
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Contenido Visual del Item (Texto, Capacidad, Botón Borrar) */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
                      {item.type === 'STAGE' ? (
                        <h3 className="text-white font-black text-xl tracking-[0.2em] z-10 text-center">
                          ESCENARIO
                        </h3>
                      ) : (
                        <>
                          <div
                            style={{
                              transform: isVertical ? 'rotate(-90deg)' : 'none'
                            }}
                          >
                            <h3 className="text-white font-black uppercase leading-none text-center drop-shadow-md">
                              {item.name}
                            </h3>
                          </div>
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
                            <span className="bg-black/20 text-white text-[9px] font-mono px-1 rounded">
                              CAP: {item.capacity}
                            </span>
                          </div>
                        </>
                      )}
                      <button
                        onClick={(e) => deleteItem(e, item.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all z-30"
                      >
                        <X size={10} />
                      </button>
                      {/* Manija Resize */}
                      <div
                        onMouseDown={(e) => startResizingItem(e, item.id, 'se')}
                        className="absolute w-3 h-3 bg-white border border-black rounded-full z-20 cursor-se-resize shadow-md"
                        style={{ bottom: -4, right: -4 }}
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
  )
}
