import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
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
  console.log('Usuario autenticado:', user)

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

  console.log('Perfil del usuario:', profile)

  if (!profile?.email) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.PROFILE.ONBOARDING)
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
    >
      {children}
    </AdminPanelLayout>
  )
}
