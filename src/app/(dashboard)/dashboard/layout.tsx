import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { dashboardNavMain } from './const'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { checkOnboardingCompleted, getUserInstitutions } from '@/services/user.services'

interface IProps {
  children: React.ReactNode
}

export default async function Layout(props: IProps) {
  const { children } = props
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
    .select('first_name, email, profile_image, global_role')
    .eq('id', userId)
    .single()

  const institutions = await getUserInstitutions(userId)

  const profileData = profile as {
    first_name: string | null
    email: string
    profile_image: string | null
    global_role: string | null
  } | null

  const userData = {
    name: profileData?.first_name || 'Usuario',
    email: profileData?.email || '',
    avatar: profileData?.profile_image || '',
    globalRole: profileData?.global_role || 'user'
  }

  const teamSwitcherData = [
    {
      name: 'Intranet',
      logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000946.png', // Logo de app genérico o intranet
      plan: 'Mi Cuenta'
    },
    ...(institutions?.map((inst: any) => ({
      name: inst.institution?.name || inst.institution_id,
      logo: inst.institution?.logo_url || 'Command',
      plan: 'Organización'
    })) || [])
  ]

  return (
    <SidebarProvider>
      <AppSidebar
        userData={userData}
        menuTeamSwitcher={teamSwitcherData}
        menuNavBar={{
          navMain: dashboardNavMain
        }}
      />
      {children}
    </SidebarProvider>
  )
}
