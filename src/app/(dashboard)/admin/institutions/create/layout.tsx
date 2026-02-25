import { LayoutWrapper } from '@/components/layout-wrapper'

interface IProps {
  children: React.ReactNode
}

export default function Layout(props: IProps) {
  const { children } = props

  return (
    <LayoutWrapper sectionTitle="Agregar Institución">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Agregar Institución
        </h1>
        {children}
      </div>
    </LayoutWrapper>
  )
}
