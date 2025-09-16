import { RegistrationRequestsTable } from '@/modules/admin'
import { fetchRegistrationRequests } from '@/services/registration_requests.services'
import { SearchParams } from '@/types'

interface IProps {
  searchParams: SearchParams
}

export default async function Page(props: IProps) {
  const searchParams = await props.searchParams

  const page = searchParams.page
    ? parseInt(searchParams.page as string, 10)
    : undefined
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize as string, 10)
    : undefined
  const status = searchParams.status as string
  const searchQuery = (searchParams.search as string) || undefined

  const { data, error } = await fetchRegistrationRequests({
    page,
    pageSize,
    status,
    searchQuery: searchQuery
  })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <RegistrationRequestsTable requests={data?.data || []} />
    </div>
  )
}
