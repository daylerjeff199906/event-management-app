import {
  EventCards,
  HeroPage,
  MainActions,
  QuickFilters
} from '@/modules/dashboard/pages'
import { fetchCategories } from '@/services/categories.services'
import { getSupabase } from '@/services/core.supabase'
import { getInstitutionsByUserRole } from '@/services/user.roles.services'

export default async function HomePage() {
  const categories = await fetchCategories()
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()
  const responseData = await getInstitutionsByUserRole(user?.user?.id || '')

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroPage institutionsCount={responseData?.length} />
        <MainActions />
        <QuickFilters categories={categories || []} />
        <EventCards />
        {/* <EventInspiration /> */}
      </div>
    </>
  )
}
