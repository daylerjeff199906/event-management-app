import { EventMapDesigner } from '@/modules/events/components/ticket-desing/ticket-desing-form'
import { fetchEventMapZonesByEventId } from '@/services/event.map.zones.service'
import { fetchEventTicketsByEventId } from '@/services/events.ticket.service'
import { fetchEventMapsByEventId } from '@/services/events.maps.service'
import { Params } from '@/types'

interface TicketsPageProps {
  params: Params
}

export default async function TicketsPage(props: TicketsPageProps) {
  const params = await props.params
  const eventId = params.event as string

  const { data: mapZones } = await fetchEventMapZonesByEventId(eventId)
  const { data: eventTickets } = await fetchEventTicketsByEventId(eventId)
  const { data: eventMaps } = await fetchEventMapsByEventId(eventId)

  return (
    <>
      <EventMapDesigner
        eventId={eventId}
        initialTickets={eventTickets || []}
        initialZones={mapZones || []}
        initialMaps={eventMaps || []}
      />
    </>
  )
}
