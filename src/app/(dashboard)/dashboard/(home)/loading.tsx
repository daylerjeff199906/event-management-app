import { Skeleton } from '@/components/ui/skeleton'

/** Tarjeta de Acción Skeleton */
const ActionCardSkeleton = () => (
  <div className="rounded-2xl border border-neutral-200/60 p-5 dark:border-neutral-800">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <Skeleton className="mx-auto mb-2 h-3 w-24" />
    <Skeleton className="mx-auto h-3 w-32" />
  </div>
)

/** Chip de categoría Skeleton */
const PillSkeleton = ({ w = 80 }: { w?: number }) => (
  <Skeleton className="h-9 rounded-full" style={{ width: w }} />
)

/** Tarjeta Grande Skeleton */
const BigCardSkeleton = () => (
  <div className="group relative overflow-hidden rounded-2xl">
    <Skeleton className="aspect-[1.25/1] sm:aspect-video w-full" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-3 w-64 rounded" />
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-10 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
        <Skeleton className="h-5 w-10 rounded-md" />
      </div>
    </div>
  </div>
)

export default function Loading() {
  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`}
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando contenido de eventos"
    >
      {/* Banner */}
      <div className="mb-6 rounded-2xl border border-neutral-200/60 p-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-64" />
          <div className="ms-auto">
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="mb-5">
        <Skeleton className="h-7 w-80 rounded" />
      </div>

      {/* Acciones Rápidas (6 tarjetas) */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ActionCardSkeleton key={i} />
        ))}
      </div>

      {/* Categorías Populares */}
      <div className="mb-4">
        <Skeleton className="mb-3 h-5 w-44 rounded" />
        <div className="flex flex-wrap gap-3">
          <PillSkeleton w={72} />
          <PillSkeleton w={104} />
          <PillSkeleton w={96} />
          <PillSkeleton w={86} />
          <PillSkeleton w={132} />
          <PillSkeleton w={64} />
          <PillSkeleton w={80} />
          <PillSkeleton w={76} />
        </div>
      </div>

      {/* Grid de Tarjetas Grandes */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <BigCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
