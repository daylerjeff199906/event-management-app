import { APP_URL } from '@/data/config-app-url'
import { InstitutionEventsPage } from '@/modules/events/page'
import { fetchEventsByInstitution } from '@/services/events.services'
import { Params } from '@/types'
import Link from 'next/link'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const slug = params.slug

  const id_institution = String(slug)

  const response = await fetchEventsByInstitution({
    institution_id: id_institution,
    pageSize: 4
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">
          Últimos eventos creados por la institución
        </h3>
        <Link
          className="text-sm text-primary hover:underline"
          href={APP_URL.ORGANIZATION.INSTITUTION.EVENTS(slug?.toString() || '')}
        >
          Ver todos los eventos
        </Link>
      </div>
      <InstitutionEventsPage
        institutionId={id_institution}
        eventsList={response.data?.data || []}
      />
    </div>
  )
}
