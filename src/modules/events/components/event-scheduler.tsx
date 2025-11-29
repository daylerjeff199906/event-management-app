'use client'

import { useState, useCallback, useEffect, useMemo } from 'react' // Agregado useMemo
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar' // Agregado Components type
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify'
import {
  Maximize2,
  Minimize2,
  Clock,
  AlignLeft,
  CalendarDays
} from 'lucide-react' // Iconos agregados para el popover

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
// Importamos HoverCard para el efecto solicitado
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ActivityForm } from './activity-form'

import {
  createEventActivity,
  updateEventActivity,
  deleteEventActivity,
  fetchAllEventActivities
} from '@/services/events.activities.service'
import { EventActivity } from '@/types'
import { EventActivityForm } from '@/modules/events/schemas'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator' // Opcional, para estética del popover

// 1. Configuración del Localizer
const locales = {
  es: es
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

// 2. Definición de Tipos
interface EventSchedulerProps {
  eventId: string
  defaultDate?: Date
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: EventActivity
  allDay?: boolean
}

// 3. Componente DnD Tipado
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

// --- UTILS PARA COLORES ---
const pastelColors = [
  '#BFDBFE', // Blue 200
  '#BBF7D0', // Green 200
  '#FECACA', // Red 200
  '#DDD6FE', // Violet 200
  '#FED7AA', // Orange 200
  '#E9D5FF', // Purple 200
  '#FBCFE8', // Pink 200
  '#BAE6FD', // Sky 200
  '#A7F3D0', // Emerald 200
  '#FDE68A' // Amber 200
]

const getEventColor = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash % pastelColors.length)
  return pastelColors[index]
}

export function EventScheduler({
  eventId,
  defaultDate = new Date()
}: EventSchedulerProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(defaultDate)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<
    Partial<EventActivityForm> | undefined
  >(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado del modal de confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const loadActivities = useCallback(async () => {
    const { data, error } = await fetchAllEventActivities({ event_id: eventId })
    if (error) {
      toast.error('Error al cargar actividades')
      return
    }
    if (data) {
      const formattedEvents: CalendarEvent[] = data.map((activity) => ({
        id: activity.id,
        title: activity.activity_name,
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        resource: activity,
        allDay: false
      }))
      setEvents(formattedEvents)
    }
  }, [eventId])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedActivity({
        event_id: eventId,
        start_time: start,
        end_time: end
      })
      setIsModalOpen(true)
    },
    [eventId]
  )

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const activity = event.resource
    setSelectedActivity({
      ...activity,
      start_time: new Date(activity.start_time),
      end_time: new Date(activity.end_time)
    } as unknown as EventActivityForm)
    setIsModalOpen(true)
  }, [])

  interface DragDropArgs {
    event: CalendarEvent
    start: string | Date
    end: string | Date
    isAllDay?: boolean
  }

  const handleEventUpdate = useCallback(
    async ({ event, start, end }: DragDropArgs) => {
      const startDate = new Date(start)
      const endDate = new Date(end)

      const oldEvents = [...events]
      const updatedEvents = events.map((e) =>
        e.id === event.id ? { ...e, start: startDate, end: endDate } : e
      )
      setEvents(updatedEvents)

      try {
        const { error } = await updateEventActivity(event.id, {
          start_time: startDate,
          end_time: endDate
        } as Partial<EventActivityForm>)

        if (error) throw error
        toast.success('Horario actualizado')
      } catch {
        setEvents(oldEvents)
        toast.error('No se pudo mover el evento')
      }
    },
    [events]
  )

  const onEventResize = useCallback(
    (args: DragDropArgs) => handleEventUpdate(args),
    [handleEventUpdate]
  )

  const onEventDrop = useCallback(
    (args: DragDropArgs) => handleEventUpdate(args),
    [handleEventUpdate]
  )

  const onFormSubmit = async (data: EventActivityForm) => {
    setIsSubmitting(true)
    try {
      if (data.id) {
        const { error } = await updateEventActivity(data.id, data)
        if (error) throw error
        toast.success('Actividad actualizada')
      } else {
        const { error } = await createEventActivity(data)
        if (error) throw error
        toast.success('Actividad creada')
      }

      await loadActivities()
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Ocurrió un error al guardar')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeleteRequest = async () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedActivity?.id) return

    setIsSubmitting(true)
    try {
      const { error } = await deleteEventActivity(selectedActivity.id)
      if (error) throw error

      toast.success('Actividad eliminada')
      await loadActivities()
      setIsModalOpen(false)
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setIsSubmitting(false)
      setIsConfirmOpen(false)
    }
  }

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const backgroundColor = getEventColor(event.id)
    return {
      style: {
        backgroundColor,
        color: '#1e293b',
        borderLeft: '4px solid rgba(0,0,0,0.1)',
        fontSize: '0.75rem',
        fontWeight: 600
      }
    }
  }, [])

  // --- NUEVA LÓGICA: Componente personalizado para el Evento con HoverCard ---
  const { components } = useMemo(
    () => ({
      components: {
        event: ({
          event,
          title
        }: {
          event: CalendarEvent
          title: React.ReactNode
        }) => {
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                {/* Contenedor invisible que ocupa todo el espacio del evento para detectar el hover */}
                <div className="w-full h-full cursor-pointer truncate">
                  {title}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 z-50 p-4 shadow-lg border-zinc-200 dark:border-zinc-800">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none">
                      {event.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Detalles de la actividad
                    </p>
                  </div>
                  <Separator />
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {format(event.start, 'HH:mm a', { locale: es })} -{' '}
                        {format(event.end, 'HH:mm a', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {format(event.start, "EEEE, d 'de' MMMM", {
                          locale: es
                        })}
                      </span>
                    </div>
                    {event.resource?.description && (
                      <div className="flex items-start gap-2 text-muted-foreground mt-1">
                        <AlignLeft className="h-3.5 w-3.5 mt-0.5" />
                        <p className="text-xs leading-relaxed max-h-[100px] overflow-y-auto">
                          {event.resource.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        }
      }
    }),
    []
  )

  const customStyles = `
    /* Variables Base (Light) */
    :root {
      --rbc-bg: #ffffff;
      --rbc-text: #334155;
      --rbc-border: #e2e8f0;
      --rbc-header-bg: #f8fafc;
      --rbc-today-bg: #f1f5f9;
      --rbc-off-range-bg: #fcfcfc;
    }

    /* Dark Mode variables */
    .dark {
      --rbc-bg: #09090b;
      --rbc-text: #e2e8f0;
      --rbc-border: #27272a;
      --rbc-header-bg: #18181b;
      --rbc-today-bg: #27272a;
      --rbc-off-range-bg: #000000;
    }

    .rbc-calendar {
      background-color: var(--rbc-bg);
      color: var(--rbc-text);
      font-family: inherit;
      border-radius: 0.5rem;
    }

    .rbc-month-view, .rbc-time-view, .rbc-header, .rbc-month-row, .rbc-day-bg {
      border-color: var(--rbc-border) !important;
    }

    .rbc-header {
      padding: 8px 0;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background-color: var(--rbc-header-bg);
      border-bottom: 1px solid var(--rbc-border);
      color: var(--rbc-text);
    }

    .rbc-today {
      background-color: var(--rbc-today-bg) !important;
    }

    .rbc-off-range-bg {
      background-color: var(--rbc-off-range-bg) !important;
    }

    /* ESTILOS DE HOVER Y CURSOR */
    .rbc-day-bg {
      cursor: cell !important; 
      transition: background-color 0.15s ease;
    }
    .rbc-day-bg:hover {
      background-color: rgba(100, 116, 139, 0.2) !important; 
    }

    .rbc-time-view .rbc-time-slot {
       cursor: cell !important;
       transition: background-color 0.1s ease;
    }
    .rbc-time-view .rbc-time-slot:hover {
       background-color: rgba(100, 116, 139, 0.2) !important;
    }

    .rbc-agenda-view table.rbc-agenda-table tbody > tr {
       cursor: pointer !important;
       transition: background-color 0.15s ease;
    }
    .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
       background-color: rgba(100, 116, 139, 0.2) !important;
    }
    /* ------------------------------------- */

    .rbc-event {
      border-radius: 4px !important;
      border: none !important;
      padding: 2px 6px !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
      outline: none;
      /* overflow: visible !important;  <- Importante quitar esto si es necesario, pero HoverCard usa portal así que no afecta */
    }
    
    .rbc-event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      filter: brightness(0.95);
      z-index: 10;
    }

    .rbc-event-label {
      font-size: 0.7rem !important;
    }

    .rbc-timeslot-group {
      border-bottom-color: var(--rbc-border) !important;
      min-height: 50px !important; 
    }
    
    .rbc-time-content {
      border-top: 1px solid var(--rbc-border) !important;
    }
    
    .rbc-time-view .rbc-label {
      font-size: 0.7rem;
      color: var(--rbc-text);
      opacity: 0.6;
      font-weight: 500;
    }
    
    .rbc-date-cell {
      padding: 4px 8px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .rbc-date-cell a {
        color: var(--rbc-text);
        opacity: 0.8;
    }

    .rbc-toolbar {
      margin-bottom: 1rem !important;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .rbc-toolbar button {
      color: var(--rbc-text) !important;
      border: 1px solid var(--rbc-border) !important;
      border-radius: 0.375rem !important;
      padding: 0.35rem 0.75rem !important;
      font-size: 0.75rem !important;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .rbc-toolbar button:hover {
      background-color: var(--rbc-border) !important;
    }
    
    .rbc-toolbar button.rbc-active {
      background-color: var(--rbc-text) !important;
      color: var(--rbc-bg) !important;
      font-weight: 600;
      border-color: var(--rbc-text) !important;
    }
    
    .rbc-toolbar-label {
      font-size: 1rem !important;
      font-weight: 700 !important;
      color: var(--rbc-text);
      text-transform: capitalize;
    }

    .calendar-fullscreen {
      position: fixed;
      inset: 0;
      z-index: 50;
      padding: 1.5rem;
      overflow: hidden;
    }
    
    .calendar-fullscreen .rbc-calendar {
      height: calc(100vh - 80px) !important;
    }
  `

  return (
    <>
      <style>{customStyles}</style>

      <div
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          isFullscreen
            ? 'calendar-fullscreen bg-white dark:bg-zinc-950'
            : 'h-full space-y-4'
        )}
      >
        <div className="flex justify-between items-center mb-2">
          {!isFullscreen && (
            <div className="text-sm text-muted-foreground font-medium">
              Gestión de Horarios
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn(
              'ml-auto gap-2 text-xs',
              isFullscreen &&
                'absolute top-4 right-4 z-[60px] bg-white dark:bg-black'
            )}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3 w-3" />
                <span className="hidden sm:inline">Salir</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3" />
                <span className="hidden sm:inline">Pantalla Completa</span>
              </>
            )}
          </Button>
        </div>

        <div
          className={cn(
            'bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 transition-all',
            !isFullscreen
              ? 'h-[700px]'
              : 'h-full border-none shadow-none p-0 bg-transparent'
          )}
        >
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
            selectable
            resizable
            // AQUI SE AGREGA LA PROPIEDAD COMPONENTS
            components={components}
            eventPropGetter={eventPropGetter}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            culture="es"
            messages={{
              next: 'Siguiente',
              previous: 'Anterior',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango.',
              showMore: (total) => `+ Ver más (${total})`
            }}
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] ">
            <DialogHeader>
              <DialogTitle>
                {selectedActivity?.id ? 'Editar Actividad' : 'Nueva Actividad'}
              </DialogTitle>
              <DialogDescription>
                Complete los detalles del evento a continuación.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[90vh] mt-4 pr-4">
              {isModalOpen && (
                <ActivityForm
                  eventId={eventId}
                  initialData={selectedActivity}
                  onSubmit={onFormSubmit}
                  onDelete={handleDeleteRequest}
                  onCancel={() => setIsModalOpen(false)}
                  isSubmitting={isSubmitting}
                />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <ConfirmAlertDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="¿Eliminar Actividad?"
          description="Esta acción no se puede deshacer. La actividad será eliminada permanentemente del horario."
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="destructive"
          onConfirm={handleConfirmDelete}
          isLoading={isSubmitting}
        />
      </div>
    </>
  )
}
