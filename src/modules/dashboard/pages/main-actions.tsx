import { Search, Calendar, MapPin, Users, Clock, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'

const actions = [
  {
    icon: Search,
    title: 'Buscar eventos',
    description: 'Encuentra eventos por nombre o categoría'
  },
  {
    icon: Calendar,
    title: 'Por fecha',
    description: 'Eventos de hoy, mañana o esta semana'
  },
  {
    icon: MapPin,
    title: 'Cerca de ti',
    description: 'Eventos en tu ubicación actual'
  },
  {
    icon: Users,
    title: 'Eventos sociales',
    description: 'Conecta con personas afines'
  },
  {
    icon: Clock,
    title: 'Eventos en vivo',
    description: 'Eventos que están sucediendo ahora'
  },
  {
    icon: Star,
    title: 'Recomendados',
    description: 'Eventos seleccionados para ti'
  }
]

export function MainActions() {
  return (
    <>
      <h2 className="text-lg mb-4">
        Explora las principales acciones para descubrir eventos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
