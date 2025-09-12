import { Params } from '@/types'
import { fetchEventFullDetails } from '@/services/events.services'
import { EventDetailsPage } from '@/modules/events/page'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const uuid = await params.uuid

  const response = await fetchEventFullDetails(uuid?.toString() || '')

  if (response.error) {
    return <div>Error loading event details: {response.error.message}</div>
  }

  if (!response.data) {
    return <div>No event details found.</div>
  }

  return (
    <>
      <EventDetailsPage event={response.data} />
    </>
  )
}
