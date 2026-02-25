import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { UsersTableList } from '@/modules/core/components'
import { getUsersPagination } from '@/services/user.roles.services'
import { SearchParams } from '@/types'
import { getSupabase } from '@/services/core.supabase'
import { getUserById } from '@/services/user.roles.services'

interface PageProps {
  searchParams: SearchParams
}

export default async function Page(props: PageProps) {
  const params = await props.searchParams
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const query = (await params.query?.toString()) || ''
  const page = parseInt((await params.page?.toString()) || '1', 10)

  const userList = await getUsersPagination({
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

  const currentUser = await getUserById(user?.user?.id || '')
  const isAdmin = currentUser?.global_role === 'admin'
  return (
    <>
      <UsersTableList
        key="user-table-list"
        canManageRoles={isAdmin}
        currentUserId={user?.user?.id || ''}
        users={userList.users}
      />
    </>
  )
}
