import { AdvancedFilterHorizontal } from '@/components/app/miscellaneous/advanced-filter-horizontal'
import { Params } from '@/types'
import { LayoutWrapper } from '@/components/layout-wrapper'

interface IProps {
  children: React.ReactNode
  params: Params
}

const SEARCH_FIELDS = [
  { key: 'query', label: 'Buscar', placeholder: 'Buscar usuario...' }
]

export default async function Layout(props: IProps) {
  const { children } = props

  return (
    <LayoutWrapper sectionTitle="Usuarios">
      <div className="flex gap-2 mb-8">
        <AdvancedFilterHorizontal searchFields={SEARCH_FIELDS} filters={[]} />
      </div>
      {children}
    </LayoutWrapper>
  )
}
