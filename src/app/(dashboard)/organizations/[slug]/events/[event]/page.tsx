import { EventsEditForm } from '@/modules/events'
import { fetchCategories } from '@/services/categories.services'
import { fetchEventById } from '@/services/events.services'
import { getAddressById } from '@/services/address.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const eventId = await params.event
  const institutionId = params?.slug?.toString()

  const categories = await fetchCategories()

  const response = await fetchEventById(eventId?.toString() || '')

  if (response.error || !response.data) {
    return <div>Error loading event data.</div>
  }

  const addressData = await getAddressById(response.data.adress_uuid || '')

  return (
    <div>
      <EventsEditForm
        institutionId={institutionId!}
        categories={categories}
        eventData={response.data}
        eventAddress={addressData.data || null}
      />
    </div>
  )
}
