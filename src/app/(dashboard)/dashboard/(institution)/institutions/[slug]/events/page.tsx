import { InstitutionEventsPage } from '@/modules/events/page'
import { fetchEventsByInstitution } from '@/services/events.services'
import { Params, SearchParams } from '@/types'

interface PageProps {
  params: Params
  searchParams: SearchParams
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug

  const id_institution = String(slug)

  const response = await fetchEventsByInstitution({
    institution_id: id_institution,
    page: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
    searchQuery: searchParams.searchQuery
      ? searchParams.searchQuery.toString()
      : undefined
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between md:gap-0 gap-4">
        <h3 className="text-lg font-semibold text-foreground">
          Últimos eventos creados por la institución
        </h3>
      </div>
      <InstitutionEventsPage eventsList={response.data?.data || []} />
    </div>
  )
}
