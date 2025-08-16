'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MapPin, Calendar, Clock, Users, Star } from 'lucide-react'
import Image from 'next/image'
import PLACEHOLDER from '@/assets/images/bg-default.webp'

interface Event {
  id: number
  title: string
  description: string
  image?: string
  date: string
  time: string
  location: string
  price: string
  rating: number
  attendees: number
  category: string
  liked: boolean
}

interface EventCardProps {
  event: Event
  onLike: (eventId: number) => void
  viewMode?: 'grid' | 'list'
  primaryButtonLabel?: string
  secondaryButtonLabel?: string
  showLikeButton?: boolean
  showRating?: boolean
  showAttendees?: boolean
}

export function EventCard({
  event,
  onLike,
  viewMode = 'grid',
  primaryButtonLabel = 'Ver detalles',
  secondaryButtonLabel = 'Más info',
  showLikeButton = true,
  showRating = true,
  showAttendees = true
}: EventCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <Image
              src={event.image || PLACEHOLDER.src}
              alt={event.title}
              fill
              className="object-cover"
            />
            {showLikeButton && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                onClick={() => onLike(event.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    event.liked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </Button>
            )}
            <Badge className="absolute bottom-2 left-2 text-xs rounded-full">
              {event.category}
            </Badge>
          </div>

          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">
                {event.title}
              </h3>
              <span className="font-bold text-primary text-lg">
                {event.price}
              </span>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {event.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                {showRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{event.rating}</span>
                  </div>
                )}
                {showAttendees && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {/* <Button variant="outline" size="sm">
                  {secondaryButtonLabel}
                </Button> */}
                <Button className="w-full rounded-full">
                  {primaryButtonLabel}
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group py-0">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image || PLACEHOLDER.src}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showLikeButton && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 h-9 w-9 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
            onClick={() => onLike(event.id)}
          >
            <Heart
              className={`h-4 w-4 ${
                event.liked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        )}
        <Badge className="absolute top-3 left-3 text-xs rounded-full">
          {event.category}
        </Badge>
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
            {event.price}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {event.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          {showRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{event.rating}</span>
            </div>
          )}
          {showAttendees && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendees} asistentes</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            {secondaryButtonLabel}
          </Button> */}
          <Button
            className="w-full rounded-full
          bg-gray-200 group-hover:bg-primary
          text-gray-700 group-hover:text-white
          "
          >
            {primaryButtonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
