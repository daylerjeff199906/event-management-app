import { APP_URL } from '@/data/config-app-url'
import { EventsCreateForm } from '@/modules/events'
import { getSupabase } from '@/services/core.supabase'
import { Params } from '@/types'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const institutionId = params?.slug?.toString()
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()
  return (
    <>
      <EventsCreateForm
        authorId={user?.user?.id}
        institutionId={institutionId!}
        urlReturn={APP_URL.DASHBOARD.INSTITUTION.EVENTS(institutionId!)}
      />
    </>
  )
}
