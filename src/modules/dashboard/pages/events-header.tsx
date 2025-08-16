import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Filter, ArrowUpDown } from 'lucide-react'

export function EventsHeader() {
  const categories = [
    { name: 'Todos Los Eventos', active: true },
    { name: 'Conciertos', active: false },
    { name: 'Conferencias', active: false },
    { name: 'Deportes', active: false },
    { name: 'Gastronomía', active: false },
    { name: 'Arte', active: false },
    { name: 'Tecnología', active: false },
    { name: 'Más', active: false }
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${
                  category.active
                    ? 'text-primary border-b-2 border-primary pb-2'
                    : 'text-muted-foreground pb-2'
                }`}
              >
                {category.name}
                {category.name === 'Más' && (
                  <ChevronDown className="ml-1 h-4 w-4 inline" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordenar por: Más relevantes
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </nav>

        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">📍</span>
            Ubicación
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">📅</span>
            Fecha
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">💰</span>
            Precio
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">👥</span>
            Capacidad
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">🎯</span>
            Categoría
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-2">⭐</span>
            Valoración
            <ChevronDown className="h-3 w-3 ml-2" />
          </Badge>
        </div>
      </div>
    </header>
  )
}
