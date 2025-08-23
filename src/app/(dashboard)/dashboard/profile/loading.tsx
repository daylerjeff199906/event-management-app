import { Skeleton } from '@/components/ui/skeleton'

const InputSkeleton = () => (
  <div className="mb-2">
    <Skeleton className="h-8 w-full rounded-lg" />
  </div>
)

const PillSkeleton = ({ w = 80 }: { w?: number }) => (
  <Skeleton className="h-9 rounded-full" style={{ width: w }} />
)

const ActionButtonSkeleton = () => <Skeleton className="h-12 w-32 rounded-lg" />

const ImageSkeleton = () => (
  <div className="w-32 h-32 mb-5 rounded-full overflow-hidden">
    <Skeleton className="w-full h-full rounded-full" />
  </div>
)

export default function Loading() {
  return (
    <div
      className={`max-w-4xl mx-auto p-4 sm:px-6 lg:px-8 `}
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando perfil de usuario"
    >
      {/* Imagen de perfil */}
      <div className="mb-8 flex items-center justify-center">
        <ImageSkeleton />
      </div>

      {/* Datos personales */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
      </div>

      {/* Intereses */}
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-44 rounded" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PillSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Tipos de eventos favoritos */}
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-44 rounded" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PillSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="mt-6 flex justify-center">
        <ActionButtonSkeleton />
      </div>
    </div>
  )
}
