import { UsersTable } from '@/modules/core/components'
import { getSupabase } from '@/services/core.supabase'
import { getUsersPagintion } from '@/services/user.roles.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const query = (await params.query?.toString()) || ''

  const userList = await getUsersPagintion({
    page: 1,
    query: query
  })

  if (!userList || userList.users.length === 0) {
    return <div>No users found for this institution</div>
  }

  return (
    <>
      <UsersTable
        users={userList.users}
        currentUserId={user?.user?.id || undefined}
        isOwner
      />
    </>
  )
}
