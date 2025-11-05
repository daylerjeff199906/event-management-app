import { RecentEvent } from '@/services/admin.service'
import { Calendar } from 'lucide-react'

interface RecentEventsProps {
  events: RecentEvent[]
}

export function RecentEvents({ events }: RecentEventsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getColorForEvent = (index: number) => {
    const colors = [
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-blue-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
        >
          {/* Avatar con iniciales */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg ${getColorForEvent(
              index
            )} flex items-center justify-center text-white font-semibold text-sm`}
          >
            {getInitials(event.event_name)}
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {event.event_name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {event.institution_name || 'Sin institución'}
            </p>
          </div>

          {/* Fecha y estado */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(event.start_date)}
            </div>
            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
              Próximo
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
