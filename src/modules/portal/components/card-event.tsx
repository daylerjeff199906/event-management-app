'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Star } from 'lucide-react'
import { useState } from 'react'
import { Event } from '@/types'

interface EventCardProps {
  event: Event
  onLike: (eventId: string) => void
  primaryButtonLabel?: string
}
export function EventCardComponent({
  event,
  primaryButtonLabel = 'Me interesa'
}: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
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

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return null // Event already passed
    if (diffDays > 30) return null // More than a month away

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    return `En ${diffDays} días`
  }

  const daysUntilEvent = getDaysUntilEvent(event.start_date)

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
    return { day, month }
  }

  return (
    <Card className="group border rounded-2xl overflow-hidden shadow-none transition-all duration-300 cursor-pointer pt-0">
      <div className="relative h-44 overflow-hidden">
        {event.cover_image_url && (
          <>
            <div
              className={`absolute inset-0 bg-gray-200 ${
                imageLoaded ? 'hidden' : ''
              }`}
            ></div>
            <img
              src={event.cover_image_url}
              alt={event.event_name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? '' : 'invisible'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
        {event.is_featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full flex items-center text-xs font-medium">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Destacado
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-gray-900/70 px-3 py-5 rounded-md text-xs font-semibold shadow flex flex-col items-center gap-4">
          <div className="text-center flex flex-col gap-2 text-white">
            <div className="text-2xl lg:text-3xl leading-none">
              {formatShortDate(event.start_date).day}
            </div>
            <div className="text-sm leading-none">
              {formatShortDate(event.start_date).month}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="px-5 pb-0">
        <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.event_name}
        </h3>

        <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
          {event.description}
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatDate(event.start_date)} • {formatTime(event.start_date)}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {daysUntilEvent && (
            <div className="text-xs font-medium text-primary mt-2">
              {daysUntilEvent}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full bg-gray-100 text-gray-900  hover:text-primary-foreground transition-colors group-hover:bg-primary rounded-full group-hover:text-white"
          variant="default"
        >
          {primaryButtonLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
