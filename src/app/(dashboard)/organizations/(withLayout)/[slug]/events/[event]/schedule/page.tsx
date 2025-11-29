// app/dashboard/events/[id]/cronograma/page.tsx
import { EventScheduler } from '@/modules/events/components/event-scheduler'
import { fetchEventById } from '@/services/events.services'
import { Params } from '@/types'

interface CronogramaPageProps {
  params: Params
}

export default async function CronogramaPage(props: CronogramaPageProps) {
  const params = await props.params
  const eventId = params.event as string

  const eventData = await fetchEventById(eventId)
  const event = eventData?.data

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Cronograma del Evento
        </h1>
        <p className="text-muted-foreground">
          Gestiona las actividades, horarios y modalidades.
        </p>
      </div>

      <EventScheduler
        eventId={eventId}
        defaultDate={event ? new Date(event.start_date) : new Date()}
      />
    </div>
  )
}
