'use client'

import { type Event, EventStatus } from '@/types/events'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface EventCardProps {
  event: Event
  onViewDetails?: (eventId: string) => void
  hiddenStatus?: boolean
  href?: string
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
  hiddenStatus,
  href
}: EventCardProps) {
  const startDate = new Date(event.start_date)
  const endDate = event.end_date ? new Date(event.end_date) : null

  const dateString = endDate
    ? `${format(startDate, 'MMM d', { locale: es })} al ${format(
        endDate,
        'MMM d, yyyy',
        { locale: es }
      )}`
    : format(startDate, 'MMM d, yyyy', { locale: es })

  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

  return (
    <Card className="group border-none shadow-none bg-transparent hover:bg-neutral-950 transition-all duration-300 rounded-xl p-4 sm:p-5 cursor-default">
      {/* group-hover:border-gray-700: Oscurece la línea divisoria al hacer hover */}
      <div className="mb-4 border-b border-gray-300 pb-2 dark:border-gray-700 group-hover:border-gray-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-white transition-colors duration-300">
            {formattedDate}
          </h4>
        </div>
      </div>

      {/* Contenedor de Imagen */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-video mb-4">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url || '/placeholder.svg'}
            alt={event.event_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {!hiddenStatus && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`${getStatusColor(event.status)} shadow-sm`}>
              {getStatusText(event.status)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-0 space-y-3">
        {/* Título Principal */}
        {/* group-hover:text-white: El título se vuelve blanco */}
        {href ? (
          <Link
            href={href}
            className="font-bold text-2xl leading-tight text-gray-900 dark:text-white cursor-pointer group-hover:text-white group-hover:underline decoration-2 underline-offset-4 decoration-primary transition-colors duration-300"
          >
            {event.event_name}
          </Link>
        ) : (
          <h3
            className="font-bold text-2xl leading-tight text-gray-900 dark:text-white cursor-pointer group-hover:text-white group-hover:underline decoration-2 underline-offset-4 decoration-primary transition-colors duration-300"
            onClick={() => onViewDetails?.(event.id)}
          >
            {event.event_name}
          </h3>
        )}

        {/* Descripción */}
        {/* group-hover:text-gray-300: El texto descriptivo se vuelve gris claro */}
        {event.description && (
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {event.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-0 mt-6">
        {href ? (
          <>
            <Button
              // group-hover:bg-white y group-hover:text-black: El botón se invierte para resaltar en el fondo oscuro
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-5 text-xs font-bold uppercase tracking-wider transition-all 
                     group-hover:translate-x-1 group-hover:bg-white group-hover:text-black"
              asChild
            >
              <Link href={href}>
                Ver Evento <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => onViewDetails?.(event.id)}
              // group-hover:bg-white y group-hover:text-black: El botón se invierte para resaltar en el fondo oscuro
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-5 text-xs font-bold uppercase tracking-wider transition-all 
                     group-hover:translate-x-1 group-hover:bg-white group-hover:text-black"
            >
              Ver Evento <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
