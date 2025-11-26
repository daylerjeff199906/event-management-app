import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { UsersTableList } from '@/modules/core/components'
import { getUsersPagintion } from '@/services/user.roles.services'
import { SearchParams } from '@/types'
import { getSupabase } from '@/services/core.supabase'

interface PageProps {
  searchParams: SearchParams
}

export default async function Page(props: PageProps) {
  const params = await props.searchParams
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const query = (await params.query?.toString()) || ''
  const page = parseInt((await params.page?.toString()) || '1', 10)

  const userList = await getUsersPagintion({
    page: page,
    query: query
  })

  if (!userList || userList.users.length === 0) {
    return (
      <EmptyState
        title="No se encontraron usuarios"
        description="Parece que no hay usuarios disponibles. ¡Agrega nuevos usuarios para comenzar!"
      />
    )
  }

  const isAdmin = user?.user?.role?.includes('ADMIN') || false

  return (
    <>
      <UsersTableList showActions={isAdmin} users={userList.users} />
    </>
  )
}
