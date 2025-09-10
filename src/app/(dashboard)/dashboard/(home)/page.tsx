import {
  EventCards,
  HeroPage,
  MainActions,
  QuickFilters
} from '@/modules/dashboard/pages'
import { fetchCategories } from '@/services/categories.services'

export default async function HomePage() {
  const categories = await fetchCategories()
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroPage />
        <MainActions />
        <QuickFilters categories={categories || []} />
        <EventCards />
        {/* <EventInspiration /> */}
      </div>
    </>
  )
}
