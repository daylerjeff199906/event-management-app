import { Footer } from '@/components/app/panel-admin/footer'
import { APP_URL } from '@/data/config-app-url'
import { NavbarCustom } from '@/modules/portal/components'
import { fetchCategories } from '@/services/categories.services'
import { getSupabase } from '@/services/core.supabase'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const categories = await fetchCategories()
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  return (
    <>
      <NavbarCustom
        categories={categories || []}
        logoHref={APP_URL.PORTAL.BASE}
        userConfig={{
          isLoggedIn: !!user?.user,
          userAvatar: user?.user?.user_metadata?.avatar_url || null,
          userName: user?.user?.user_metadata?.full_name || 'Invitado',
          email: user?.user?.email || ''
        }}
      />
      {children}
      <Footer disabledOpen />
    </>
  )
}
