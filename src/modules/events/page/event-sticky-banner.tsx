'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Heart, ShoppingCart } from 'lucide-react'
import { Event } from '@/types'
import { cn } from '@/lib/utils'

interface EventStickyBannerProps {
  // Event data props
  event?: Event

  // Display configuration
  showPrice?: boolean
  showLocation?: boolean
  showEndDate?: boolean
  showTime?: boolean

  // Badge configuration
  badgeText?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'

  // Button configuration
  actionText?: string
  actionType?: 'interest' | 'buy' | 'register' | 'custom'
  buttonColor?: string
  buttonHoverColor?: string
  onAction?: () => void
  actionUrl?: string

  // Styling props
  position?: 'top-16' | 'top-20' | 'top-24'
  cardClassName?: string
  containerClassName?: string

  // Date/time formatting
  dateFormat?: 'short' | 'long' | 'numeric'
  timeFormat?: '12h' | '24h'
  locale?: string
}

export default function EventStickyBanner({
  event,
  showLocation = true,
  showEndDate = false,
  showTime = true,
  actionText,
  actionType = 'interest',
  buttonColor = 'bg-orange-600',
  buttonHoverColor = 'hover:bg-orange-700',
  onAction,
  actionUrl,
  position = 'top-16',
  cardClassName = '',
  containerClassName = '',
  dateFormat = 'short',
  timeFormat = '12h',
  locale = 'es-ES'
}: EventStickyBannerProps) {
  // Format date function
  const formatDate = (
    date?: string | Date,
    format: 'short' | 'long' | 'numeric' = 'short'
  ) => {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    const options: Intl.DateTimeFormatOptions = {
      ...(format === 'short' && {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      ...(format === 'long' && {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      ...(format === 'numeric' && {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    return dateObj.toLocaleDateString(locale, options)
  }

  // Format time function
  const formatTime = (time?: string) => {
    if (!time) return ''

    const [hours, minutes] = time.split(':')
    const dateObj = new Date()
    dateObj.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12h'
    })
  }

  // Get default action text based on type
  const getActionText = () => {
    if (actionText) return actionText

    switch (actionType) {
      case 'interest':
        return 'Me interesa'
      case 'buy':
        return 'Comprar entrada'
      case 'register':
        return 'Registrarse'
      default:
        return 'Me interesa'
    }
  }

  // Get action icon
  const getActionIcon = () => {
    switch (actionType) {
      case 'interest':
        return <Heart className="h-4 w-4 mr-2" />
      case 'buy':
        return <ShoppingCart className="h-4 w-4 mr-2" />
      case 'register':
        return <Calendar className="h-4 w-4 mr-2" />
      default:
        return <Heart className="h-4 w-4 mr-2" />
    }
  }

  // Handle action click
  const handleAction = () => {
    if (onAction) {
      onAction()
    } else if (actionUrl) {
      window.open(actionUrl, '_blank')
    }
  }

  /**
   * Returns an object with { day: string, month: string } for a given date.
   * Example: { day: '10', month: 'DIC' }
   */
  const getShortDateParts = (date?: string | Date) => {
    if (!date) return { day: '', month: '' }
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const day = dateObj.getDate().toString()
    const month = dateObj
      .toLocaleString(locale, { month: 'short' })
      .toUpperCase()
    return { day, month }
  }

  return (
    <Card
      className={cn(
        'px-4 py-8 sticky shadow-none border-2 ',
        position,
        cardClassName,
        containerClassName
      )}
    >
      <div className="text-center space-y-4">
        {/* Price/Status Badge */}
        {/* <div className="flex justify-center">
            <Badge variant={badgeVariant} className="text-sm font-medium">
              {event?.price
                ? formatPrice(event.price, event.currency)
                : badgeText}
            </Badge>
          </div> */}

        {/* Event Details */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center border rounded-md border-muted-foreground/20 p-2 w-16  justify-center mb-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-center">
              {getShortDateParts(event?.start_date).day}
            </h2>
            <p>{getShortDateParts(event?.start_date).month}</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-muted-foreground mb-1 text-center">
              ¡Prepárate para una experiencia inolvidable!
              <span className="font-semibold">{event?.event_name}</span> te
              espera con actividades emocionantes y momentos especiales. ¡No te
              lo pierdas!
            </p>
          </div>
          {/* Date and Time */}
          {event && (
            <div className="flex  gap-2 text-sm text-muted-foreground w-full">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(event.start_date, dateFormat)}
                {showEndDate && event.end_date && (
                  <> - {formatDate(event.end_date, dateFormat)}</>
                )}
              </span>
            </div>
          )}

          {/* Time */}
          {showTime && event && (
            <div className="flex w-full gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(event.start_date)}</span>
            </div>
          )}

          {/* Location */}
          {showLocation && event?.location && (
            <div className="flex w-full gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[200px]">{event.location}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          className={`w-full ${buttonColor} ${buttonHoverColor} text-white font-medium transition-all duration-200 hover:shadow-md rounded-full`}
          onClick={handleAction}
          size="lg"
        >
          {getActionIcon()}
          {getActionText()}
        </Button>
      </div>
    </Card>
  )
}
