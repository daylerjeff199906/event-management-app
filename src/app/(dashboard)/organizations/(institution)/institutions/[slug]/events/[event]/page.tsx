import { EventsEditForm } from '@/modules/events'
import { fetchEventById } from '@/services/events.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const eventId = await params.event

  const response = await fetchEventById(eventId?.toString() || '')
  console.log('Event data:', response.data)
  if (response.error || !response.data) {
    return <div>Error loading event data.</div>
  }

  return (
    <div>
      <EventsEditForm eventData={response.data} />
    </div>
  )
}
