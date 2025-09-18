import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { adminMenu } from '../dashboard/const'

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
  console.log(profile)

  // Si hay sesión, continuar con el flujo normal
  const { data: datarole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.user?.id)
    .maybeSingle()
  console.log(datarole)
  if (
    !Array.isArray(datarole?.role_action) ||
    !datarole.role_action.includes('ADMIN')
  ) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.NOT_FOUND)
  }

  const profileData = (await profile) as {
    first_name: string | null
    email: string
    profile_image: string | null
  }

  return (
    <AdminPanelLayout
      userName={profileData?.first_name || 'Usuario'}
      email={profile.email}
      urlPhoto={profileData?.profile_image || undefined}
      menuItems={adminMenu}
    >
      {children}
    </AdminPanelLayout>
  )
}
