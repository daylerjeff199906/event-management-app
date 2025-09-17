import { RequestDetailsPage } from '@/modules/admin'
import { fetchRegistrationRequestsByInstitution } from '@/services/registration_requests.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { uuid } = params

  if (!uuid || Array.isArray(uuid)) {
    return <div>Invalid UUID</div>
  }
  const { data: request, error } = await fetchRegistrationRequestsByInstitution(
    { id_request: uuid }
  )

  if (error) {
    return <div>Error fetching request</div>
  }

  if (!request) {
    return <div>No request found</div>
  }

  return <RequestDetailsPage itemData={request} />
}
