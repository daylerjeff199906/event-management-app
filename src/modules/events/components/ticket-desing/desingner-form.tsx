/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useRef, useState, useEffect, useTransition, useCallback } from 'react'
import {
  X,
  Save,
  MonitorPlay,
  Move,
  Loader2,
  ZoomIn,
  ZoomOut,
  Undo,
  MousePointer2
} from 'lucide-react'
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
  PRESET_COLORS
} from '../../data/types'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesingnerFormProps {
  mapData: EventMap
  ticketsData: EventTicketform[]
  initialMapZones: EventMapZone[]
  onClose: () => void
}

export const DesingnerForm: React.FC<DesingnerFormProps> = ({
  mapData,
  ticketsData,
  initialMapZones,
  onClose
}) => {
  const [isPending, startTransition] = useTransition()

  // --- Configuración Visual desde el Mapa ---
  const { shape, borderRadius } = mapData.config || {
    shape: 'rectangle',
    borderRadius: '0px'
  }
  const mapWidth = mapData.width || 800
  const mapHeight = mapData.height || 600

  // --- Estado del Canvas ---
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(() =>
    initialMapZones.map((z) => mapZoneToCanvasItem(z, ticketsData))
  )

  const [deletedIds, setDeletedIds] = useState<string[]>([])

  // --- Estado para Historial (Ctrl + Z) ---
  const [history, setHistory] = useState<CanvasItem[][]>([
    initialMapZones.map((z) => mapZoneToCanvasItem(z, ticketsData))
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  // --- Estado del Zoom ---
  const [zoom, setZoom] = useState(1)

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

  // --- Lógica de Historial ---
  const addToHistory = (newItems: CanvasItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newItems)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      setHistoryIndex(prevIndex)
      setCanvasItems(history[prevIndex])
    }
  }, [history, historyIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo])

  // --- Helpers Visuales ---
  const visualItems = canvasItems.map((item) => {
    if (item.type === 'TICKET_ZONE' && item.ticketId) {
      const ticket = ticketsData.find((t) => t.id === item.ticketId)
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

    const rawX = (e.clientX - canvasRect.left) / zoom
    const rawY = (e.clientY - canvasRect.top) / zoom

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
          width: parsedData.type === 'STAGE' ? 250 : 150,
          height: parsedData.type === 'STAGE' ? 60 : 70,
          ticketId: parsedData.data?.id,
          name: parsedData.data?.name || parsedData.data?.label,
          color: color,
          isNew: true,
          isDirty: true
        }

        const nextItems = [...canvasItems, newItem]
        setCanvasItems(nextItems)
        addToHistory(nextItems)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- Canvas Interaction Handlers ---
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

    const nextItems = canvasItems.filter((i) => i.id !== id)
    setCanvasItems(nextItems)
    addToHistory(nextItems)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragItem) {
        const deltaX = (e.clientX - dragItem.startX) / zoom
        const deltaY = (e.clientY - dragItem.startY) / zoom
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
        const deltaX = (e.clientX - resizeItem.startX) / zoom
        const deltaY = (e.clientY - resizeItem.startY) / zoom
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
      if (dragItem || resizeItem) {
        addToHistory(canvasItems)
      }
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
  }, [dragItem, resizeItem, canvasItems, zoom])

  // --- Guardado ---
  const handleSaveMap = async () => {
    if (!mapData.id) return

    startTransition(async () => {
      try {
        for (const id of deletedIds) {
          await deleteEventMapZone(id)
        }
        setDeletedIds([])

        const itemsToSave = canvasItems.filter((i) => i.isNew || i.isDirty)

        for (const item of itemsToSave) {
          const payload = mapCanvasItemToZonePayload(item, mapData.id!)
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
        toast.success(
          <ToastCustom
            title="Guardado Exitoso"
            description="El diseño del mapa se ha actualizado."
          />
        )
        onClose()
      } catch (e) {
        console.error(e)
        alert('Error al guardar')
      }
    })
  }

  // --- ESTILOS DINÁMICOS DEL PLANO ---
  // Estilo principal del "papel" o "terreno"
  const canvasStyle: React.CSSProperties = {
    width: mapWidth,
    height: mapHeight,
    borderRadius: borderRadius, // APLICA EL REDONDEADO CONFIGURADO
    transform: `scale(${zoom})`,
    transformOrigin: 'center top'
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      {/* --- HEADER --- */}
      <div className="h-16 bg-black text-white flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-semibold tracking-wider text-lg leading-none">
              DISEÑADOR DE ESCENARIO
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
              <span>ID: {mapData.id?.slice(0, 8)}...</span>
              <span className="text-gray-600">|</span>
              <span className="uppercase text-yellow-500 font-bold">
                {shape}
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">
                {mapWidth}x{mapHeight}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleUndo}
            variant="outline"
            size="sm"
            disabled={historyIndex <= 0}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 h-9"
          >
            <Undo size={14} className="mr-2" /> Deshacer
          </Button>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
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

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR DE HERRAMIENTAS */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-4 overflow-y-auto z-10 shadow-lg select-none">
          <h3 className="font-bold text-xs text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
            <MousePointer2 size={12} /> Elementos Disponibles
          </h3>

          <div className="text-xs text-gray-400 mb-2 italic">
            Arrastra elementos al plano
          </div>

          <div
            draggable
            onDragStart={(e) =>
              handleDragStartFromSidebar(e, { label: 'ESCENARIO' }, 'STAGE')
            }
            className="p-4 bg-gray-900 text-white rounded cursor-grab flex items-center justify-center gap-2 mb-6 hover:scale-[1.02] transition-transform shadow-lg border border-black active:cursor-grabbing"
          >
            <MonitorPlay size={20} />{' '}
            <span className="font-bold">ESCENARIO</span>
          </div>

          <div className="space-y-3">
            {ticketsData.map((t, idx) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) =>
                  handleDragStartFromSidebar(e, t, 'TICKET_ZONE')
                }
                className="p-3 bg-white border border-gray-200 hover:border-black rounded shadow-sm cursor-grab active:cursor-grabbing group relative transition-all hover:shadow-md"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                  style={{
                    backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
                  }}
                />
                <div className="pl-3">
                  <div className="font-black text-sm text-gray-800 uppercase mb-1 truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between font-mono">
                    <span>S/ {t.price}</span>
                    <span>Total: {t.quantity_total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ÁREA DE TRABAJO (WRAPPER DEL CANVAS) --- */}
        <div className="flex-1 bg-[#f0f2f5] relative overflow-hidden flex flex-col">
          {/* Indicador Flotante */}
          <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-200 pointer-events-none flex items-center gap-2 select-none dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-600">
            <Move size={14} /> MODO EDICIÓN
          </div>

          <div className="flex-1 overflow-auto flex items-start justify-center p-20 relative">
            {/* FONDO DE CUADRÍCULA TÉCNICA (Estilo Blueprint) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage:
                  'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`
              }}
            />

            {/* --- EL PLANO / MAPA REAL --- */}
            <div
              ref={canvasRef}
              className={cn(
                'relative bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all ease-out',
                // Borde suave para definir el límite del mapa
                'border border-gray-300'
              )}
              style={canvasStyle}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {/* --- COTAS / DIMENSIONES EXTERNAS (Estilo Técnico) --- */}
              {/* Cota Superior (Ancho) */}
              <div className="absolute -top-8 w-full flex justify-center text-xs font-bold text-gray-400 font-mono select-none">
                <div className="flex items-center gap-2">
                  <div className="h-px w-4 bg-gray-300"></div>
                  <span className="bg-gray-100 px-2 rounded border border-gray-200">
                    {mapWidth} px
                  </span>
                  <div className="h-px w-4 bg-gray-300"></div>
                </div>
              </div>

              {/* Cota Izquierda (Alto) */}
              <div className="absolute -left-10 h-full flex items-center text-xs font-bold text-gray-400 font-mono select-none">
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-gray-100 px-2 rounded border border-gray-200 -rotate-90 whitespace-nowrap">
                    {mapHeight} px
                  </span>
                </div>
              </div>

              {/* TEXTURA INTERNA DEL PLANO */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"
                style={{ borderRadius: borderRadius }}
              />

              {/* Decoración específica para Estadio (Césped sutil) */}
              {shape === 'stadium' && (
                <div className="absolute inset-4 border-2 border-dashed border-green-900/10 rounded-[inherit] pointer-events-none" />
              )}

              {/* --- ELEMENTOS RENDERIZADOS (Zonas y Escenario) --- */}
              {visualItems.map((item) => {
                const isVertical = item.height > item.width
                return (
                  <div
                    key={item.id}
                    onMouseDown={(e) => startMovingItem(e, item.id)}
                    className={cn(
                      'absolute group transition-shadow',
                      dragItem?.id === item.id
                        ? 'cursor-grabbing z-50 ring-2 ring-black shadow-xl'
                        : 'cursor-grab z-10 hover:ring-1 hover:ring-black/30 hover:shadow-lg hover:z-40'
                    )}
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      height: item.height,
                      backgroundColor:
                        item.type === 'STAGE' ? '#1a1a1a' : item.color,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden select-none">
                      {/* Contenido Visual */}
                      {item.type === 'STAGE' ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 w-full h-full p-2">
                          <MonitorPlay
                            className="text-gray-500 mb-1"
                            size={24}
                          />
                          <h3 className="text-white font-black text-lg tracking-[0.2em] z-10 text-center opacity-90">
                            ESCENARIO
                          </h3>
                        </div>
                      ) : (
                        <>
                          {/* Patrón sutil sobre la zona */}
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] pointer-events-none" />

                          <div
                            style={{
                              transform: isVertical ? 'rotate(-90deg)' : 'none'
                            }}
                          >
                            <h3 className="text-white font-bold uppercase leading-none text-center drop-shadow-md text-sm">
                              {item.name}
                            </h3>
                          </div>
                        </>
                      )}

                      {/* Botón Eliminar (Hover) */}
                      <button
                        onClick={(e) => deleteItem(e, item.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-30 shadow-sm hover:scale-110 hover:bg-red-600 dark:hover:bg-red-400"
                        title="Eliminar zona"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>

                      {/* Manija Resize */}
                      <div
                        onMouseDown={(e) => startResizingItem(e, item.id, 'se')}
                        className="absolute w-3 h-3 bg-white border border-gray-400 z-20 cursor-se-resize hover:bg-black transition-colors shadow-sm bottom-0 right-0 rounded-tl-sm"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* --- CONTROLES DE ZOOM (Bottom Right) --- */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-white p-2 rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-bottom-5 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
            >
              <ZoomOut size={16} className="text-gray-600 dark:text-gray-300" />
            </Button>

            <div className="w-24 px-2">
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:bg-gray-700 dark:accent-white dark:hover:accent-gray-300"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100"
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            >
              <ZoomIn size={16} className="text-gray-600 dark:text-gray-300" />
            </Button>
            <span className="text-xs font-mono w-10 text-center font-bold text-gray-500 dark:text-gray-300">
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
