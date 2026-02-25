import { LayoutWrapper } from '@/components/layout-wrapper'
import { InstitutionEventsHeader } from '@/modules/events/page/institution-events-header'
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
    <LayoutWrapper
      sectionTitle='Eventos'
    >
      <div className="flex flex-col gap-6">
        <InstitutionEventsHeader institutionId={institutionId!} />
        {children}
      </div>
    </LayoutWrapper>
  )
}
