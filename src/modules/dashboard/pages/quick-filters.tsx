import { Button } from '@/components/ui/button'
import { Category } from '@/types'

interface QuickFiltersProps {
  categories: Category[]
}

export function QuickFilters({ categories }: QuickFiltersProps) {
  const filters = ['Para ti', ...categories.map((category) => category.name)]

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
