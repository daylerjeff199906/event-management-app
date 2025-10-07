import { UsersTable } from '@/modules/core/components'
import { getSupabase } from '@/services/core.supabase'
import { getFullUserRole } from '@/services/user.roles.services'
// import { Params } from '@/types'

// interface PageProps {
//   params: Params
// }

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const usersData = await getFullUserRole()

  if (!usersData || usersData.length === 0) {
    return <div>No users found for this institution</div>
  }

  return (
    <>
      <UsersTable
        users={usersData}
        currentUserId={user?.user?.id || undefined}
        isOwner={usersData?.some(
          (userRole) =>
            userRole.role === 'institution_owner' &&
            userRole.user_id === user?.user?.id
        )}
      />
    </>
  )
}
