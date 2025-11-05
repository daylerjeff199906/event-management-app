import { EmptyState } from '@/components/app/miscellaneous/empty-state'
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
      {response?.data && response?.data?.data?.length > 0 && (
        <InstitutionEventsPage
          institutionId={id_institution}
          eventsList={response.data?.data || []}
        />
      )}
      {!response?.data ||
        (response?.data?.data?.length === 0 && (
          <EmptyState
            title="No se encontraron eventos"
            description="Parece que no hay eventos disponibles para esta institución. ¡Crea un nuevo evento para comenzar!"
          />
        ))}
    </>
  )
}
