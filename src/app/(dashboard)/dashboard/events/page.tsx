import { UserEventsPage } from '@/modules/events/page'

export default function HomePage() {
  return (
    <>
      {/* <EventsHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <main className="flex-1 min-w-0">
          <EventsGrid />
        </main>
      </div> */}
      <UserEventsPage isAuthenticated />
    </>
  )
}
