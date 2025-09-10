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
      <div className="flex items-center justify-between md:gap-0 gap-4">
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
      <InstitutionEventsPage eventsList={response.data?.data || []} />
    </div>
  )
}
