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

// --- Tipos ---
export interface AdBanner {
  id: string
  imageUrl: string
  linkUrl: string
  title?: string
  description?: string
  tag?: string
  startDate?: string // ISO string
  endDate?: string // ISO string
  isActive: boolean // Flag manual para desactivar sin borrar fechas
}

interface EventBannerCarouselProps {
  banners: AdBanner[]
  autoPlayDelay?: number // milisegundos
}

export function EventBannerCarousel({
  banners,
  autoPlayDelay = 5000
}: EventBannerCarouselProps) {
  // 1. Filtrar banners activos y dentro del rango de fechas
  const activeBanners = React.useMemo(() => {
    const now = new Date()
    return banners.filter((banner) => {
      if (!banner.isActive) return false

      // Si tiene fechas, validar rango
      if (banner.startDate && banner.endDate) {
        return isWithinInterval(now, {
          start: parseISO(banner.startDate),
          end: parseISO(banner.endDate)
        })
      }

      // Si no tiene fechas pero está activo, se muestra (banner permanente)
      return true
    })
  }, [banners])

  // Si no hay banners para mostrar, no renderizamos nada (o podrías retornar un null)
  if (activeBanners.length === 0) return null

  return (
    <div className="w-full py-6">
      <Carousel
        plugins={[
          Autoplay({
            delay: autoPlayDelay
          })
        ]}
        className="w-full relative group"
        opts={{
          loop: true
        }}
      >
        <CarouselContent>
          {activeBanners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Link
                href={banner.linkUrl}
                className="block relative overflow-hidden rounded-2xl cursor-pointer"
              >
                {/* Contenedor de Aspect Ratio: 
                    h-[300px] en móvil para que se vea bien la info
                    h-[400px] o [500px] en desktop para panorámica */}
                <div className="relative h-[350px] md:h-[450px] w-full">
                  {/* Imagen de Fondo */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner publicitario'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Overlay Gradiente: Crucial para leer texto sobre imágenes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                  {/* Contenido del Banner */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start gap-3">
                    {/* Tag / Etiqueta */}
                    {banner.tag && (
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-black hover:bg-white font-bold px-3 py-1 text-xs uppercase tracking-wide mb-1"
                      >
                        {banner.tag}
                      </Badge>
                    )}

                    {/* Título */}
                    {banner.title && (
                      <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl drop-shadow-sm">
                        {banner.title}
                      </h2>
                    )}

                    {/* Descripción */}
                    {banner.description && (
                      <p className="text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-none">
                        {banner.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controles de Navegación (Opcionales, aparecen al hover) */}
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm" />
          <CarouselNext className="right-4 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm" />
        </div>
      </Carousel>
    </div>
  )
}
