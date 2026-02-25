import { InstitutionsPage } from '@/modules/dashboard/pages/institution'
import { getSupabase } from '@/services/core.supabase'
import { getInstitutionsByUserRole } from '@/services/user.roles.services'

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const query = (searchParams.query as string) || ''
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()
  const responseData = await getInstitutionsByUserRole(
    user?.user?.id || '',
    query
  )

  return (
    <>
      <InstitutionsPage institutionsList={responseData || []} />
    </>
  )
}
