'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Clock } from 'lucide-react'
import { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'finalizado':
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card shadow-none pt-0">
      <CardHeader className="pb-3 flex items-start gap-4">
        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt={event.event_name}
            className="w-20 h-20 object-cover rounded-lg border border-border mr-4"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors text-balance">
            {event.event_name}
          </h3>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 text-pretty">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {event.status && (
            <Badge
              variant="secondary"
              className={`${getStatusColor(
                event.status
              )} shrink-0 rounded-full`}
            >
              {event.status}
            </Badge>
          )}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              title="Editar"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => {
                /* handle edit */
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
            <button
              type="button"
              title="Ver detalles"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => {
                /* handle view details */
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{formatDate(event.start_date)}</span>
          <Clock className="h-4 w-4 shrink-0 ml-2" />
          <span>{formatTime(event.start_date)}</span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.end_date && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Finaliza: {formatDate(event.end_date)} a las{' '}
            {formatTime(event.end_date)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
