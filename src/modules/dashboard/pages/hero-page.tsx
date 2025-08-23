import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export const HeroPage = () => {
  return (
    <div>
      <div className="w-full bg-orange-50 border border-orange-700 rounded-lg px-6 py-4 mb-6 relative">
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
              <p className="text-slate-400 text-sm">
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
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-foreground">
          ¿Qué evento quieres descubrir hoy?
        </h1>
        <Button variant="outline" className="px-6 bg-transparent">
          Cómo buscar eventos
        </Button>
      </div>
    </div>
  )
}
