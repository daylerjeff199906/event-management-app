import { Button } from '@/components/ui/button'

const filters = [
  'Para ti',
  'Conciertos',
  'Deportes',
  'Teatro',
  'Conferencias',
  'Gastronomía',
  'Arte',
  'Otros'
]

export function QuickFilters() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Categorías populares</h2>
      <div className="flex flex-wrap gap-3">
        {filters.map((filter, index) => (
          <Button
            key={index}
            variant={index === 0 ? 'default' : 'outline'}
            className="rounded-full px-6"
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  )
}
