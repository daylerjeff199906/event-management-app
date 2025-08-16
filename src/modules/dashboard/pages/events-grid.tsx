'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/modules/core/components'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { EventsFilters } from './events-filters'
import { Filter, Grid3X3, List } from 'lucide-react'

const mockEvents = [
  {
    id: 1,
    title: 'Festival de Música Electrónica',
    description:
      'Una noche épica con los mejores DJs internacionales en un ambiente único.',
    date: '15 Mar 2024',
    time: '20:00',
    location: 'Madrid, España',
    price: '€45',
    rating: 4.8,
    attendees: 1200,
    category: 'Música',
    liked: false
  },
  {
    id: 2,
    title: 'Conferencia de Tecnología 2024',
    description:
      'Descubre las últimas tendencias en IA, blockchain y desarrollo web.',
    date: '22 Mar 2024',
    time: '09:00',
    location: 'Barcelona, España',
    price: '€120',
    rating: 4.9,
    attendees: 500,
    category: 'Tecnología',
    liked: true
  },
  {
    id: 3,
    title: 'Exposición de Arte Contemporáneo',
    description:
      'Explora obras únicas de artistas emergentes en una experiencia inmersiva.',
    date: '18 Mar 2024',
    time: '10:00',
    location: 'Valencia, España',
    price: '€25',
    rating: 4.6,
    attendees: 300,
    category: 'Arte',
    liked: false
  },
  {
    id: 4,
    title: 'Torneo de Fútbol Amateur',
    description: 'Participa o disfruta del mejor fútbol amateur de la región.',
    date: '25 Mar 2024',
    time: '16:00',
    location: 'Sevilla, España',
    price: '€15',
    rating: 4.4,
    attendees: 800,
    category: 'Deportes',
    liked: true
  },
  {
    id: 5,
    title: 'Festival Gastronómico',
    description:
      'Degusta los mejores platos de chefs reconocidos internacionalmente.',
    date: '30 Mar 2024',
    time: '12:00',
    location: 'Bilbao, España',
    price: '€35',
    rating: 4.7,
    attendees: 600,
    category: 'Gastronomía',
    liked: false
  },
  {
    id: 6,
    title: 'Workshop de Fotografía',
    description:
      'Aprende técnicas avanzadas de fotografía con profesionales del sector.',
    date: '28 Mar 2024',
    time: '14:00',
    location: 'Granada, España',
    price: '€80',
    rating: 4.9,
    attendees: 50,
    category: 'Educación',
    liked: true
  }
]

export function EventsGrid() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [events, setEvents] = useState(mockEvents)

  const handleLike = (eventId: number) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, liked: !event.liked } : event
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">eventos</h1>
          <p className="text-muted-foreground">22.6k resultados</p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <EventsFilters />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onLike={handleLike}
            viewMode={viewMode}
            primaryButtonLabel="Comprar entradas"
            secondaryButtonLabel="Ver detalles"
          />
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <span className="px-2 text-muted-foreground">...</span>
          <Button variant="outline" size="sm">
            12
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
