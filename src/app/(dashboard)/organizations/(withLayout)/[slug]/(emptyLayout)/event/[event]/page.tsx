import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { EventsEditForm } from '@/modules/events'
import { getAddressById } from '@/services/address.services'
import { fetchCategories } from '@/services/categories.services'
import { fetchEventById } from '@/services/events.services'
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
    return (
      <EmptyState
        title="Evento no encontrado"
        description="El evento que estás buscando no existe o ha sido eliminado."
      />
    )
  }

  const addressId = response.data.address_id
  const addressData = await getAddressById(addressId || '')

  return (
    <EventsEditForm
      institutionId={institutionId!}
      categories={categories}
      eventData={response.data}
      addressData={addressData.data || undefined}
    />
  )
}
