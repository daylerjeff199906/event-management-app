import { EventMapDesigner } from '@/modules/events/components/ticket-desing/ticket-desing-form'
import { fetchEventMapZonesByMapId } from '@/services/event.map.zones.service'
import { fetchEventTicketsByEventId } from '@/services/events.ticket.service'
import { fetchEventMapsByEventId } from '@/services/events.maps.service'
import { Params, SearchParams } from '@/types'

interface TicketsPageProps {
  params: Params
  searchParams: SearchParams
}

export default async function TicketsPage(props: TicketsPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const eventId = params.event as string

  const mapId = searchParams.map as string | undefined

  const { data: mapZones } = await fetchEventMapZonesByMapId(mapId!)
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
