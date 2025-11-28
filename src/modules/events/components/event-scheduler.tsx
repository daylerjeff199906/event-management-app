// components/scheduler/event-scheduler.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify' // Asumiendo que usas esta, o cambia a 'sonner' si usas shadcn

// IMPORTANTE: Estilos CSS necesarios (si no los tienes en layout)
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { ActivityForm } from './activity-form'

import {
  createEventActivity,
  updateEventActivity,
  deleteEventActivity,
  fetchAllEventActivities
} from '@/services/events.activities.service' // Asegúrate que esta ruta sea correcta
import { EventActivity } from '@/types'
import { EventActivityForm } from '@/modules/events/schemas'

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

// Interfaz extendida para el calendario
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: EventActivity
  allDay?: boolean
}

// 3. SOLUCIÓN DEL ERROR: Tipar el componente DragAndDrop con tu interfaz CalendarEvent
// Esto le dice a TS: "Este calendario solo maneja objetos de tipo CalendarEvent"
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

export function EventScheduler({
  eventId,
  defaultDate = new Date()
}: EventSchedulerProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(defaultDate)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<
    Partial<EventActivityForm> | undefined
  >(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        // Aseguramos que sean objetos Date válidos
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
      // Convertir strings ISO a Date para el formulario
      start_time: new Date(activity.start_time),
      end_time: new Date(activity.end_time)
    } as unknown as EventActivityForm)
    setIsModalOpen(true)
  }, [])

  // 4. SOLUCIÓN DEL ERROR: Tipado correcto de los argumentos del evento
  // La librería envía un objeto específico en onEventDrop y onEventResize
  interface DragDropArgs {
    event: CalendarEvent
    start: string | Date
    end: string | Date
    isAllDay?: boolean
  }

  const handleEventUpdate = useCallback(
    async ({ event, start, end }: DragDropArgs) => {
      // Convertir a objetos Date reales por seguridad (la librería a veces devuelve strings)
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
        } as Partial<EventActivityForm>) // Casting 'any' o 'Partial<EventActivityForm>' para evitar conflictos estrictos del esquema completo

        if (error) throw error
        toast.success('Horario actualizado')
      } catch {
        setEvents(oldEvents)
        toast.error('No se pudo mover el evento')
      }
    },
    [events]
  )

  // Wrapper para resize
  const onEventResize = useCallback(
    (args: DragDropArgs) => handleEventUpdate(args),
    [handleEventUpdate]
  )

  // Wrapper para drop
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

  const onDeleteEvent = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return

    setIsSubmitting(true)
    try {
      const { error } = await deleteEventActivity(id)
      if (error) throw error

      toast.success('Actividad eliminada')
      await loadActivities()
      setIsModalOpen(false)
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="h-[600px] bg-white rounded-md shadow p-4 border">
        {/* Componente Tipado */}
        <DnDCalendar
          localizer={localizer}
          events={events} // Ahora TS sabe que events es CalendarEvent[]
          // Accesores
          startAccessor="start"
          endAccessor="end"
          // Vistas y Navegación
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
          // Drag and Drop props
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          // Configuración regional
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
          className="rounded-md"
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedActivity?.id ? 'Editar Actividad' : 'Nueva Actividad'}
            </DialogTitle>
            <DialogDescription>
              Complete los detalles del evento a continuación.
            </DialogDescription>
          </DialogHeader>

          {isModalOpen && (
            <ActivityForm
              eventId={eventId}
              initialData={selectedActivity}
              onSubmit={onFormSubmit}
              onDelete={onDeleteEvent}
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
