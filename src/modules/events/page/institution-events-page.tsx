'use client'
import { Event } from '@/types'
import { EventCard } from '../components'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
interface PageProps {
  eventsList: Event[]
  institutionId?: string
}

export const InstitutionEventsPage = ({
  eventsList,
  institutionId
}: PageProps) => {
  const router = useRouter()

  const handleEventClick = (eventId: string) => {
    router.push(
      APP_URL.ORGANIZATION.INSTITUTION.EDIT_EVENT(institutionId || '', eventId)
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventsList.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={() => handleEventClick(event.id)}
        />
      ))}
    </div>
  )
}
