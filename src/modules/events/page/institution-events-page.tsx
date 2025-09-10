import { Event } from '@/types'
import { EventCard } from '../components'

interface PageProps {
  eventsList: Event[]
}

export const InstitutionEventsPage = ({ eventsList }: PageProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventsList.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
