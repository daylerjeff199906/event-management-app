import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { UsersTableList } from '@/modules/core/components'
import { getUsersPagintion } from '@/services/user.roles.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params

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
