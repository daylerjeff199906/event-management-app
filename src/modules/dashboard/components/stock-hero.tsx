'use client'

import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StockHeroProps {
  breadcrumb?: {
    home: string
    current: string
  }
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  title: string
  highlightWord?: string
  highlightColor?: string
  subtitle: string
  buttonText?: string
  buttonHref?: string
  backgroundColor?: string
  isDark?: boolean
  backgroundImageUrl?: string
}

export function StockHero({
  breadcrumb,
  badge,
  title = 'Contenido de stock gratuito y Premium para creadores',
  highlightWord,
  highlightColor = 'text-orange-500',
  subtitle = 'Tu biblioteca completa de imágenes, vectores, ilustraciones, vídeos y más.',
  buttonText = 'Comenzar',
  buttonHref,
  backgroundColor = 'bg-background',
  backgroundImageUrl,
  isDark = false
}: StockHeroProps) {
  const renderTitle = () => {
    if (!highlightWord) return title

    const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={index} className={highlightColor}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    )
  }

  return (
    <div
      className={`${backgroundColor} relative px-4 sm:px-6 lg:px-8 border rounded-lg py-8 flex flex-col justify-center items-center md:py-12 lg:py-16 transition-colors duration-300`}
    >
      {/* Background image (behind content) */}
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Dark overlay with soft transparency */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      )}

      {/* All visible content stays above the image + overlay */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div
            className={`mb-8 flex items-center gap-2 text-sm ${
              isDark ? 'text-gray-400' : 'text-muted-foreground'
            }`}
          >
            <span>{breadcrumb.home}</span>
            <ChevronRight className="h-4 w-4" />
            <span
              className={`font-medium ${
                isDark ? 'text-white' : 'text-foreground'
              }`}
            >
              {breadcrumb.current}
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500"></span>
            <span className="text-sm font-medium text-orange-700">
              {badge.text}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col justify-center max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h1
              className={`mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-5xl ${
                isDark ? 'text-white' : 'text-foreground'
              }`}
            >
              {renderTitle()}
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-muted-foreground'
              }`}
            >
              {subtitle}
            </p>

            {/* Button */}
            {buttonText && (
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold"
                variant={isDark ? 'default' : 'outline'}
                asChild
              >
                <Link href={buttonHref || '#'}>{buttonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
