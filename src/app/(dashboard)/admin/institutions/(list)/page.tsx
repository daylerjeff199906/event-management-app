import { InstitutionsListTable } from '@/modules/admin'
import { searchInstitutionFunction } from '@/services/institution.services'
import { SearchParams } from '@/types'

interface IProps {
  searchParams: SearchParams
}

export default async function Page(props: IProps) {
  const searchParams = await props.searchParams
  const page = searchParams.page
    ? parseInt(searchParams.page as string, 10)
    : undefined
  //   const status = searchParams.status as string
  const searchQuery = (searchParams.search as string) || undefined
  const { data, error } = await searchInstitutionFunction({
    page: page,
    query: searchQuery
  })

  if (error) {
    return <div>Error: {error}</div>
  }

  return <InstitutionsListTable institutions={data || []} />
}
