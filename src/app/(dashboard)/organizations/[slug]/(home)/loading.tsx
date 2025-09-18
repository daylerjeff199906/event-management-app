// app/instituciones/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
      {/* Título (estático) */}
      <h1 className="text-2xl font-semibold tracking-tight mb-4 sm:mb-6">
        Instituciones
      </h1>

      {/* Buscador */}
      <div className="relative mb-5">
        <Skeleton className="h-11 w-full rounded-2xl" />
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>

      {/* Lista de tarjetas */}
      <ul className="space-y-4 sm:space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Skeleton className="h-12 w-12 rounded-full" />

              {/* Contenido */}
              <div className="flex-1">
                {/* Nombre */}
                <Skeleton className="h-5 w-56 max-w-[60%] rounded-md" />

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                {/* Email y teléfono */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-md" />
                    <Skeleton className="h-4 w-64 max-w-[75%] rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-md" />
                    <Skeleton className="h-4 w-40 max-w-[50%] rounded-md" />
                  </div>
                </div>
              </div>

              {/* Chevron / acción */}
              <Skeleton className="hidden h-6 w-6 rounded-full sm:block" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
