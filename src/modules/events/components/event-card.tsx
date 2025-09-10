'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  CalendarDays,
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  ImageIcon,
  ToggleLeft
} from 'lucide-react'
import { Event } from '@/types'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
  onEdit?: (event: Event) => void
  onChangeImage?: (event: Event) => void
  onToggleStatus?: (event: Event) => void
}

export function EventCard({
  event,
  onEdit,
  onChangeImage,
  onToggleStatus
}: EventCardProps) {
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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card overflow-hidden pt-0 shadow-none">
      {event.cover_image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.cover_image_url || '/placeholder.svg'}
            alt={event.event_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
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
          <div className="flex items-center gap-2 shrink-0">
            {event.status && (
              <Badge
                variant="secondary"
                className={cn('rounded-full', getStatusColor(event.status))}
              >
                {event.status}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menú de acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onEdit?.(event)}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar evento
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onChangeImage?.(event)}
                  className="cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Cambiar imagen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggleStatus?.(event)}
                  className="cursor-pointer"
                >
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Cambiar estado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
