import { LoginForm } from '@/components/app/auth/login-form'
import { APP_URL } from '@/data/config-app-url'
import { getSupabase } from '@/services/core.supabase'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (user.user) {
    // Si hay usuario, redirigir al dashboard
    redirect(APP_URL.DASHBOARD.BASE)
  }
  return <LoginForm />
}
