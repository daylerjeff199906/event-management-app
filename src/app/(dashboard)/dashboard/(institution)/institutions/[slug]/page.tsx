import { InstitutionEventsPage } from '@/modules/events/page'
import { fetchEventsByInstitution } from '@/services/events.services'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const slug = params.slug

  const id_institution = String(slug)

  const response = await fetchEventsByInstitution({
    institution_id: id_institution
  })

  return (
    <>
      <InstitutionEventsPage eventsList={response.data?.data || []} />
    </>
  )
}
