import { UsersTable } from '@/modules/core/components'
import { getfullUserRoleByInstitution } from '@/services/user.roles.services'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params

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
      <UsersTable users={usersData} />
    </>
  )
}
