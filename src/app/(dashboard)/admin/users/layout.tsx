import { AdvancedFilterHorizontal } from '@/components/app/miscellaneous/advanced-filter-horizontal'
import { Params } from '@/types'

interface IProps {
  children: React.ReactNode
  params: Params
}

const SEARCH_FIELDS = [
  { key: 'query', label: 'Buscar', placeholder: 'Buscar usuario...' }
]

export default async function Layout(props: IProps) {
  const { children } = props

  // const usersData = await getfullUserRoleByInstitution(institutionId)

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Usuarios
        </h1>
        <div className="flex gap-2 mb-8">
          <AdvancedFilterHorizontal searchFields={SEARCH_FIELDS} filters={[]} />
          {/* <AddUserSection
            institutionId={institutionId}
            existingUsers={usersData || []}
          /> */}
        </div>
        {children}
      </div>
    </main>
  )
}
