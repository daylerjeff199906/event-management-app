import { Input } from '@/components/ui/input'
import { AddUserSection } from '@/modules/dashboard/pages/institution'
import { getfullUserRoleByInstitution } from '@/services/user.roles.services'
import { Params } from '@/types'
import { Search } from 'lucide-react'
import { LayoutWrapper } from '@/components/layout-wrapper'

interface IProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: IProps) {
  const { children } = props
  const params = await props.params

  const institutionId = params?.uuid?.toString() || null
  if (!institutionId) {
    return <div>No institution ID provided</div>
  }

  const usersData = await getfullUserRoleByInstitution(institutionId)

  return (
    <LayoutWrapper sectionTitle="Usuarios">
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar un usuario" className="pl-10" />
        </div>
        <AddUserSection
          institutionId={institutionId}
          existingUsers={usersData || []}
        />
      </div>
      {children}
    </LayoutWrapper>
  )
}
