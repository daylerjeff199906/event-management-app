'use client'

import { type Event, EventStatus } from '@/types/events'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EventCardProps {
  event: Event
  onViewDetails: (eventId: string) => void
  hiddenStatus?: boolean
}

const getStatusColor = (status?: EventStatus) => {
  switch (status) {
    case EventStatus.PUBLIC:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case EventStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case EventStatus.DELETE:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getStatusText = (status?: EventStatus) => {
  switch (status) {
    case EventStatus.PUBLIC:
      return 'Público'
    case EventStatus.DRAFT:
      return 'Borrador'
    case EventStatus.DELETE:
      return 'Eliminado'
    default:
      return 'Sin estado'
  }
}

export function EventCardUser({
  event,
  onViewDetails,
  hiddenStatus
}: EventCardProps) {
  const startDate = new Date(event.start_date)
  const endDate = event.end_date ? new Date(event.end_date) : null

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden pt-0 shadow-none border">
      <div className="relative">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url || '/placeholder.svg'}
            alt={event.event_name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <CalendarDays className="w-16 h-16 text-primary/40" />
          </div>
        )}
        {!hiddenStatus && (
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-lg lg:text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {event.event_name}
        </h3>
        {event.description && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {event.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>
              {format(startDate, 'dd MMM yyyy', { locale: es })}
              {endDate &&
                ` - ${format(endDate, 'dd MMM yyyy', { locale: es })}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onViewDetails(event.id)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors hover:cursor-pointer rounded-full"
          variant="outline"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  )
}
