import { ChevronRight } from 'lucide-react'

// interface StockImage {
//   src: string
//   alt: string
// }

interface StockHeroProps {
  breadcrumb?: {
    home: string
    current: string
  }
  title: string
  subtitle: string
}

export function StockHero({
  breadcrumb,
  title = 'Contenido de stock gratuito y Premium para creadores',
  subtitle = 'Tu biblioteca completa de imágenes, vectores, ilustraciones, vídeos y más.'
}: StockHeroProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 border rounded-lg py-8 flex flex-col justify-center items-center md:py-12 lg:py-16">
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{breadcrumb.home}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {breadcrumb.current}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col justify-center max-w-lg mx-auto">
        {/* Left Images Gallery */}

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center lg:col-span-1">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
            {subtitle}
          </p>
        </div>

        {/* Right Images Gallery */}
      </div>
    </div>
  )
}
