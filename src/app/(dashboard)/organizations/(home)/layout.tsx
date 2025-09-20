import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'

interface IProps {
  children: React.ReactNode
}

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

  // Si hay sesión, continuar con el flujo normal
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user?.id)
    .maybeSingle()

  if (!profile?.email) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.PROFILE.ONBOARDING)
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
  return (
    <AdminPanelLayout
      userName={profileData?.first_name || 'Usuario'}
      email={profile.email}
      urlPhoto={profileData?.profile_image || undefined}
      menuItems={[]}
      isInstitutional={hasInstitution}
      hiddenSidebar
    >
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground mb-6">
            Instituciones
          </h1>
          <div className="flex gap-2 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar una institución" className="pl-10" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </AdminPanelLayout>
  )
}
