import { CategoryForm } from '@/modules/admin'

export default function Page() {
  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Crear categoria</h1>
        <p className="text-sm text-muted-foreground">
          Agrega una nueva categoria para organizar los eventos.
        </p>
      </div>
      <CategoryForm mode="create" />
    </div>
  )
}
