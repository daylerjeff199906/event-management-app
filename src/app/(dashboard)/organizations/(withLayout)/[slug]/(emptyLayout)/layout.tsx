import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { checkOnboardingCompleted, getUserInstitutions, getUserInstitutionRole } from '@/services/user.services'
import { Params } from '@/types'

interface IProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: IProps) {
  const { children } = props
  const params = await props.params
  const supabase = await getSupabase()
  const { data: authUser } = await supabase.auth.getUser()

  if (!authUser.user) {
    redirect(APP_URL.AUTH.LOGIN)
  }

  const userId = authUser.user.id

  const onboardingCompleted = await checkOnboardingCompleted(userId)
  
  if (!onboardingCompleted) {
    redirect(APP_URL.PORTAL.ONBOARDING)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const slug = params.slug as string
  const institutionRole = await getUserInstitutionRole(userId, slug)

  if (!institutionRole.has_access) {
    redirect(APP_URL.NOT_FOUND)
  }

  const institutions = await getUserInstitutions(userId)

  const hasInstitution = institutions && institutions.length > 0

  const profileData = profile as {
    first_name: string | null
    email: string
    profile_image: string | null
  }

  return (
    <AdminPanelLayout
      userName={profileData?.first_name || 'Usuario'}
      email={profileData.email}
      urlPhoto={profileData?.profile_image || undefined}
      menuItems={[]}
      isInstitutional={hasInstitution}
      hiddenSidebar
    >
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </AdminPanelLayout>
  )
}
