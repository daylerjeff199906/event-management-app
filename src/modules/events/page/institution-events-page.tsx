'use client'
import { Event } from '@/types'
import { EventCard } from '../components'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { updateEventField } from '@/services/events.services'
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

  const handleToggleEventStatus = async (event: Event) => {
    const newStatus = event.status === 'PUBLIC' ? 'DRAFT' : 'PUBLIC'
    await updateEventField({
      eventId: event.id,
      fieldName: 'status',
      fieldValue: newStatus
    })
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventsList?.length > 0 &&
        eventsList.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={() => handleEventClick(event.id)}
            onToggleStatus={() => handleToggleEventStatus(event)}
          />
        ))}
      {eventsList.length === 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <EmptyState
            title="No se encontraron eventos"
            description="Parece que no hay eventos disponibles para esta institución. ¡Crea un nuevo evento para comenzar!"
            actions={[
              {
                label: 'Crear evento',
                href: APP_URL.ORGANIZATION.INSTITUTION.CREATE_EVENT(
                  institutionId || ''
                )
              }
            ]}
          />
        </div>
      )}
    </div>
  )
}
