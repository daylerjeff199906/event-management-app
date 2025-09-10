import { InstitutionEventsPage } from '@/modules/events/page'
import { fetchEventsByInstitution } from '@/services/events.services'
import { EventStatus, Params, SearchParams } from '@/types'

interface PageProps {
  params: Params
  searchParams: SearchParams
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug

  const id_institution = String(slug)
  const deleted = searchParams.deleted === 'true' ? EventStatus.DELETE : null

  const response = await fetchEventsByInstitution({
    institution_id: id_institution,
    // page: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
    searchQuery: searchParams.search
      ? searchParams.search.toString()
      : undefined,
    status: deleted ? deleted : (searchParams.status as EventStatus) || null
  })

  return (
    <>
      <InstitutionEventsPage eventsList={response.data?.data || []} />
    </>
  )
}
