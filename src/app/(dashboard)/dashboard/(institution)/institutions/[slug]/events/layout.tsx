import { InstitutionEventsHeader } from '@/modules/events/page/institution-events-header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <div className="flex flex-col gap-6">
      <InstitutionEventsHeader />
      {children}
    </div>
  )
}
