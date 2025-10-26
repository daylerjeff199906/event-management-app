'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface InstitutionsBannerProps {
  title?: string
  description?: string
  buttonText?: string
  redirectUrl: string
  hiddenButton?: boolean
}

export function InstitutionsBanner({
  title = 'Tienes instituciones asignadas',
  description = 'Ir a gestionar Instituciones y optimizar tu experiencia',
  buttonText = 'Gestionar Instituciones',
  redirectUrl,
  hiddenButton = false
}: InstitutionsBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-400 px-6 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16">
      {/* Decorative shapes */}
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-cyan-300 opacity-60 sm:h-32 sm:w-32" />
      <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-yellow-300 opacity-70 sm:h-28 sm:w-28" />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pink-300 opacity-40 sm:h-40 sm:w-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base md:mt-4 md:max-w-md">
            {description}
          </p>
        </div>

        {/* Button */}
        {!hiddenButton && (
          <Link href={redirectUrl} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-full bg-white px-6 py-2 lg:py-3 cursor-pointer text-base font-semibold text-red-500 hover:bg-white/90 sm:w-auto sm:px-8 sm:py-3"
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
