// app/events/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="w-full">
      {/* Grid para los eventos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* Imagen */}
            <Skeleton className="h-56 w-full rounded-t-xl" />

            {/* Contenido */}
            <div className="flex flex-col p-4">
              {/* Título */}
              <Skeleton className="h-6 w-3/4 rounded-md" />

              {/* Descripción */}
              <Skeleton className="mt-3 h-4 w-5/6 rounded-md" />

              {/* Fecha y lugar */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>

              {/* Finalización */}
              <Skeleton className="mt-3 h-4 w-44 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
