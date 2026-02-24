import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { adminNavMain } from '@/app/(dashboard)/dashboard/const'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { Params } from '@/types'

interface IProps {
  children: React.ReactNode
  params: Params
}

import { Command } from 'lucide-react'

export default async function Layout(props: IProps) {
  const { children } = props
  const params = await props.params
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (!user) {
    // Si no hay usuario, redirigir a la página de login
    redirect(APP_URL.AUTH.LOGIN)
  }

  // Si hay sesión, continuar con el flujo normal
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user?.id)
    .maybeSingle()

  if (!profile?.email) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.PORTAL.ONBOARDING)
  }

  const { data: institutions } = await supabase
    .from('user_roles')
    .select('institution_id')
    .eq('user_id', user.user?.id)

  const profileData = (await profile) as {
    first_name: string | null
    email: string
    profile_image: string | null
  }

  const hasInstitution = institutions && institutions.length > 0 ? true : false

  const idInstitution = params.slug

  const isAdmin =
    profile?.role && profile.role?.length > 0 && profile.role.includes('ADMIN')
      ? true
      : false

  const userData = {
    name: profileData?.first_name || 'Usuario',
    email: profile.email,
    avatar: profileData?.profile_image || ''
  }

  const teamSwitcherData = institutions?.map((inst: any) => ({
    name: inst.institution_id, // Map this to institution name if possible later
    logo: Command,
    plan: 'Organization'
  }))

  return (
    <SidebarProvider>
      <AppSidebar
        userData={userData}
        menuTeamSwitcher={teamSwitcherData || []}
        menuNavBar={{
          navMain: adminNavMain(idInstitution?.toString() || '')
        }}
      />
      {children}
    </SidebarProvider>
  )
}
