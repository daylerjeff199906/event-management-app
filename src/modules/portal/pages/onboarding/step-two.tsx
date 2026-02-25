'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { interestsSchema, type Interests } from '../../lib/validations'
import {
  eventTypeOptions,
  interestOptions
} from '@/data/interest-events-options'

interface StepTwoProps {
  data: Interests
  onNext: (data: Interests) => void
  onBack: () => void
}

export function StepTwo({ data, onNext, onBack }: StepTwoProps) {
  const form = useForm<Interests>({
    resolver: zodResolver(interestsSchema),
    defaultValues: data
  })

  const onSubmit = (data: Interests) => {
    onNext(data)
  }

  const watchedInterests = form.watch('interests') || []
  const watchedEventTypes = form.watch('eventTypes') || []

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          ¿Qué te apasiona?
        </h1>
        <p className="text-slate-500 font-medium">
          Selecciona tus intereses para recomendarte los mejores eventos.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Intereses */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Tus intereses principales</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {interestOptions.map((interest) => {
              const Icon = interest.icon
              const isSelected = watchedInterests.includes(interest.id)

              return (
                <Label
                  key={interest.id}
                  className={cn(
                    "relative flex flex-col items-center p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  )}
                >
                  <Checkbox
                    className="sr-only"
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentInterests = form.getValues('interests') || []
                      if (checked) {
                        form.setValue('interests', [...currentInterests, interest.id])
                      } else {
                        form.setValue('interests', currentInterests.filter(id => id !== interest.id))
                      }
                    }}
                  />
                  <div className={cn(
                    "p-3 rounded-2xl mb-3 transition-colors",
                    isSelected ? "bg-primary/10" : "bg-slate-50"
                  )}>
                    <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-slate-400")} />
                  </div>
                  <span className={cn(
                    "text-xs font-bold tracking-tight text-center",
                    isSelected ? "text-primary" : "text-slate-600"
                  )}>
                    {interest.label}
                  </span>
                </Label>
              )
            })}
          </div>
        </div>

        {/* Tipos de Eventos */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Tipos de eventos favoritos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventTypeOptions.map((eventType) => {
              const isSelected = watchedEventTypes.includes(eventType.id)

              return (
                <Label
                  key={eventType.id}
                  className={cn(
                    "flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentEventTypes = form.getValues('eventTypes') || []
                      if (checked) {
                        form.setValue('eventTypes', [...currentEventTypes, eventType.id])
                      } else {
                        form.setValue('eventTypes', currentEventTypes.filter(id => id !== eventType.id))
                      }
                    }}
                    className="mr-4 h-5 w-5 rounded-md"
                  />
                  <span className={cn(
                    "font-bold tracking-tight",
                    isSelected ? "text-primary" : "text-slate-700"
                  )}>
                    {eventType.label}
                  </span>
                </Label>
              )
            })}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Regresar
          </Button>

          <Button
            type="submit"
            className="flex-[2] h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            disabled={watchedInterests.length === 0 || watchedEventTypes.length === 0}
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
