'use client'
import { Search, Plus, User, Building, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ActionItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  enabled: boolean
  url?: string
}

const actions: ActionItem[] = [
  {
    icon: Search,
    title: 'Ver eventos',
    description: 'Explora todos los eventos disponibles',
    enabled: true,
    url: '/eventos'
  },
  {
    icon: Plus,
    title: 'Crear evento',
    description: 'Organiza y publica tu propio evento',
    enabled: false
  },
  {
    icon: User,
    title: 'Mis eventos',
    description: 'Gestiona tus eventos y reservas',
    enabled: false
  },
  {
    icon: Building,
    title: 'Instituciones',
    description: 'Descubre organizaciones y lugares',
    enabled: true,
    url: '/instituciones'
  },
  {
    icon: Settings,
    title: 'Configurar perfil',
    description: 'Personaliza tu cuenta y preferencias',
    enabled: true,
    url: '/perfil'
  }
]

interface ActionCardSectionProps {
  withInstitution?: boolean
}

export const ActionCardSection = ({
  withInstitution = false
}: ActionCardSectionProps) => {
  // Ajustar la lista según la prop withInstitution
  const adjustedActions = actions.map((action) =>
    action.title === 'Instituciones'
      ? { ...action, enabled: withInstitution }
      : action
  )

  const handleActionClick = (action: ActionItem) => {
    if (!action.enabled) {
      console.log(`${action.title} no está disponible aún`)
      return
    }

    if (action.url) {
      window.location.href = action.url
    }
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Bienvenido de nuevo! ¿Qué te gustaría hacer hoy?
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {adjustedActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={index}
              className={`p-6 transition-all cursor-pointer group ${
                action.enabled
                  ? 'hover:shadow-lg hover:scale-105'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => handleActionClick(action)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`p-3 rounded-full transition-colors ${
                    action.enabled
                      ? 'bg-muted group-hover:bg-primary group-hover:text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                  {!action.enabled && (
                    <span className="text-xs text-orange-500 font-medium mt-1 block">
                      Próximamente
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
