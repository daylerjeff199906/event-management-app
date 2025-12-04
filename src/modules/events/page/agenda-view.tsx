import React, { useMemo } from 'react'
import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { MapPin, Video, Clock } from 'lucide-react'
// Si tienes el tipo en @/types descomenta la línea siguiente y borra la interfaz inline
// import { EventActivity } from '@/types'

// --- 1. Definición de Tipos ---
export interface EventActivity {
  id: string
  event_id: string
  parent_activity_id?: string | null
  activity_name: string
  description?: string | null
  start_time: string // ISO timestamp
  end_time: string // ISO timestamp
  duration?: number | null
  meeting_url?: string | null
  custom_location?: string | null
  activity_mode?: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDO' | string | null
  status?: 'DRAFT' | 'PUBLIC' | 'DELETE' | string | null
  order_index?: number | null
  created_at?: string | null
  updated_at?: string | null
}

// --- 2. Utilidades (Helpers) ---

const formatDateHeader = (dateString: string) => {
  const date = parseISO(dateString)
  if (!isValid(date)) return 'Fecha inválida'
  // Ejemplo: "Sábado, 25 de Diciembre"
  const formatted = format(date, "EEEE, d 'de' MMMM", { locale: es })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const formatTime = (dateString: string) => {
  const date = parseISO(dateString)
  if (!isValid(date)) return '--:--'
  return format(date, 'HH:mm')
}

// --- 3. Sub-Componentes ---

/**
 * Badge para mostrar estado de proximidad de la fecha
 * Reglas:
 * - Pasado: "Ya pasó"
 * - Hoy: "Hoy"
 * - Mañana: "Mañana"
 * - <= 3 días: "Faltan X días"
 * - > 3 días: "Próximamente"
 */
const DateStatusBadge = ({ dateString }: { dateString: string }) => {
  const date = parseISO(dateString)
  if (!isValid(date)) return null

  const today = new Date()
  const diff = differenceInCalendarDays(date, today)

  // No render for past dates
  if (diff < 0) return null

  let label = ''
  let styleClass = ''

  if (diff === 0) {
    label = 'Hoy'
    styleClass =
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
  } else if (diff === 1) {
    label = 'Mañana'
    styleClass =
      'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
  } else if (diff <= 3) {
    label = `Faltan ${diff} días`
    styleClass =
      'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
  } else {
    label = 'Próximamente'
    styleClass =
      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
  }

  return (
    <span
      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${styleClass}`}
    >
      {label}
    </span>
  )
}

/**
 * StatusIndicator: Muestra si es borrador o público
 */
const StatusIndicator = ({ status }: { status?: string | null }) => {
  if (status === 'PUBLIC') return null

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-wide">
      {status || 'DRAFT'}
    </span>
  )
}

/**
 * AgendaItem: La tarjeta individual de la actividad
 */
interface AgendaItemProps {
  activity: EventActivity
}

const AgendaItem = ({ activity }: AgendaItemProps) => {
  const isVirtual =
    activity.activity_mode === 'VIRTUAL' || !!activity.meeting_url

  return (
    <div className="group relative flex gap-x-4 rounded-xl hover:bg-gray-50 p-4 transition-colors border border-transparent hover:border-gray-100 dark:hover:bg-gray-800 dark:border-gray-700">
      {/* Columna Izquierda: Hora */}
      <div className="flex-none w-16 pt-1 text-right">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {formatTime(activity.start_time)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(activity.end_time)}
        </p>
      </div>

      {/* Separador Visual (Línea de tiempo) */}
      <div className="relative hidden sm:block">
        <div className="absolute top-0 left-1/2 -ml-px h-full w-0.5 bg-gray-200 group-hover:bg-blue-200 transition-colors dark:bg-gray-700 dark:group-hover:bg-blue-900" />
        <div className="relative mt-2 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white group-hover:bg-blue-500 transition-colors dark:bg-gray-600 dark:ring-gray-900" />
      </div>

      {/* Columna Derecha: Contenido */}
      <div className="flex-auto py-0.5">
        <div className="flex items-center justify-between gap-x-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {activity.activity_name}
          </h3>
          <StatusIndicator status={activity.status} />
        </div>

        {activity.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
            {activity.description}
          </p>
        )}

        {/* Info adicional: Ubicación o Link */}
        <div className="mt-3 flex items-center gap-x-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
          {activity.custom_location && !isVirtual && (
            <div className="flex items-center gap-x-1">
              <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span>{activity.custom_location}</span>
            </div>
          )}

          {activity.meeting_url && (
            <div className="flex items-center gap-x-1">
              <Video className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <a
                href={activity.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline truncate max-w-[200px] dark:text-blue-400"
              >
                Unirse a la reunión
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * DayGroup: Contenedor para un día específico
 */
interface DayGroupProps {
  dateKey: string
  activities: EventActivity[]
}

const DayGroup = ({ dateKey, activities }: DayGroupProps) => {
  return (
    <div className="relative">
      <div className="sticky top-16 z-10  backdrop-blur px-4 py-3  mb-2 flex items-center justify-between sm:justify-start">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-100">
          {formatDateHeader(dateKey)}
        </h2>

        {/* Aquí insertamos la etiqueta de estado */}
        <DateStatusBadge dateString={dateKey} />
      </div>
      <div className="space-y-1 pb-8 px-2">
        {activities.map((activity) => (
          <AgendaItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}

// --- 4. Componente Principal ---

interface AgendaViewProps {
  activities: EventActivity[]
  emptyMessage?: string
}

export default function AgendaView({
  activities,
  emptyMessage = 'No hay actividades programadas.'
}: AgendaViewProps) {
  const groupedActivities = useMemo(() => {
    if (!activities || activities.length === 0) return {}

    // 1. Ordenar por fecha de inicio
    const sorted = [...activities].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )

    // 2. Agrupar
    const groups: Record<string, EventActivity[]> = {}

    sorted.forEach((activity) => {
      // Extraer YYYY-MM-DDT00:00:00 para la clave
      const dateKey = activity.start_time.split('T')[0] + 'T00:00:00'
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(activity)
    })

    return groups
  }, [activities])

  const groupKeys = Object.keys(groupedActivities)

  // Empty State
  if (groupKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">
        <Clock className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col fade-in">
      {groupKeys.map((dateKey) => (
        <DayGroup
          key={dateKey}
          dateKey={dateKey}
          activities={groupedActivities[dateKey]}
        />
      ))}
    </div>
  )
}
