import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { UsersTableList } from '@/modules/core/components'
import { getUsersPagintion } from '@/services/user.roles.services'
import { SearchParams } from '@/types'

interface PageProps {
  searchParams: SearchParams
}

export default async function Page(props: PageProps) {
  const params = await props.searchParams

  const query = (await params.query?.toString()) || ''

  const userList = await getUsersPagintion({
    page: 1,
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

  return (
    <>
      <UsersTableList users={userList.users} />
    </>
  )
}
