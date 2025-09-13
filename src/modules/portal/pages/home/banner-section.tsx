'use client'

import type React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Calendar, Star, Users } from 'lucide-react'

import {
  SLIDER_BANNER_1,
  SLIDER_BANNER_2,
  SLIDER_BANNER_3
} from '@/assets/images'

interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  secondaryButtonText?: string
  backgroundImage: string
  buttonAction?: () => void
  secondaryButtonAction?: () => void
}

interface MusicCarouselProps {
  slides?: CarouselSlide[]
  className?: string
  deviceType?: string
  onSignUp?: () => void
  onLogin?: () => void
}

const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'PARTICIPA EN LA NOCHE',
    subtitle: 'Descubre eventos culturales y actividades nocturnas exclusivas',
    buttonText: 'Crear cuenta gratis',
    secondaryButtonText: 'Ver eventos',
    backgroundImage: SLIDER_BANNER_1.src
  },
  {
    id: '2',
    title: 'EXPLORA LA CULTURA',
    subtitle:
      'Encuentra conferencias relevantes y experiencias únicas cerca de ti',
    buttonText: 'Registrarse ahora',
    secondaryButtonText: 'Explorar sin cuenta',
    backgroundImage: SLIDER_BANNER_2.src
  },
  {
    id: '3',
    title: 'VIVE LA DIVERSIÓN',
    subtitle: 'Eventos culturales y noches inolvidables te esperan',
    buttonText: 'Unirse a la comunidad',
    secondaryButtonText: 'Más información',
    backgroundImage: SLIDER_BANNER_3.src
  }
]

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

export const BannerCarousel = ({
  slides = defaultSlides,
  className,
  deviceType,
  onSignUp,
  onLogin
}: MusicCarouselProps) => {
  return (
    <div className={cn('w-full rounded-2xl', className)}>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={deviceType !== 'mobile'}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        customTransition="all .7"
        transitionDuration={700}
        containerClass="carousel-container rounded-2xl"
        removeArrowOnDeviceType={['tablet', 'mobile']}
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl"
            style={{
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 rounded-2xl" />

            <div className="relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-12 lg:px-24">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center space-x-2  text-white px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>{slide.title}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {slide.subtitle}
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    size="lg"
                    className=" rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105"
                    onClick={onSignUp || slide.buttonAction}
                  >
                    {slide.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {slide.secondaryButtonText && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white rounded-full px-8 py-6 text-base font-medium"
                      onClick={onLogin || slide.secondaryButtonAction}
                    >
                      {slide.secondaryButtonText}
                    </Button>
                  )}
                </div>

                {/* Beneficios destacados */}
                <div className="flex flex-wrap gap-6 mt-10">
                  <div className="flex items-center text-white/90">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-sm">Comunidad activa</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="text-sm">Eventos exclusivos</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      Recomendaciones personalizadas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
