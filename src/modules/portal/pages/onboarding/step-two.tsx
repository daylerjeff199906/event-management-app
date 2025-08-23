'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  onSkip: () => void
}

export function StepTwo({ data, onNext, onBack, onSkip }: StepTwoProps) {
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
    <div className="animate-slide-in-right">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            ¿Qué te apasiona?
          </CardTitle>
          <CardDescription className="text-lg">
            Selecciona tus intereses para encontrar eventos perfectos para ti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tus intereses</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestOptions.map((interest) => {
                  const Icon = interest.icon
                  const isSelected = watchedInterests.includes(interest.id)

                  return (
                    <Label
                      key={interest.id}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <Checkbox
                        className="sr-only"
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const currentInterests =
                            form.getValues('interests') || []
                          if (checked) {
                            form.setValue('interests', [
                              ...currentInterests,
                              interest.id
                            ])
                          } else {
                            form.setValue(
                              'interests',
                              currentInterests.filter(
                                (id) => id !== interest.id
                              )
                            )
                          }
                        }}
                      />
                      <Icon
                        className={`w-6 h-6 mb-2 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {interest.label}
                      </span>
                    </Label>
                  )
                })}
              </div>
              {form.formState.errors.interests && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.interests.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Tipos de eventos favoritos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventTypeOptions.map((eventType) => {
                  const isSelected = watchedEventTypes.includes(eventType.id)

                  return (
                    <Label
                      key={eventType.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const currentEventTypes =
                            form.getValues('eventTypes') || []
                          if (checked) {
                            form.setValue('eventTypes', [
                              ...currentEventTypes,
                              eventType.id
                            ])
                          } else {
                            form.setValue(
                              'eventTypes',
                              currentEventTypes.filter(
                                (id) => id !== eventType.id
                              )
                            )
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="font-medium">{eventType.label}</span>
                    </Label>
                  )
                })}
              </div>
              {form.formState.errors.eventTypes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.eventTypes.message}
                </p>
              )}
            </div>

            <div className="flex flex-col  pt-4 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 bg-transparent h-12 rounded-full"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Anterior
                </Button>

                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-full"
                  disabled={
                    watchedInterests.length === 0 ||
                    watchedEventTypes.length === 0
                  }
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <Button
                type="button"
                variant="link"
                onClick={onSkip}
                className="flex-1 bg-transparent"
              >
                Omitir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
