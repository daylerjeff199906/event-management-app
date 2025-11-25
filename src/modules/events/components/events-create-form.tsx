'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Loader } from 'lucide-react'
import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'
// import { es } from 'da  te-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { eventSchema, type EventFormData } from '@/modules/events/schemas'
import { Category, EventStatus } from '@/types'
import Link from 'next/link'
import { createEvent } from '@/services/events.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

interface EventsCreateFormProps {
  institutionId?: string
  authorId?: string
  urlReturn?: string
  categories?: Category[]
}

export const EventsCreateForm = (props: EventsCreateFormProps) => {
  const { institutionId, urlReturn, authorId, categories } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)

  const router = useRouter()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: '',
      description: '',
      cover_image_url: '',
      status: EventStatus.DRAFT,
      category: undefined,
      start_date: undefined,
      end_date: undefined,
      is_recurring: false,
      recurrence_pattern: undefined,
      recurrence_interval: undefined,
      recurrence_end_date: undefined
    }
  })

  const startDate = form.watch('start_date')
  const endDate = form.watch('end_date')
  const recurrencePattern = form.watch('recurrence_pattern')
  const recurrenceInterval = form.watch('recurrence_interval')

  const mergeDateWithTime = (dateValue: Date | undefined, time: string) => {
    if (!dateValue) return undefined
    const [hours, minutes] = time.split(':').map((value) => Number(value) || 0)
    const updatedDate = new Date(dateValue)
    updatedDate.setHours(hours, minutes, 0, 0)
    return updatedDate
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ''
    return format(date, 'yyyy-MM-dd')
  }

  useEffect(() => {
    if (!showEndDate) {
      form.setValue('end_date', undefined)
      return
    }
    if (showEndDate && startDate && !endDate) {
      form.setValue('end_date', startDate, { shouldValidate: true })
    }
  }, [showEndDate, startDate, endDate, form])

  useEffect(() => {
    if (!showRecurring) {
      form.setValue('is_recurring', false)
      form.setValue('recurrence_pattern', undefined)
      form.setValue('recurrence_interval', undefined)
      form.setValue('recurrence_end_date', undefined)
      return
    }

    form.setValue('is_recurring', true)

    if (!recurrencePattern) {
      form.setValue('recurrence_pattern', 'WEEKLY')
    }

    const interval =
      recurrenceInterval && recurrenceInterval > 0 ? recurrenceInterval : 1

    if (showRecurring && startDate) {
      let calculatedEnd = new Date(startDate)

      switch (recurrencePattern) {
        case 'DAILY':
          calculatedEnd = addDays(startDate, interval)
          break
        case 'MONTHLY':
          calculatedEnd = addMonths(startDate, interval)
          break
        case 'YEARLY':
          calculatedEnd = addYears(startDate, interval)
          break
        default:
          calculatedEnd = addWeeks(startDate, interval)
          break
      }

      const currentRecurrenceEnd = form.getValues('recurrence_end_date')
      if (
        !currentRecurrenceEnd ||
        currentRecurrenceEnd <= startDate ||
        currentRecurrenceEnd.getTime() === startDate.getTime()
      ) {
        form.setValue('recurrence_end_date', calculatedEnd, {
          shouldValidate: true
        })
      }
    }
  }, [showRecurring, recurrencePattern, recurrenceInterval, startDate, form])

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      // Enviar datos al servicio de creación de eventos
      const response = await createEvent({
        ...data,
        institution_id: institutionId,
        author_id: authorId
      })

      if (response.error) {
        toast.error(
          <ToastCustom
            title="Error"
            description={`No se pudo crear el evento: ${response.error.message}`}
            variant="destructive"
          />
        )
      } else {
        toast.success(
          <ToastCustom
            title="Éxito"
            description="El evento ha sido creado exitosamente."
          />
        )
        form.reset()
        if (urlReturn) {
          router.push(urlReturn)
        }
      }
    } catch (error) {
      console.error('Error al crear evento:', error)
      toast.error(
        <ToastCustom
          title="Error"
          description="Ocurrió un error inesperado al crear el evento."
          variant="destructive"
        />
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-2 md:p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-balance">
          Crea tu evento al instante
        </h1>
        <p className="text-muted-foreground text-pretty">
          Completa los datos básicos de tu evento y personaliza cada detalle. Si
          lo prefieres, puedes{' '}
          <Link href={'#'} className="p-0 h-auto text-blue-600 hover:underline">
            generar el evento automáticamente con IA{' '}
            <ExternalLink className="inline-block h-4 w-4 mb-1" />
          </Link>
          .
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nombre del evento */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>¿Cuál es el nombre de tu evento?</CardTitle>
              <CardDescription>
                Este será el título de tu evento. El título se usará para crear
                el resumen, la descripción, la categoría y las etiquetas de tu
                evento, así que ¡sé específico!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Título del evento *"
                        className="text-lg"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>
                ¿Puedes describir brevemente de qué trata tu evento?
              </CardTitle>
              <CardDescription>
                Proporciona una descripción clara y concisa para atraer a los
                asistentes potenciales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del evento"
                        className="text-lg min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>¿Cuándo inicia y termina tu evento?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de inicio *</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormControl>
                          <Input
                            type="date"
                            value={formatDateForInput(field.value)}
                            onChange={(e) => {
                              const selectedDate = e.target.value
                                ? new Date(e.target.value)
                                : undefined
                              const timeString = field.value
                                ? format(field.value, 'HH:mm')
                                : '00:00'
                              const updatedDate = mergeDateWithTime(
                                selectedDate,
                                timeString
                              )
                              field.onChange(updatedDate)
                            }}
                            min={format(new Date(), 'yyyy-MM-dd')}
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            type="time"
                            value={
                              field.value ? format(field.value, 'HH:mm') : ''
                            }
                            disabled={!field.value}
                            onChange={(e) => {
                              const updatedDate = mergeDateWithTime(
                                field.value,
                                e.target.value
                              )
                              field.onChange(updatedDate)
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!showEndDate ? (
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-primary font-semibold h-auto"
                    onClick={() => setShowEndDate(true)}
                  >
                    + Agregar fecha y hora de fin
                  </Button>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de finalización</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormControl>
                              <Input
                                type="date"
                                value={formatDateForInput(field.value)}
                                onChange={(e) => {
                                  const selectedDate = e.target.value
                                    ? new Date(e.target.value)
                                    : undefined
                                  const timeString = field.value
                                    ? format(field.value, 'HH:mm')
                                    : '00:00'
                                  const updatedDate = mergeDateWithTime(
                                    selectedDate,
                                    timeString
                                  )
                                  field.onChange(updatedDate)
                                }}
                                min={
                                  formatDateForInput(startDate) ||
                                  format(new Date(), 'yyyy-MM-dd')
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                type="time"
                                value={
                                  field.value
                                    ? format(field.value, 'HH:mm')
                                    : ''
                                }
                                disabled={!field.value}
                                onChange={(e) => {
                                  const updatedDate = mergeDateWithTime(
                                    field.value,
                                    e.target.value
                                  )
                                  field.onChange(updatedDate)
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-destructive font-semibold h-auto"
                      onClick={() => setShowEndDate(false)}
                    >
                      - Quitar fecha y hora de fin
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evento recurrente */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>¿Es un evento recurrente?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showRecurring ? (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-primary font-semibold h-auto"
                  onClick={() => setShowRecurring(true)}
                >
                  + Configurar evento recurrente
                </Button>
              ) : (
                <>
                  <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">
                        Evento recurrente
                      </FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-destructive font-semibold h-auto"
                        onClick={() => setShowRecurring(false)}
                      >
                        - Desactivar recurrencia
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="recurrence_pattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patrón de recurrencia</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un patrón" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DAILY">Diario</SelectItem>
                              <SelectItem value="WEEKLY">Semanal</SelectItem>
                              <SelectItem value="MONTHLY">Mensual</SelectItem>
                              <SelectItem value="YEARLY">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recurrence_interval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intervalo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Ej: 1 (cada 1 semana/mes/etc.)"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recurrence_end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de fin de recurrencia</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                const selectedDate = e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                                field.onChange(selectedDate)
                              }}
                              min={
                                formatDateForInput(startDate) ||
                                format(new Date(), 'yyyy-MM-dd')
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Categoría */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Selecciona una categoría para tu evento</CardTitle>
              <CardDescription>
                Ayuda a los asistentes a encontrar tu evento eligiendo la
                categoría más relevante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories?.map((cat) => {
                        const isSelected = field.value === Number(cat.id)
                        return (
                          <Badge
                            key={cat.id}
                            className={cn(
                              'cursor-pointer px-4 py-2 rounded-full transition-colors',
                              isSelected
                                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                            )}
                            onClick={() =>
                              field.onChange(isSelected ? undefined : cat.id)
                            }
                          >
                            {cat.name}
                          </Badge>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Estado del evento */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>
                ¿Quieres publicar el evento ahora o guardarlo como borrador?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full max-w-xs lg:max-w-full">
                          <SelectValue
                            placeholder="Selecciona el estado del evento"
                            className="w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EventStatus.DRAFT}>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 focus:ring-amber-200">
                              Borrador
                            </Badge>
                            <span>
                              Guarda el evento como borrador para publicarlo más
                              tarde
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value={EventStatus.PUBLIC}
                          className="max-w-md"
                        >
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-700 text-green-100 hover:bg-green-600 focus:ring-green-700">
                              Publicado
                            </Badge>
                            <span>
                              Publica el evento inmediatamente y hazlo visible
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6 flex-col md:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Evento'}{' '}
              {isSubmitting && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
