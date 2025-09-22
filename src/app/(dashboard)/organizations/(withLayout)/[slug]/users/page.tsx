import { UsersTable } from '@/modules/core/components'
import { getSupabase } from '@/services/core.supabase'
import { getfullUserRoleByInstitution } from '@/services/user.roles.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const institutionId = params?.slug?.toString() || null
  if (!institutionId) {
    return <div>No institution ID provided</div>
  }

  const usersData = await getfullUserRoleByInstitution(institutionId)

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
