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
        email={dataProfile.email}
        initialData={{
          birthDate: dataProfile.birth_date || undefined,
          firstName: dataProfile.first_name,
          lastName: dataProfile.last_name,
          phone: dataProfile.phone,
          profileImage: dataProfile.profile_image || undefined,
          country: dataProfile.country || undefined,
          gender: dataProfile.gender as 'male' | 'female' | 'other' | undefined,
          userName: dataProfile.userName || undefined
        }}
      />
    </>
  )
}
