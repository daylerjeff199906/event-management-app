import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

interface IProps {
  children: React.ReactNode
}

export default async function Layout(props: IProps) {
  const { children } = props
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) redirect(APP_URL.AUTH.LOGIN)

  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
