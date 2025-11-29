'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { format } from 'date-fns'
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
import { Category, Event, EventStatus } from '@/types'
import { updateEvent, updateEventField } from '@/services/events.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import ImageUpload from './image-upload'
import { Textarea } from '@/components/ui/textarea'
import { EventLocationSection } from './event-location-section'
import { formatDate } from 'date-fns'
import { es } from 'date-fns/locale'
import { AiDescriptionGenerator } from '@/modules/dashboard/components/ai-description-generator'
import { RichTextEditor } from './rich-text-editor'

const mergeDateWithTime = (dateValue: Date | undefined, time: string) => {
  if (!dateValue) return undefined

  const [hours, minutes] = time.split(':').map((value) => Number(value) || 0)

  const updatedDate = new Date(dateValue)

  updatedDate.setHours(hours, minutes, 0, 0)

  return updatedDate
}

const formatDateForInput = (date: Date | undefined) => {
  if (!date) return ''
  // Cambio: Usar format() en lugar de toISOString() para evitar conversión a UTC
  return format(date, 'yyyy-MM-dd')
}
interface EventsCreateFormProps {
  institutionId?: string
  authorId?: string
  urlReturn?: string
  categories?: Category[]
  eventData: Event
}

export const EventsEditForm = (props: EventsCreateFormProps) => {
  const { institutionId, urlReturn, authorId, categories, eventData } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEndDate, setShowEndDate] = useState(!!eventData?.end_date)
  const [showRecurring, setShowRecurring] = useState(
    !!eventData?.is_recurring ||
      !!eventData?.recurrence_pattern ||
      !!eventData?.recurrence_end_date
  )

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: eventData?.event_name || '',
      description: eventData?.description || '',
      author_id: String(eventData?.author_id || authorId || ''),
      start_date: eventData?.start_date
        ? new Date(eventData.start_date)
        : undefined,
      end_date: eventData?.end_date ? new Date(eventData.end_date) : undefined,
      cover_image_url: eventData?.cover_image_url || '',
      category: eventData?.category || undefined,
      status: eventData?.status || EventStatus.DRAFT,
      is_recurring: eventData?.is_recurring || false,
      recurrence_pattern: eventData?.recurrence_pattern || undefined,
      recurrence_interval: eventData?.recurrence_interval || undefined,
      recurrence_end_date: eventData?.recurrence_end_date
        ? new Date(eventData.recurrence_end_date)
        : undefined,
      time: eventData?.time
        ? new Date(`1970-01-01T${eventData.time}`)
        : undefined,
      duration: eventData?.duration || undefined,
      address_uuid: eventData?.address_uuid || undefined,
      // is_featured: eventData?.is_featured || false,
      institution_id: eventData?.institution_id || institutionId || undefined,
      user_id: eventData?.user_id || undefined,
      address_id: eventData?.address_id || undefined,
      meeting_url: eventData?.meeting_url || undefined,
      custom_location: eventData?.custom_location || undefined,
      event_mode: eventData?.event_mode || undefined,
      full_description: eventData?.full_description || undefined
    }
  })

  const isDirty = form.formState.isDirty
  const startDate = form.watch('start_date')
  const endDate = form.watch('end_date')
  const recurrencePattern = form.watch('recurrence_pattern')

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

    if (!recurrencePattern && eventData?.recurrence_pattern) {
      form.setValue('recurrence_pattern', eventData.recurrence_pattern)
    } else if (!recurrencePattern) {
      form.setValue('recurrence_pattern', 'WEEKLY')
    }
  }, [showRecurring, recurrencePattern, eventData, form])

  const handleRemoveEndDate = () => {
    form.setValue('end_date', undefined, { shouldValidate: true })
    setShowEndDate(false)
  }

  const handleRemoveRecurring = () => {
    form.setValue('is_recurring', false, { shouldValidate: true })
    form.setValue('recurrence_pattern', null, { shouldValidate: true })
    form.setValue('recurrence_interval', null, { shouldValidate: true })
    form.setValue('recurrence_end_date', null, { shouldValidate: true })
    setShowRecurring(false)
  }

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)

    try {
      const response = await updateEvent(eventData.id, {
        ...data,
        institution_id: institutionId,
        author_id: authorId,
        // Asegurar que los campos desactivados se envíen como undefined
        is_recurring: showRecurring ? data.is_recurring : false,
        end_date: showEndDate ? data.end_date : null,
        recurrence_pattern: showRecurring ? data.recurrence_pattern : null,
        recurrence_interval: showRecurring ? data.recurrence_interval : null,
        recurrence_end_date: showRecurring ? data.recurrence_end_date : null
      })

      if (response.error) {
        toast.error(
          <ToastCustom
            title="Error"
            description={`No se pudo editar el evento: ${response.error.message}`}
            variant="destructive"
          />
        )
      } else {
        toast.success(
          <ToastCustom
            title="Éxito"
            description="El evento ha sido editado correctamente."
          />
        )
        form.reset(data)
        if (urlReturn) {
          window.location.href = urlReturn
        } else {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Error al editar evento:', error)
      toast.error(
        <ToastCustom
          title="Error"
          description="Ocurrió un error inesperado al editar el evento."
          variant="destructive"
        />
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onImageChange = async (imageUrl: string) => {
    form.setValue('cover_image_url', imageUrl, { shouldDirty: true })
    try {
      const response = await updateEventField({
        eventId: eventData.id,
        fieldName: 'cover_image_url',
        fieldValue: imageUrl
      })

      if (response.error) {
        toast.error(
          <ToastCustom
            title="Error"
            description={`No se pudo actualizar la imagen del evento: ${response.error.message}`}
            variant="destructive"
          />
        )
      } else {
        toast.success(
          <ToastCustom
            title="Éxito"
            description="La imagen del evento ha sido actualizada correctamente."
          />
        )
      }
    } catch {
      toast.error(
        <ToastCustom
          title="Error"
          description="Ocurrió un error inesperado al actualizar la imagen del evento."
          variant="destructive"
        />
      )
    }
  }

  return (
    <div className="p-2 md:p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Edita los detalles de tu evento</h1>
        <p className="text-gray-600">
          Completa el formulario para actualizar la información de tu evento.
          Puedes cambiar estos detalles más tarde si es necesario.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* URL de imagen de portada */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle>Agrega una imagen de portada para tu evento</CardTitle>
              <CardDescription>
                Esta imagen se utilizará en la página del evento y en las
                promociones. Asegúrate de que sea atractiva y relevante.
                (Opcional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                showExamples={false}
                urlImage={form.getValues('cover_image_url')}
                onImageChange={onImageChange}
              />
            </CardContent>
          </Card>

          {/* Nombre del evento */}
          <Card className="shadow-none border border-gray-200 ">
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
          <Card className="shadow-none border border-gray-200 ">
            <CardHeader>
              <CardTitle>Descripción corta del evento</CardTitle>
              <CardDescription>
                Proporciona más detalles sobre tu evento para ayudar a los
                asistentes a entender qué pueden esperar.
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
                        placeholder="Describe a las personas qué pueden esperar de tu evento..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Descripción completa con IA */}
          <Card className="shadow-none border border-gray-200 ">
            <CardHeader>
              <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                <div className="space-y-1.5">
                  <CardTitle>Descripción del evento</CardTitle>
                  <CardDescription>
                    Proporciona más detalles sobre tu evento. Puedes usar
                    negritas y listas para resaltar lo importante.
                  </CardDescription>
                </div>
                {/* Generador IA */}
                <AiDescriptionGenerator form={form} categories={categories} />
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="full_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* Aquí usamos el nuevo componente */}
                      <RichTextEditor
                        value={field.value || '// ... resto del contenido'}
                        onChange={field.onChange}
                        placeholder="Escribe o genera una descripción increíble..."
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card className="shadow-none border border-gray-200 ">
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
                            value={
                              field.value ? formatDateForInput(field.value) : ''
                            }
                            onChange={(e) => {
                              // Cambio: Agregar 'T00:00:00' para forzar hora local
                              const selectedDate = e.target.value
                                ? new Date(`${e.target.value}T00:00:00`)
                                : undefined

                              if (field.value && selectedDate) {
                                const currentTime = format(field.value, 'HH:mm')
                                const updatedDate = mergeDateWithTime(
                                  selectedDate,
                                  currentTime
                                )
                                field.onChange(updatedDate)
                              } else {
                                field.onChange(selectedDate)
                              }
                            }}
                            min={formatDate(new Date(), 'yyyy-MM-dd', {
                              locale: es
                            })}
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            type="time"
                            value={
                              field.value
                                ? format(field.value, 'HH:mm')
                                : '00:00'
                            }
                            onChange={(e) => {
                              if (field.value) {
                                const updatedDate = mergeDateWithTime(
                                  field.value,
                                  e.target.value || '00:00'
                                )
                                field.onChange(updatedDate)
                              }
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
                                value={
                                  field.value
                                    ? formatDateForInput(field.value)
                                    : ''
                                }
                                onChange={(e) => {
                                  // Cambio: Agregar 'T00:00:00' para forzar hora local
                                  const selectedDate = e.target.value
                                    ? new Date(`${e.target.value}T00:00:00`)
                                    : undefined

                                  if (field.value && selectedDate) {
                                    const currentTime = format(
                                      field.value,
                                      'HH:mm'
                                    )
                                    const updatedDate = mergeDateWithTime(
                                      selectedDate,
                                      currentTime
                                    )
                                    field.onChange(updatedDate)
                                  } else {
                                    field.onChange(selectedDate)
                                  }
                                }}
                                min={
                                  formatDateForInput(startDate) ||
                                  formatDate(new Date(), 'yyyy-MM-dd', {
                                    locale: es
                                  })
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                type="time"
                                value={
                                  field.value
                                    ? format(field.value, 'HH:mm')
                                    : '00:00'
                                }
                                onChange={(e) => {
                                  if (field.value) {
                                    const updatedDate = mergeDateWithTime(
                                      field.value,
                                      e.target.value || '00:00'
                                    )
                                    field.onChange(updatedDate)
                                  }
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
                      onClick={handleRemoveEndDate}
                    >
                      - Quitar fecha y hora de fin
                    </Button>
                  </>
                )}
              </div>

              {/* Campos originales de tiempo y duración */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de inicio específica</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          value={
                            field.value ? format(field.value, 'HH:mm') : '00:00'
                          }
                          onChange={(e) => {
                            const timeValue = e.target.value || '00:00'
                            // Si no hay fecha actual, crear una nueva con la hora
                            if (!field.value) {
                              const newDate = new Date()
                              const updatedDate = mergeDateWithTime(
                                newDate,
                                timeValue
                              )
                              field.onChange(updatedDate)
                            } else {
                              const updatedDate = mergeDateWithTime(
                                field.value,
                                timeValue
                              )
                              field.onChange(updatedDate)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración (minutos)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Ej: 120"
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
              </div>
            </CardContent>
          </Card>

          {/* Tipo de evento */}
          <EventLocationSection form={form} />

          {/* Evento recurrente */}
          <Card className="shadow-none border border-gray-200 ">
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
                        onClick={handleRemoveRecurring}
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
                            defaultValue={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
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
                              value={
                                field.value
                                  ? formatDateForInput(field.value)
                                  : ''
                              }
                              onChange={(e) => {
                                // Cambio: Agregar 'T00:00:00'
                                const selectedDate = e.target.value
                                  ? new Date(`${e.target.value}T00:00:00`)
                                  : undefined
                                field.onChange(selectedDate)
                              }}
                              min={
                                formatDateForInput(startDate) ||
                                formatDate(new Date(), 'yyyy-MM-dd', {
                                  locale: es
                                })
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
          <Card className="shadow-none border border-gray-200 ">
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

          <Card className="shadow-none border border-gray-200 ">
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
                        <SelectTrigger className="w-full">
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
                        <SelectItem value={EventStatus.PUBLIC}>
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
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Editando...' : 'Editar evento'}
              {isSubmitting && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
