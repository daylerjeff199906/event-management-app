import { OnboardingPage } from '@/modules/portal/pages/onboarding/onboarding-page'
import { getSupabase } from '@/services/core.supabase'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  return (
    <OnboardingPage
      email={user.user?.email || undefined}
      photoURL={user.user?.user_metadata?.photoURL || undefined}
    />
  )
}
