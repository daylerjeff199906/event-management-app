import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { adminPanelNavMain } from '../dashboard/const'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'

interface IProps {
  children: React.ReactNode
}

export default async function Layout(props: IProps) {
  const { children } = props
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (!user) {
    // Si no hay usuario, redirigir a la página de login
    redirect(APP_URL.AUTH.LOGIN)
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user?.id)
    .maybeSingle()

  // Si hay sesión, continuar con el flujo normal
  const isAdmin =
    profile?.role && profile.role?.length > 0 && profile.role.includes('ADMIN')
      ? true
      : false

  if (!profile?.email) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.PORTAL.ONBOARDING)
  }

  if (!isAdmin) {
    redirect(APP_URL.NOT_FOUND)
  }

  const profileData = (await profile) as {
    first_name: string | null
    email: string
    profile_image: string | null
  }

  const userData = {
    name: profileData?.first_name || 'Usuario',
    email: profile.email,
    avatar: profileData?.profile_image || ''
  }

  const { data: institutions } = await supabase
    .from('user_roles')
    .select('institution_id')
    .eq('user_id', user.user?.id)

  const teamSwitcherData = institutions?.map((inst: any) => ({
    name: inst.institution_id,
    logo: 'Command',
    plan: 'Organization'
  }))

  return (
    <SidebarProvider>
      <AppSidebar
        userData={userData}
        menuTeamSwitcher={teamSwitcherData || []}
        menuNavBar={{
          navMain: adminPanelNavMain
        }}
      />
      {children}
    </SidebarProvider>
  )
}
