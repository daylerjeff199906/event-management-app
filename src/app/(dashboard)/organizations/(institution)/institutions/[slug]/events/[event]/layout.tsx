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

  return <EventManageLayout menuItems={[]}>{children}</EventManageLayout>
}
