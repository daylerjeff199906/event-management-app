'use client'

import React, { useState, useRef, useMemo } from 'react'
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addHours,
  differenceInMinutes,
  setHours,
  setMinutes,
  isToday
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EventActivity } from '@/types' // Tu tipo
import { EventActivityForm } from '@/modules/events/schemas'
import { ActivityForm } from './activity-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'

// --- TIPOS ---
type ViewMode = 'month' | 'week' | 'day'

interface CustomSchedulerProps {
  eventId: string
  activities: EventActivity[] // Lista plana de actividades
  onDateChange?: (date: Date) => void
  onUpdateEvent: (id: string, data: Partial<EventActivityForm>) => Promise<void>
  onCreateEvent: (data: EventActivityForm) => Promise<void>
  onDeleteEvent: (id: string) => Promise<void>
}

// --- CONSTANTES ---
const START_HOUR = 6 // 6 AM
const END_HOUR = 23 // 11 PM
const HOUR_HEIGHT = 64 // Altura en píxeles de cada hora en la vista semanal

export function CustomScheduler({
  eventId,
  activities,
  onUpdateEvent,
  onCreateEvent,
  onDeleteEvent
}: CustomSchedulerProps) {
  // Estado
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<
    Partial<EventActivityForm> | undefined
  >(undefined)
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)

  // Referencias para scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // --- NAVEGACIÓN ---
  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate((d) => addDays(d, -30)) // Aprox
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, -7))
    else setCurrentDate((d) => addDays(d, -1))
  }

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate((d) => addDays(d, 30))
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, 7))
    else setCurrentDate((d) => addDays(d, 1))
  }

  const handleToday = () => setCurrentDate(new Date())

  // --- GESTIÓN DE MODAL ---
  const handleCreateClick = (date: Date) => {
    setSelectedEvent({
      event_id: eventId,
      start_time: date,
      end_time: addHours(date, 1)
    })
    setIsModalOpen(true)
  }

  const handleEventClick = (e: React.MouseEvent, activity: EventActivity) => {
    e.stopPropagation() // Evitar que el click se propague a la celda
    setSelectedEvent({
      ...activity,
      start_time: new Date(activity.start_time),
      end_time: new Date(activity.end_time)
    } as unknown as EventActivityForm)
    setIsModalOpen(true)
  }

  // --- DRAG AND DROP (MOVE) ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedEventId(id)
    e.dataTransfer.effectAllowed = 'move'
    // Hack para ocultar la imagen fantasma por defecto si quisieras personalizarla
    // e.dataTransfer.setDragImage(new Image(), 0, 0)
  }

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    if (!draggedEventId) return

    const activity = activities.find((a) => a.id === draggedEventId)
    if (!activity) return

    // Calcular nueva fecha manteniendo la duración original
    const originalStart = new Date(activity.start_time)
    const originalEnd = new Date(activity.end_time)
    const durationMinutes = differenceInMinutes(originalEnd, originalStart)

    const newStart = targetDate
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60000)

    try {
      await onUpdateEvent(draggedEventId, {
        start_time: newStart,
        end_time: newEnd
      })
      toast.success('Movido correctamente')
    } catch {
      toast.error('Error al mover')
    }
    setDraggedEventId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necesario para permitir drop
    e.dataTransfer.dropEffect = 'move'
  }

  // --- RENDERIZADO DEL HEADER ---
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold capitalize text-gray-800">
          {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM', {
            locale: es
          })}
        </h2>
        <div className="flex items-center border rounded-md bg-white shadow-sm ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="h-8 px-3 font-medium"
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex bg-muted p-1 rounded-lg">
        {(['month', 'week', 'day'] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={cn(
              'px-3 py-1 text-sm rounded-md capitalize transition-all',
              viewMode === m
                ? 'bg-white shadow text-black font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {m === 'month' ? 'Mes' : m === 'week' ? 'Semana' : 'Día'}
          </button>
        ))}
      </div>
    </div>
  )

  // --- HELPERS PARA RENDERIZADO ---

  // Obtiene los días a mostrar
  const daysToShow = useMemo(() => {
    if (viewMode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
      return eachDayOfInterval({ start, end })
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      return eachDayOfInterval({ start, end })
    } else {
      return [currentDate]
    }
  }, [currentDate, viewMode])

  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  )

  // --- COMPONENTE INTERNO: Tarjeta de Evento ---
  const EventCard = ({
    activity,
    style,
    className
  }: {
    activity: EventActivity
    style?: React.CSSProperties
    className?: string
  }) => {
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, activity.id)}
        onClick={(e) => handleEventClick(e, activity)}
        style={style}
        className={cn(
          'absolute inset-x-1 rounded px-2 py-1 text-xs cursor-pointer overflow-hidden transition-all hover:brightness-95 hover:z-20 group border-l-4 shadow-sm',
          // Colores dinámicos según estado (ejemplo)
          activity.status === 'PUBLIC'
            ? 'bg-blue-100 border-blue-500 text-blue-800'
            : activity.status === 'DRAFT'
            ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
            : 'bg-gray-100 border-gray-500 text-gray-800',
          className
        )}
      >
        <div className="font-semibold truncate">{activity.activity_name}</div>
        <div className="text-[10px] opacity-80 truncate flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(activity.start_time), 'HH:mm')} -{' '}
          {format(new Date(activity.end_time), 'HH:mm')}
        </div>

        {/* Handle para resize (Visual por ahora, implementación completa requeriría más lógica de mouse) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-black/10" />
      </div>
    )
  }

  // --- VISTA SEMANAL / DIARIA (TIME GRID) ---
  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-[700px] border rounded-lg bg-white overflow-hidden shadow-sm">
        {/* Header de días */}
        <div className="flex border-b divide-x bg-gray-50">
          <div className="w-16 flex-shrink-0 p-2 text-center text-xs text-muted-foreground font-medium">
            Hora
          </div>
          {daysToShow.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                'flex-1 p-2 text-center',
                isToday(day) && 'bg-blue-50/50'
              )}
            >
              <div
                className={cn(
                  'text-xs font-medium uppercase',
                  isToday(day) ? 'text-blue-600' : 'text-muted-foreground'
                )}
              >
                {format(day, 'EEE', { locale: es })}
              </div>
              <div
                className={cn(
                  'text-xl font-bold w-8 h-8 flex items-center justify-center mx-auto rounded-full mt-1',
                  isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-900'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de Horas (Scrollable) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative custom-scrollbar"
        >
          <div className="flex relative min-h-[1000px]">
            {' '}
            {/* min-h asegura scroll */}
            {/* Columna de Horas (Gutter) */}
            <div className="w-16 flex-shrink-0 border-r bg-gray-50 z-10 sticky left-0">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative border-b border-gray-100"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="absolute -top-3 right-2 text-xs text-muted-foreground">
                    {hour}:00
                  </span>
                </div>
              ))}
            </div>
            {/* Columnas de Días */}
            <div className="flex-1 flex divide-x relative">
              {/* Líneas horizontales de fondo para las horas */}
              <div className="absolute inset-0 flex flex-col pointer-events-none z-0">
                {hours.map((h) => (
                  <div
                    key={`line-${h}`}
                    className="border-b border-gray-100 w-full"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}
              </div>

              {daysToShow.map((day) => {
                // Filtrar eventos de este día
                const dayEvents = activities.filter((a) =>
                  isSameDay(new Date(a.start_time), day)
                )

                return (
                  <div
                    key={day.toISOString()}
                    className="flex-1 relative min-w-[120px] group transition-colors hover:bg-gray-50/30"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      // Calcular hora basada en posición Y
                      const rect = e.currentTarget.getBoundingClientRect()
                    //   const y = e.clientY - rect.top + e.currentTarget.scrollTop // Ajuste scroll si es necesario
                      // Un cálculo aproximado: (Y / AlturaTotal) * HorasTotales
                      // Más preciso: Math.floor(offsetY / HOUR_HEIGHT) + START_HOUR

                      // Nota: e.nativeEvent.offsetY es relativo al target, que puede ser un evento hijo.
                      // Mejor usar el rect del contenedor del día.
                      const relativeY = e.clientY - rect.top
                      const hourIndex = Math.floor(relativeY / HOUR_HEIGHT)
                      const minutesIndex = Math.floor(
                        ((relativeY % HOUR_HEIGHT) / HOUR_HEIGHT) * 60
                      )

                      const targetDate = setMinutes(
                        setHours(day, START_HOUR + hourIndex),
                        minutesIndex
                      )
                      handleDrop(e, targetDate)
                    }}
                    onClick={(e) => {
                      // Crear evento al clickear celda vacía
                      const rect = e.currentTarget.getBoundingClientRect()
                      const relativeY = e.clientY - rect.top
                      const hourIndex = Math.floor(relativeY / HOUR_HEIGHT)
                      const newDate = setHours(day, START_HOUR + hourIndex)
                      handleCreateClick(newDate)
                    }}
                  >
                    {/* Indicador de "Ahora" si es hoy */}
                    {isToday(day) && (
                      <div
                        className="absolute w-full border-t-2 border-red-500 z-10 pointer-events-none"
                        style={{
                          top: `${
                            ((new Date().getHours() - START_HOUR) * 60 +
                              new Date().getMinutes()) *
                            (HOUR_HEIGHT / 60)
                          }px`
                        }}
                      >
                        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
                      </div>
                    )}

                    {/* Renderizar eventos */}
                    {dayEvents.map((event) => {
                      const start = new Date(event.start_time)
                      const end = new Date(event.end_time)
                      const startMinutes =
                        (start.getHours() - START_HOUR) * 60 +
                        start.getMinutes()
                      const durationMinutes = differenceInMinutes(end, start)

                      // Calcular Top y Height
                      const top = startMinutes * (HOUR_HEIGHT / 60)
                      const height = durationMinutes * (HOUR_HEIGHT / 60)

                      return (
                        <EventCard
                          key={event.id}
                          activity={event}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 20)}px` // Mínimo 20px
                          }}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- VISTA MENSUAL ---
  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded-lg overflow-hidden shadow-sm h-[700px]">
        {/* Headers días */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <div
            key={d}
            className="bg-gray-50 p-2 text-center text-xs font-semibold text-muted-foreground uppercase"
          >
            {d}
          </div>
        ))}

        {/* Celdas */}
        {daysToShow.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const dayEvents = activities.filter((a) =>
            isSameDay(new Date(a.start_time), day)
          )

          return (
            <div
              key={idx}
              className={cn(
                'bg-white min-h-[100px] p-1 flex flex-col gap-1 transition-colors hover:bg-blue-50/20',
                !isCurrentMonth && 'bg-gray-50/50 text-gray-400'
              )}
              onClick={() => handleCreateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setHours(day, 9))} // Drop en mes pone hora default 9am
            >
              <div
                className={cn(
                  'text-right text-xs p-1 font-medium',
                  isToday(day) && 'text-blue-600'
                )}
              >
                {format(day, 'd')}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onClick={(e) => handleEventClick(e, event)}
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer shadow-sm hover:opacity-80',
                      event.status === 'PUBLIC'
                        ? 'bg-blue-100 border-blue-200 text-blue-800'
                        : 'bg-gray-100 border-gray-200 text-gray-800'
                    )}
                  >
                    {format(new Date(event.start_time), 'HH:mm')}{' '}
                    {event.activity_name}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col select-none">
      {renderHeader()}

      <div className="flex-1 transition-all duration-300">
        {viewMode === 'month' ? renderMonthView() : renderWeekView()}
      </div>

      {/* Modal integrado */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id ? 'Editar Actividad' : 'Nueva Actividad'}
            </DialogTitle>
          </DialogHeader>
          {isModalOpen && (
            <ActivityForm
              eventId={eventId}
              initialData={selectedEvent}
              onSubmit={async (data) => {
                if (data.id) await onUpdateEvent(data.id, data)
                else await onCreateEvent(data)
                setIsModalOpen(false)
              }}
              onDelete={async (id) => {
                await onDeleteEvent(id)
                setIsModalOpen(false)
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
