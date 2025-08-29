'use client'

import type React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  backgroundImage: string
  buttonAction?: () => void
}

interface MusicCarouselProps {
  slides?: CarouselSlide[]
  className?: string
  deviceType?: string
}

const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'PARTICIPA EN LA NOCHE',
    subtitle: 'DESCUBRE EVENTOS CULTURALES Y ACTIVIDADES NOCTURNAS',
    buttonText: 'Descubre qué hacer esta noche',
    backgroundImage: SLIDER_BANNER_1.src
  },
  {
    id: '2',
    title: 'EXPLORA LA CULTURA',
    subtitle: 'CONFERENCIAS RELEVANTES Y EXPERIENCIAS ÚNICAS',
    buttonText: 'Participa en conferencias',
    backgroundImage: SLIDER_BANNER_2.src
  },
  {
    id: '3',
    title: 'VIVE LA DIVERSIÓN',
    subtitle: 'EVENTOS CULTURALES Y NOCHES INOLVIDABLES',
    buttonText: 'Descubre eventos culturales',
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
  deviceType
}: MusicCarouselProps) => {
  return (
    <div className={cn('w-full', className)}>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={deviceType !== 'mobile'}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={['tablet', 'mobile']}
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl"
            style={{
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-16 lg:px-20">
              <div className="max-w-2xl">
                <div className="inline-block bg-purple-200 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {slide.title}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-blue-500 px-2 py-1 inline-block mb-2">
                    {slide.subtitle.split('TO')[0] || ''}
                  </span>
                  <br />
                  <span className="bg-pink-400 px-2 py-1 inline-block">
                    {slide.subtitle.split('TO')[1]
                      ? 'TO' + slide.subtitle.split('TO')[1]
                      : ''}
                  </span>
                </h1>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-medium"
                  onClick={slide.buttonAction}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
