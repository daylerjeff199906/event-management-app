'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
} from '@/components/ui/form'
import {
  interestsSchema,
  type Interests
} from '@/modules/portal/lib/validations'
import {
  eventTypeOptions,
  interestOptions
} from '@/data/interest-events-options'
import { updateInterest } from '@/services/user.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepTwoProps {
  data: Interests
  idUser: string
}

export function InterestForm({ data, idUser }: StepTwoProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Interests>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: data.interests || [],
      eventTypes: data.eventTypes || []
    }
  })

  const isDirty = form.formState.isDirty

  const onSubmit = async (formData: Interests) => {
    setIsLoading(true)
    try {
      const updated = await updateInterest(idUser, formData)
      if (updated.error) {
        toast.error(
          <ToastCustom
            title="Error"
            description="No se pudieron guardar tus intereses. Intenta nuevamente."
          />
        )
      } else {
        toast.success(
          <ToastCustom
            title="¡Datos actualizados!"
            description="Tus intereses se han guardado correctamente."
          />
        )
        form.reset(formData)
      }
    } catch {
      toast.error(
        <ToastCustom
          title="Error"
          description="No se pudieron guardar tus intereses. Intenta nuevamente."
        />
      )
    } finally {
      setIsLoading(false)
    }
  }

  const watchedInterests = form.watch('interests') || []
  const watchedEventTypes = form.watch('eventTypes') || []

  return (
    <div className="w-full">
      <Card className="shadow-none bg-white dark:bg-slate-800 border-border border-0 p-0">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Interests Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    Tus intereses principales
                  </h3>
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
                            : "border-slate-100 dark:border-slate-700 hover:border-slate-200 bg-white dark:bg-slate-900"
                        )}
                      >
                        <Checkbox
                          className="sr-only"
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('interests') || []
                            if (checked) {
                              form.setValue('interests', [...current, interest.id], { shouldDirty: true })
                            } else {
                              form.setValue('interests', current.filter(id => id !== interest.id), { shouldDirty: true })
                            }
                          }}
                        />
                        <div className={cn(
                          "p-3 rounded-2xl mb-3 transition-colors",
                          isSelected ? "bg-primary/10" : "bg-slate-50 dark:bg-slate-800"
                        )}>
                          <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-slate-400")} />
                        </div>
                        <span className={cn(
                          "text-xs font-bold tracking-tight text-center",
                          isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400"
                        )}>
                          {interest.label}
                        </span>
                      </Label>
                    )
                  })}
                </div>
              </div>

              {/* Event Types Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-4">
                  Tipos de eventos favoritos
                </h3>
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
                            : "border-slate-100 dark:border-slate-700 hover:border-slate-200 bg-white dark:bg-slate-900"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('eventTypes') || []
                            if (checked) {
                              form.setValue('eventTypes', [...current, eventType.id], { shouldDirty: true })
                            } else {
                              form.setValue('eventTypes', current.filter(id => id !== eventType.id), { shouldDirty: true })
                            }
                          }}
                          className="mr-4 h-5 w-5 rounded-md"
                        />
                        <span className={cn(
                          "font-bold tracking-tight",
                          isSelected ? "text-primary" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {eventType.label}
                        </span>
                      </Label>
                    )
                  })}
                </div>
              </div>

              <div className="flex pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || isLoading}
                  className="w-full md:w-auto px-10 h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  {isLoading ? 'Guardando...' : 'Actualizar intereses'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
