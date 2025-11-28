'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import Autoplay from 'embla-carousel-autoplay'
import { isWithinInterval, parseISO } from 'date-fns'
import { CalendarSearch } from 'lucide-react' // Icono para el default

// --- Tipos ---
export interface AdBanner {
  id: string
  imageUrl: string
  linkUrl: string // Puede ser un ancla, ej: "#lista-eventos"
  title?: string
  description?: string
  tag?: string
  startDate?: string
  endDate?: string
  isActive: boolean
}

interface EventBannerCarouselProps {
  banners: AdBanner[]
  autoPlayDelay?: number
}

// --- CONFIGURACIÓN DEL BANNER POR DEFECTO ---
const DEFAULT_BANNER: AdBanner = {
  id: 'default-hero',
  // Una imagen genérica bonita de eventos/tecnología/comunidad
  imageUrl:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop',
  title: 'Explora nuestros eventos',
  description:
    'Descubre las conferencias, talleres y actividades que tenemos disponibles para ti hoy.',
  tag: 'Bienvenido',
  linkUrl: '#event-list', // ESTO ES CLAVE: Un ID que pondrás en tu lista de cartas
  isActive: true
}

export function EventBannerCarousel({
  banners,
  autoPlayDelay = 5000
}: EventBannerCarouselProps) {
  // 1. Lógica de filtrado de banners reales
  const activeBanners = React.useMemo(() => {
    const now = new Date()
    return banners.filter((banner) => {
      if (!banner.isActive) return false

      if (banner.startDate && banner.endDate) {
        return isWithinInterval(now, {
          start: parseISO(banner.startDate),
          end: parseISO(banner.endDate)
        })
      }
      return true
    })
  }, [banners])

  // 2. DECISIÓN: ¿Usamos los banners reales o el default?
  const displayBanners =
    activeBanners.length > 0 ? activeBanners : [DEFAULT_BANNER]

  // Si es el banner por defecto, quizás no queremos Autoplay (opcional),
  // pero lo dejaré activo por consistencia si decides poner más de un default.
  const plugin = React.useRef(
    Autoplay({ delay: autoPlayDelay, stopOnInteraction: true })
  )

  return (
    <div className="w-full py-6">
      <Carousel
        plugins={[plugin.current]}
        className="w-full relative group"
        opts={{
          loop: true
        }}
        // Deshabilitar el arrastre si solo hay 1 slide (el default)
        setApi={(api) => {
          if (api && displayBanners.length === 1) {
            api.reInit({ watchDrag: false })
          }
        }}
      >
        <CarouselContent>
          {displayBanners.map((banner) => (
            <CarouselItem key={banner.id}>
              {/* Usamos <a> normal si es un ancla (#), o Link de next si es ruta interna */}
              <Link
                href={banner.linkUrl}
                className={`block relative overflow-hidden rounded-2xl ${
                  displayBanners.length > 1
                    ? 'cursor-grab active:cursor-grabbing'
                    : 'cursor-default'
                }`}
                // Prevenir comportamiento default del link si solo estamos scrolleando
                onClick={(e) => {
                  if (banner.linkUrl.startsWith('#')) {
                    e.preventDefault()
                    const element = document.getElementById(
                      banner.linkUrl.substring(1)
                    )
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full">
                  {/* Imagen de Fondo con efecto Parallax sutil o Zoom */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Eventos'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90" />

                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-start gap-3 md:gap-4 container mx-auto">
                    {banner.tag && (
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-xs uppercase tracking-wide mb-1 border-none rounded-full">
                        {banner.tag}
                      </Badge>
                    )}

                    {banner.title && (
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-tight drop-shadow-md">
                        {banner.title}
                      </h2>
                    )}

                    {banner.description && (
                      <div className="flex items-center gap-2">
                       
                        <p className="text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-none font-medium">
                          {banner.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Solo mostrar flechas si hay más de 1 banner */}
        {displayBanners.length > 1 && (
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CarouselPrevious className="left-4 bg-black/20 hover:bg-black/50 text-white border-white/20 backdrop-blur-sm h-12 w-12" />
            <CarouselNext className="right-4 bg-black/20 hover:bg-black/50 text-white border-white/20 backdrop-blur-sm h-12 w-12" />
          </div>
        )}
      </Carousel>
    </div>
  )
}
