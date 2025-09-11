import { InstitutionsPage } from '@/modules/dashboard/pages/institution'
import { getSupabase } from '@/services/core.supabase'
import { getInstitutionsByUserRole } from '@/services/user.roles.services'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()
  const responseData = await getInstitutionsByUserRole(user?.user?.id || '')

  return (
    <>
      <InstitutionsPage institutionsList={responseData || []} />
    </>
  )
}
