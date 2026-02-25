import { APP_URL } from '@/data/config-app-url'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/services/core.supabase'
import { checkOnboardingCompleted, getUserInstitutionRole } from '@/services/user.services'
import { Params } from '@/types'

interface IProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: IProps) {
  const { children } = props
  const params = await props.params
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
    .select('*')
    .eq('id', userId)
    .single()

  const slug = params.slug as string
  const institutionRole = await getUserInstitutionRole(userId, slug)

  if (!institutionRole.has_access) {
    redirect(APP_URL.NOT_FOUND)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  )
}
