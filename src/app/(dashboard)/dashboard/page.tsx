import {
  EventCards,
  EventInspiration,
  HeroPage,
  MainActions,
  QuickFilters
} from '@/modules/dashboard/pages'

export default function HomePage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroPage />
        <MainActions />
        <QuickFilters />
        <EventCards />
        <EventInspiration />
      </div>
    </>
  )
}
