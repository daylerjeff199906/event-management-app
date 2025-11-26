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

  const { data: institutions } = await supabase
    .from('user_roles')
    .select('institution_id')
    .eq('user_id', user.user?.id)

  const hasInstitution = institutions && institutions.length > 0 ? true : false

  return (
    <AdminPanelLayout
      userName={profileData?.first_name || 'Usuario'}
      email={profile.email}
      urlPhoto={profileData?.profile_image || undefined}
      menuItems={adminMenu}
      isAdmin={isAdmin}
      isInstitutional={hasInstitution}
    >
      {children}
    </AdminPanelLayout>
  )
}
