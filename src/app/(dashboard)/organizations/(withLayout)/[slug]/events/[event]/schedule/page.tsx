// app/dashboard/events/[id]/cronograma/page.tsx
import { EventScheduler } from '@/modules/events/components/event-scheduler'
import { Params } from '@/types'

interface CronogramaPageProps {
  params: Params
}

export default async function CronogramaPage(props: CronogramaPageProps) {
  const params = await props.params
  const eventId = params.event as string

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
        // Opcional: pasar una fecha específica si el evento es en el futuro
        // defaultDate={new Date('2024-12-01')}
      />
    </div>
  )
}
