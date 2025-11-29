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
  FormField,
  FormItem,
  FormMessage
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
      // Actualizar intereses en el servidor
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

        form.reset(formData) // Resetear el estado de "dirty" después de guardar
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

  return (
    <div className="animate-slide-in-right">
      <Card className="w-full mx-auto shadow-none bg-white dark:bg-slate-800 border">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Campo de intereses */}
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Tus intereses</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {interestOptions.map((interest) => {
                        const Icon = interest.icon
                        return (
                          <FormField
                            key={interest.id}
                            control={form.control}
                            name="interests"
                            render={({ field }) => {
                              const isSelected =
                                field.value?.includes(interest.id) || false
                              return (
                                <FormItem
                                  key={interest.id}
                                  className="flex flex-col items-center space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              interest.id
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== interest.id
                                              )
                                            )
                                      }}
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <Label
                                    htmlFor={`interest-${interest.id}`}
                                    className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 w-full ${
                                      isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border'
                                    }`}
                                  >
                                    <Icon
                                      className={`w-6 h-6 mb-2 ${
                                        isSelected
                                          ? 'text-primary'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                    <span
                                      className={`text-sm font-medium text-center ${
                                        isSelected
                                          ? 'text-primary'
                                          : 'text-foreground'
                                      }`}
                                    >
                                      {interest.label}
                                    </span>
                                  </Label>
                                </FormItem>
                              )
                            }}
                          />
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de tipos de eventos */}
              <FormField
                control={form.control}
                name="eventTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">
                        Tipos de eventos favoritos
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {eventTypeOptions.map((eventType) => (
                        <FormField
                          key={eventType.id}
                          control={form.control}
                          name="eventTypes"
                          render={({ field }) => {
                            const isSelected =
                              field.value?.includes(eventType.id) || false
                            return (
                              <FormItem
                                key={eventType.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            eventType.id
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== eventType.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <Label
                                  htmlFor={`event-type-${eventType.id}`}
                                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 flex-1 ${
                                    isSelected
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border'
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== eventType.id
                                        )
                                      )
                                    } else {
                                      field.onChange([
                                        ...(field.value || []),
                                        eventType.id
                                      ])
                                    }
                                  }}
                                >
                                  <span className="font-medium">
                                    {eventType.label}
                                  </span>
                                </Label>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex pt-4">
                <Button type="submit" disabled={!isDirty || isLoading}>
                  {isLoading ? 'Guardando...' : 'Actualizar datos'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
