import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Globe,
  Heart,
  Share,
  Flag,
  Clock1
} from 'lucide-react'
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

interface EventDetailsPageProps {
  event: EventItemDetails
}

export function EventDetailsPage({ event }: EventDetailsPageProps) {
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
      <div className="w-full max-w-6xl mx-auto px-4 pt-4">
        {/* Hero Image */}
        <div className="relative w-full h-80 mb-6 rounded-2xl overflow-hidden">
          <img
            src={
              event?.cover_image_url ||
              '/placeholder.svg?height=320&width=800&query=tech career fair event'
            }
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">
                {event?.categorydata?.name || 'Evento'}
              </h1>
              <h2 className="text-6xl font-bold">{event.event_name}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 w-full grid grid-cols-1 gap-8">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <p className="text-muted-foreground mb-2">
              {formatDate(event.start_date)}
            </p>
            <h1 className="text-3xl font-bold text-balance mb-4">
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Por</span>
                <span className="font-medium">
                  {event.author?.first_name} {event.author?.last_name}
                </span>
                <Button variant="outline" size="sm">
                  Seguir
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Event Info Card */}
        {/* <Card className="p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <Badge variant="secondary" className="mb-2">
                Gratuito
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.start_date)} · {formatTime(event.start_date)}
              </p>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Obtener entradas
            </Button>
          </div>
        </Card> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date and Time */}
            <section className="flex flex-col gap-4">
              <h2 className="font-semibold mb-4 tracking-wider">
                Fecha y hora
              </h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span>
                  {formatDate(event.start_date)}
                  {event.end_date ? ` - ${formatTime(event.end_date)}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock1 className="w-5 h-5" />
                <span>
                  {event?.time ? formatTime(event?.time) : 'No indicado'}
                  {event?.duration ? ` · ${event.duration}` : ''}
                </span>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="font-semibold mb-4 tracking-wider">Ubicación</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="w-5 h-5" />
                <span>En línea</span>
              </div>
            </section>

            {/* Good to Know */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Bueno saber</h2>
              <div className="space-y-3">
                <h3 className="font-semibold mb-4 tracking-wider">
                  Destacados
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>3 horas</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>En línea</span>
                  </div>
                </div>
              </div>
            </section>

            {/* About Event */}
            <section>
              <h2 className="font-semibold mb-4 tracking-wider">Categoría</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
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
          <div className="">
            <EventStickyBanner
              event={event}
              badgeText="Gratuito"
              actionType="interest"
              showEndDate={true}
              showTime={true}
              showLocation={true}
              cardClassName="w-full min-w-[340px]"
            />
          </div>
        </div>

        {/* Organized By */}
        <section className="mt-12 w-full">
          <h2 className="text-xl font-semibold mb-6">Organizado por</h2>
          <Card className="p-6 w-full minm">
            <div className="flex items-center justify-between gap-4 w-full">
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
                  <h3 className="font-semibold">
                    {event.institution != null
                      ? event.institution.institution_name
                      : `${event.user?.first_name ?? ''} ${
                          event.user?.last_name ?? ''
                        }`}
                  </h3>
                  <div className="flex gap-6 text-xs text-muted-foreground mt-1">
                    Autor de la publicación: {event.user?.first_name}{' '}
                    {event.user?.last_name}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Contacto</Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Seguir
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Report Event */}
        <div className="flex justify-center mt-8">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            <Flag className="w-4 h-4 mr-2" />
            Reportar este evento
          </Button>
        </div>

        {/* More Events */}
        {/* <section className="mt-12">
          <h2 className="text-xl font-semibold mb-6">
            Más eventos de este organizador
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <img
                    src="/job-alert-event.jpg"
                    alt="Event"
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      Career Fair: Exclusive Tech Hiring Event
                    </h3>
                    <p className="text-sm text-orange-600 mb-1">
                      Vie, Sep 26, 9:00 AM
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Movido a Evento Virtual • San Francisco, CA
                    </p>
                    <p className="text-sm text-muted-foreground">Gratuito</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Tech Career Fair</span>
                      <span>62.6k seguidores</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  )
}
