'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'

const SkeletonInput = () => <Skeleton className="h-8 w-full rounded-lg" />
const SkeletonAvatar = () => (
  <Skeleton className="w-32 h-32 rounded-full mx-auto" />
)
const SkeletonButton = () => (
  <Skeleton className="h-12 w-32 rounded-lg mx-auto" />
)
const SkeletonRadioGroup = () => (
  <div className="flex gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
)

export default function Loading() {
  return (
    <div
      className={`max-w-6xl mx-auto p-6 space-y-6`}
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Profile Image */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="border-2 border-dashed px-6 rounded-lg py-20 bg-white sticky top-24">
            <SkeletonAvatar />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Progress bar description */}
          <div className="w-full col-span-1 md:col-span-2">
            <div>
              <p className="text-xs text-muted-foreground italic text-end pb-2">
                Completa tu perfil y manténlo actualizado para obtener una mejor
                experiencia.
              </p>
              <Progress value={0} className="h-2" />
            </div>
          </div>

          {/* User Info Form */}
          <Card className="shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-slate-700">
                Tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkeletonInput />
                  <SkeletonInput />
                </div>

                {/* Username & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkeletonInput />
                  <div>
                    <Label className="text-sm font-medium text-slate-600">
                      Email
                    </Label>
                    <SkeletonInput />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm font-medium text-slate-600">
                    Teléfono Móvil
                  </Label>
                  <SkeletonInput />
                </div>

                {/* Gender & Birthday */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">
                      Género
                    </Label>
                    <SkeletonRadioGroup />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">
                      Cumpleaños
                    </Label>
                    <SkeletonInput />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <SkeletonButton />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Interests Form */}
          <div>
            <Skeleton className="h-6 w-36 rounded" />
            <div className="flex gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
