'use client'

import { useState } from 'react'
import {
  // Calendar,
  Clock,
  Globe,
  MapPin,
  Video,
  Share,
  Copy,
  Twitter,
  Facebook,
  // ChevronRight,
  Repeat,
  Heart
} from 'lucide-react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

// Asumiendo que estas importaciones existen en tu proyecto
import { EventItemDetails } from '@/types'
import { EventMode } from '../schemas'
import { APP_URL } from '@/data/config-app-url'
import EventStickyBanner from './event-sticky-banner'

interface EventDetailsPageProps {
  event: EventItemDetails
}

export function EventDetailsPage({ event }: EventDetailsPageProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  // --- Helpers de Formato ---
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

  // --- Lógica de Compartir ---
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
  }

  // --- Lógica de Imágenes ---
  const eventImages = [event.cover_image_url].filter(Boolean) as string[]

  // --- Lógica de Modo de Evento ---
  const getEventModeInfo = () => {
    switch (event.event_mode) {
      case EventMode.VIRTUAL:
        return { label: 'En línea', icon: Globe }
      case EventMode.PRESENCIAL:
        return { label: 'Presencial', icon: MapPin }
      case EventMode.HIBRIDO:
        return { label: 'Híbrido', icon: Video }
      default:
        return null
    }
  }
  const eventModeInfo = getEventModeInfo()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Banner Hero (Estilo Poster) */}
      <div className="relative w-full overflow-hidden border-y border-zinc-800">
        {/* Fondo con imagen y overlay oscuro */}
        <div className="absolute inset-0 z-0">
          {event.cover_image_url && (
            <>
              <div className="absolute inset-0 bg-zinc-950/80 z-10" />
              <img
                src={event.cover_image_url}
                alt="Background"
                className="w-full h-full object-cover blur-sm opacity-60 grayscale"
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
        </div>

        {/* Contenido del Banner */}
        <div className="relative z-20 container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
          {/* Etiquetas Superiores */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {event.is_recurring && (
              <Badge
                variant="secondary"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700 uppercase tracking-wider text-xs px-3 py-1"
              >
                <Repeat className="w-3 h-3 mr-1" /> Evento Recurrente
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-orange-400 border-orange-500/50 uppercase tracking-wider text-xs px-3 py-1"
            >
              {event.categorydata?.name || 'Evento'}
            </Badge>
          </div>

          {/* Título Masivo */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6 max-w-5xl leading-[0.9]">
            {event.event_name}
          </h1>

          {/* Fecha Principal */}
          <div className="text-lg md:text-2xl font-medium text-zinc-300 uppercase tracking-widest border-t border-b border-zinc-700 py-2 px-8">
            {formatDate(event.start_date)}
            {event.end_date && ` - ${formatDate(event.end_date)}`}
          </div>
        </div>
      </div>
      {/* 2. Breadcrumbs (Fuera del banner para navegación limpia) */}
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Breadcrumb>
          <BreadcrumbList className="text-zinc-400">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={APP_URL.DASHBOARD.BASE}
                className="hover:text-white transition-colors"
              >
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-zinc-600" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={APP_URL.DASHBOARD.EVENTS.BASE}
                className="hover:text-white transition-colors"
              >
                Eventos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-zinc-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">
                {event.event_name.length > 30
                  ? event.event_name.substring(0, 30) + '...'
                  : event.event_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 3. Contenido Principal (Estilo Grilla Oscura) */}
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Columna Izquierda: Metadatos (Sticky opcional) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6 lg:sticky lg:top-8">
              {/* Bloque: Hora */}
              <div className="group">
                <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-2 group-hover:text-orange-500 transition-colors">
                  Empieza
                </h3>
                <div className="flex items-center gap-3 text-white text-lg font-medium">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <span>
                    {event?.time ? formatTime(event?.time) : 'No indicado'}
                  </span>
                </div>
                {event.duration && (
                  <p className="text-zinc-500 text-sm mt-1 ml-8">
                    {event.duration} minutos
                  </p>
                )}
                <Separator className="mt-4 bg-zinc-800" />
              </div>

              {/* Bloque: Ubicación */}
              <div className="group">
                <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-2 group-hover:text-orange-500 transition-colors">
                  Dónde
                </h3>
                <div className="space-y-2">
                  {eventModeInfo && (
                    <div className="flex items-center gap-3 text-white text-lg">
                      <eventModeInfo.icon className="w-5 h-5 text-zinc-400" />
                      <span>{eventModeInfo.label}</span>
                    </div>
                  )}

                  {(event.custom_location || event.meeting_url) && (
                    <div className="ml-8 text-zinc-300">
                      {event.custom_location && <p>{event.custom_location}</p>}
                      {event.meeting_url && (
                        <a
                          href={event.meeting_url}
                          target="_blank"
                          className="text-orange-400 hover:text-orange-300 underline text-sm block mt-1"
                        >
                          Link de acceso
                        </a>
                      )}
                    </div>
                  )}
                  {/* Fallback */}
                  {!event.custom_location &&
                    !event.meeting_url &&
                    !eventModeInfo && (
                      <p className="text-zinc-400">Ubicación por definir</p>
                    )}
                </div>
                <Separator className="mt-4 bg-zinc-800" />
              </div>

              {/* Bloque: Precio / Acción */}
              <div className="group">
                <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-2 group-hover:text-orange-500 transition-colors">
                  Acceso
                </h3>
                <p className="text-2xl font-bold text-white mb-4">Gratis</p>

                {/* Aquí integramos el Sticky Banner visualmente si se desea, o un botón directo */}
                <div className="w-full">
                  <EventStickyBanner
                    event={event}
                    badgeText="Gratuito"
                    actionType="interest"
                    showEndDate={false}
                    showTime={false}
                    showLocation={false}
                    cardClassName="w-full bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <Separator className="mt-4 bg-zinc-800" />
              </div>

              {/* Bloque: Compartir */}
              <div className="relative">
                <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-3">
                  Compartir
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-orange-400"
                    onClick={handleShare}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Menú Dropdown de compartir personalizado */}
                {showShareOptions && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-48 rounded-md border border-zinc-700 bg-zinc-900 shadow-xl">
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800 h-9 px-2"
                        onClick={copyToClipboard}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copiar Link
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800 h-9 px-2"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              event.event_name
                            )}&url=${encodeURIComponent(window.location.href)}`,
                            '_blank'
                          )
                        }
                      >
                        <Twitter className="mr-2 h-4 w-4" /> Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800 h-9 px-2"
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href
                            )}`,
                            '_blank'
                          )
                        }
                      >
                        <Facebook className="mr-2 h-4 w-4" /> Facebook
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Narrativa e Imágenes */}
          <div className="lg:col-span-8 space-y-12">
            {/* Descripción del evento */}
            <div className="prose prose-invert prose-lg max-w-none">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-6 border-l-4 border-orange-500 pl-4">
                Sobre este evento
              </h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {event.description ||
                  'No hay descripción disponible para este evento. Únete para descubrir más detalles directamente con el organizador.'}
              </p>
            </div>

            {/* Galería de Imágenes (Funcionalidad Preservada) */}
            {eventImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4 flex items-center gap-2">
                  Galería{' '}
                  <span className="text-xs font-normal text-zinc-500 bg-zinc-900 border border-zinc-700 px-2 py-1 rounded-full">
                    {eventImages.length} fotos
                  </span>
                </h3>

                <PhotoProvider>
                  <div
                    className={`grid gap-4 ${
                      eventImages.length === 1
                        ? 'grid-cols-1'
                        : 'grid-cols-1 md:grid-cols-2'
                    }`}
                  >
                    {eventImages.map((image, index) => (
                      <PhotoView key={index} src={image}>
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

            {/* Sección Organizado Por */}
            <div className="pt-12 border-t border-zinc-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">
                Presentado por
              </h3>
              <div className="flex items-center gap-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
                <Avatar className="w-20 h-20 border-2 border-zinc-700">
                  <AvatarImage
                    src={
                      event.institution?.brand ||
                      event.author?.profile_image ||
                      ''
                    }
                  />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl font-bold">
                    {
                      (event.institution?.institution_name ||
                        event.author?.first_name ||
                        'A')[0]
                    }
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-1">
                    {event.institution?.institution_name ||
                      `${event.author?.first_name} ${event.author?.last_name}`}
                  </h4>
                  <p className="text-zinc-400 text-sm mb-4">
                    Organizador oficial del evento
                  </p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      Contactar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white border-none"
                    >
                      Seguir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Call to Action similiar a la imagen "JOIN THE A-LIST" */}
      <div className="bg-orange-500 text-black py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
              No te pierdas nada
            </h2>
            <p className="font-medium max-w-md">
              Suscríbete y sé el primero en enterarte de nuevos eventos como
              este. Recibe actualizaciones y noticias.
            </p>
          </div>
          <Button
            disabled
            className="bg-black text-white hover:bg-zinc-800 px-8 py-6 text-lg font-bold uppercase tracking-wider rounded-none"
          >
            Registrarse Ahora
          </Button>
        </div>
      </div>
    </div>
  )
}
