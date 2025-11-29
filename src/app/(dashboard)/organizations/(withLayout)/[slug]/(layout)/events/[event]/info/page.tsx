import { EventDetailsEditForm } from '@/modules/events'
import { Params } from '@/types'
import { getEventDetailsByIdEvent } from '@/services/events.info.services'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const eventId = await params.event

  const eventsDeatails = await getEventDetailsByIdEvent(
    eventId?.toString() || ''
  )

  return (
    <div>
      <EventDetailsEditForm
        initialData={eventsDeatails?.data || undefined}
        eventId={eventId?.toString() || ''}
      />
    </div>
  )
}
