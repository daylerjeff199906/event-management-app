import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { UsersTable } from '@/modules/core/components'
import { getSupabase } from '@/services/core.supabase'
import { getfullUserRoleByInstitution } from '@/services/user.roles.services'
import { Params } from '@/types'
import Image from 'next/image'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const institutionId = params?.uuid?.toString() || null
  if (!institutionId) {
    return <div>No institution ID provided</div>
  }

  const usersData = await getfullUserRoleByInstitution(institutionId)

  if (!usersData || usersData.length === 0) {
    return (
      <EmptyState
        title="No se han encontrado usuarios"
        description="Parece que no hay usuarios asociados a esta institución."
        icon={
          <Image
            src="/svg/empty-states.svg"
            alt="No users"
            width={150}
            height={150}
          />
        }
      />
    )
  }

  return (
    <>
      <UsersTable
        users={usersData}
        currentUserId={user?.user?.id || undefined}
      />
    </>
  )
}
