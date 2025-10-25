import { Input } from '@/components/ui/input'
import { Params } from '@/types'
import { Search } from 'lucide-react'

interface IProps {
  children: React.ReactNode
  params: Params
}

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
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar un usuario" className="pl-10" />
          </div>
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
