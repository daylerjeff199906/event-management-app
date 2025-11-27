import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_URL } from '@/data/config-app-url'
import { Category } from '@/types'
import { Plus } from 'lucide-react'
import { CategoriesTable } from './categories-table'

type CategoriesPageProps = {
  categories: Category[]
}

export function CategoriesPage({ categories }: CategoriesPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Categorias
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorias que usas para clasificar eventos.
          </p>
        </div>
        <Button asChild>
          <Link href={APP_URL.ADMIN.CATEGORIES.ADD_CATEGORY} className="no-underline">
            <Plus className="mr-2 h-4 w-4" />
            Nueva categoria
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
