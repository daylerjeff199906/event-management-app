'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Globe, Heart, Share, Clock1 } from 'lucide-react'
import { EventItemDetails } from '@/types'
import EventStickyBanner from './event-sticky-banner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { APP_URL } from '@/data/config-app-url'
import { useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface EventDetailsPageProps {
  event: EventItemDetails
}

export function EventDetailsPage({ event }: EventDetailsPageProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.event_name,
          text: event.description || 'Descubre este evento interesante',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error al compartir:', error)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareOptions(false)
    // Aquí podrías añadir un toast de confirmación
  }

  // Simulación de múltiples imágenes (en un caso real vendrían del evento)
  const eventImages = [
    event.cover_image_url
    // ... otras imágenes del evento
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={APP_URL.DASHBOARD.BASE}>
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={APP_URL.DASHBOARD.EVENTS.BASE}>
                Eventos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {event.event_name.length > 30
                  ? event.event_name.substring(0, 30) + '...'
                  : event.event_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 w-full grid grid-cols-1 gap-8">
        {/* Event Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1 w-full">
            <p className="text-muted-foreground mb-2">
              {formatDate(event.start_date)}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-balance mb-4">
              {event.event_name}
            </h1>

            {/* Organizer Info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-10 h-10">
                <AvatarImage src={event.author?.profile_image || ''} />
                <AvatarFallback className="bg-pink-200">
                  {event.author?.first_name?.[0]}
                  {event.author?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-muted-foreground">Por</span>
                <span className="font-medium">
                  {event.author?.first_name} {event.author?.last_name}
                </span>
                <Button variant="outline" size="sm" className="w-fit">
                  Seguir
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            {eventImages.length > 0 && (
              <div className="mb-6">
                <PhotoProvider>
                  <div
                    className={`grid gap-2 ${
                      eventImages.length === 1
                        ? 'grid-cols-1'
                        : eventImages.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-1 md:grid-cols-2'
                    }`}
                  >
                    {eventImages.map((image, index) => (
                      <PhotoView key={index} src={image!}>
                        <div
                          className={`relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 ${
                            eventImages.length === 1
                              ? 'h-[400px]'
                              : eventImages.length === 2
                              ? 'h-[300px]'
                              : index === 0
                              ? 'h-[400px]'
                              : 'h-[200px]'
                          }`}
                        >
                          <div className="w-full h-full flex items-center justify-center p-2">
                            <img
                              src={image!}
                              alt={`${event.event_name} - Imagen ${index + 1}`}
                              className="max-w-full max-h-full object-cover transition-transform hover:scale-105 rounded-md"
                            />
                          </div>

                          {eventImages.length > 1 &&
                            index === 0 &&
                            eventImages.length > 2 && (
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  +{eventImages.length - 1} imágenes
                                </span>
                              </div>
                            )}
                        </div>
                      </PhotoView>
                    ))}
                  </div>
                </PhotoProvider>
              </div>
            )}

            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-col items-center gap-2 self-end lg:self-start">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Heart className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={handleShare}
              >
                <Share className="w-5 h-5" />
              </Button>

              {showShareOptions && (
                <Card className="absolute right-0 top-12 z-10 w-48 p-2 shadow-lg">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={copyToClipboard}
                    >
                      Copiar enlace
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            event.event_name
                          )}&url=${encodeURIComponent(window.location.href)}`,
                          '_blank'
                        )
                        setShowShareOptions(false)
                      }}
                    >
                      Compartir en Twitter
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`,
                          '_blank'
                        )
                        setShowShareOptions(false)
                      }}
                    >
                      Compartir en Facebook
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date and Time */}
            <section className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg mb-2">Fecha y hora</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="break-words">
                  {formatDate(event.start_date)}
                  {event.end_date ? ` - ${formatTime(event.end_date)}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock1 className="w-5 h-5 flex-shrink-0" />
                <span className="break-words">
                  {event?.time ? formatTime(event?.time) : 'No indicado'}
                  {event?.duration ? ` · ${event.duration}` : ''}
                </span>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="font-semibold text-lg mb-4">Ubicación</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="w-5 h-5 flex-shrink-0" />
                <span>En línea</span>
              </div>
            </section>

            {/* Good to Know */}
            <section>
              <h2 className="font-semibold text-lg mb-4">Bueno saber</h2>
              <div className="space-y-3">
                <h3 className="font-medium mb-3">Destacados</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>3 horas</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span>En línea</span>
                  </div>
                </div>
              </div>
            </section>

            {/* About Event */}
            <section>
              <h2 className="font-semibold text-lg mb-4">Categoría</h2>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                  >
                    {event.categorydata?.name || 'Sin categoría'}
                  </Badge>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <EventStickyBanner
              event={event}
              badgeText="Gratuito"
              actionType="interest"
              showEndDate={true}
              showTime={true}
              showLocation={true}
              cardClassName="w-full"
            />
          </div>
        </div>

        {/* Organized By */}
        <section className="mt-12 w-full">
          <h2 className="text-xl font-semibold mb-6">Organizado por</h2>
          <Card className="p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={
                      event.institution != null
                        ? event.institution.brand || ''
                        : event.user?.profile_image || ''
                    }
                  />
                  <AvatarFallback className="bg-pink-200 text-lg">
                    {event.user != null
                      ? `${event.user.first_name?.[0] ?? ''}${
                          event.user.last_name?.[0] ?? ''
                        }`
                      : event.institution?.institution_name?.[0] ?? ''}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {event.institution != null
                      ? event.institution.institution_name
                      : `${event.user?.first_name ?? ''} ${
                          event.user?.last_name ?? ''
                        }`}
                  </h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    Autor de la publicación: {event.user?.first_name}{' '}
                    {event.user?.last_name}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Contacto
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-none"
                  size="sm"
                >
                  Seguir
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
