import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { adminNavMain } from '@/app/(dashboard)/dashboard/const'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { Params } from '@/types'
import { checkOnboardingCompleted, getUserInstitutions, getUserInstitutionRole } from '@/services/user.services'

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

  const institutions = await getUserInstitutions(userId)

  const profileData = profile as {
    first_name: string | null
    email: string
    profile_image: string | null
  }

  const idInstitution = params.slug as string
  
  const institutionRole = await getUserInstitutionRole(userId, idInstitution)

  if (!institutionRole.has_access) {
    redirect(APP_URL.NOT_FOUND)
  }

  const userData = {
    name: profileData?.first_name || 'Usuario',
    email: profileData.email,
    avatar: profileData?.profile_image || ''
  }

  const teamSwitcherData = institutions?.map((inst: any) => ({
    name: inst.institution?.name || inst.institution_id,
    logo: 'Command',
    plan: 'Organization'
  })) || []

  return (
    <SidebarProvider>
      <AppSidebar
        userData={userData}
        menuTeamSwitcher={teamSwitcherData}
        menuNavBar={{
          navMain: adminNavMain(idInstitution?.toString() || '')
        }}
      />
      {children}
    </SidebarProvider>
  )
}
