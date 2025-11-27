import { notFound } from 'next/navigation'
import { CategoryForm } from '@/modules/admin'
import { fetchCategoryById } from '@/services/categories.services'
import { Params } from '@/types'

type PageProps = {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const id = params.id as string

  if (!id) {
    notFound()
  }
  const category = await fetchCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Editar categoria</h1>
        <p className="text-sm text-muted-foreground">
          Actualiza el nombre, descripcion o icono de la categoria.
        </p>
      </div>
      <CategoryForm mode="edit" category={category} />
    </div>
  )
}
