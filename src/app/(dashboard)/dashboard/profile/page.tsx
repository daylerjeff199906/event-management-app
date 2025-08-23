import { ProfileEditor } from '@/modules/dashboard'
import { getSupabase } from '@/services/core.supabase'
import { IUser } from '@/types'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user?.id)
    .maybeSingle()

  const dataProfile: IUser = profile

  return (
    <>
      <ProfileEditor
        userId={dataProfile.id}
        email={dataProfile.email}
        initialData={{
          birth_date: dataProfile.birth_date || undefined,
          first_name: dataProfile.first_name,
          last_name: dataProfile.last_name,
          phone: dataProfile.phone,
          profile_image: dataProfile.profile_image || undefined,
          country: dataProfile.country || undefined,
          gender: dataProfile.gender as 'male' | 'female' | 'other' | undefined,
          username: dataProfile.userName || undefined
        }}
      />
    </>
  )
}
