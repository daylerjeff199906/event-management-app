import { Button } from '@/components/ui/button'
import { StockHero } from '../components'
// import { Sparkles } from 'lucide-react'

export const HeroPage = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* <div className="w-full bg-orange-50 border border-orange-700 rounded-lg px-6 py-4 mb-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="font-medium text-base mb-1">
                Estás usando el plan
                <span className="text-orange-700 font-semibold"> Free </span>
              </h3>
              <p className="text-gray-500 text-sm">
                Actualiza para desbloquear funciones premium y obtener más
                recursos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button disabled size="sm">
              Actualizar plan
            </Button>
          </div>
        </div>
      </div> */}

      <StockHero
        title="Descubre eventos increíbles cerca de ti"
        subtitle="Explora una amplia variedad de eventos adaptados a tus intereses y ubicación."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <h3 className="text-2xl text-foreground">
          ¿Qué evento quieres descubrir hoy?
        </h3>
        <Button variant="outline" className="px-6 bg-transparent">
          Cómo buscar eventos
        </Button>
      </div>
    </div>
  )
}
