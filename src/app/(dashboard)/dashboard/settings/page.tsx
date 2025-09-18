import { SettingsEditor } from '@/modules/dashboard/components'
import { Notifications } from '@/modules/portal/lib/validations'
import { getSupabase } from '@/services/core.supabase'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.user?.id)
    .single()

  const dataNotifications: Notifications = notifications

  return (
    <>
      <SettingsEditor userId={user?.user?.id} initialData={dataNotifications} />
    </>
  )
}
