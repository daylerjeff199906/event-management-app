// app/dashboard/events/[id]/cronograma/page.tsx
import BulkEventUploader from '@/modules/events/components/bulk-event-uploader'
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
    <div className="container mx-auto py-6 flex flex-col gap-4">
      <EventScheduler
        eventId={eventId}
        defaultDate={event ? new Date(event.start_date) : new Date()}
      />
      <BulkEventUploader eventId={eventId} />
    </div>
  )
}
