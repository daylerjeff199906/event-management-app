import { APP_URL } from '@/data/config-app-url'
import { EventManageLayout } from '@/modules/events'
import { Params } from '@/types'

interface LayoutProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: LayoutProps) {
  const { children } = props
  const params = await props.params
  const institutionId = params?.slug?.toString()

  return (
    <EventManageLayout
      backLabel="Volver a eventos"
      menuItems={[]}
      urlBack={APP_URL.ORGANIZATION.INSTITUTION.EVENTS(institutionId || '')}
    >
      {children}
    </EventManageLayout>
  )
}
