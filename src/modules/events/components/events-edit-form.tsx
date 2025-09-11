'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarIcon,
  MapPinIcon,
  GlobeIcon,
  ClockIcon,
  Loader,
  Pin
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
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
import { Address, Category, Event, EventStatus } from '@/types'
import { updateEvent, updateEventField } from '@/services/events.services'
import { upsertAddress } from '@/services/address.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import ImageUpload from './image-upload'
import SearchLocation from '@/components/app/miscellaneous/search-location'
import { AddressForm } from './address-form'

const locationTypes = [
  {
    value: 'venue',
    label: 'Presencial',
    icon: MapPinIcon,
    description: 'Evento presencial en una ubicación específica'
  },
  {
    value: 'online',
    label: 'En línea',
    icon: GlobeIcon,
    description: 'Evento virtual o en línea'
  },
  {
    value: 'tba',
    label: 'Por anunciar',
    icon: ClockIcon,
    description: 'Ubicación por anunciar'
  }
]

interface EventsCreateFormProps {
  institutionId?: string
  authorId?: string
  urlReturn?: string
  categories?: Category[]
  eventData: Event
  eventAddress?: Address | null
}

export const EventsEditForm = (props: EventsCreateFormProps) => {
  const {
    institutionId,
    urlReturn,
    authorId,
    categories,
    eventData,
    eventAddress
  } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMoreLocationOptions, setShowMoreLocationOptions] = useState(true)
  const [addressSaved, setAddressSaved] = useState<Address | null>(
    eventAddress || null
  )
  const [addressEditMode, setAddressEditMode] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: eventData?.event_name || '',
      description: eventData?.description || '',
      author_id: String(eventData?.author_id),
      start_date: eventData?.start_date
        ? new Date(eventData.start_date)
        : undefined,
      end_date: eventData?.end_date ? new Date(eventData.end_date) : undefined,
      location: eventData?.location || '',
      location_type: eventData?.location_type || 'venue',
      cover_image_url: eventData?.cover_image_url || '',
      category: eventData?.category || undefined,
      status: eventData?.status || EventStatus.DRAFT,
      lat: eventData?.lat || null,
      lon: eventData?.lon || null,
      link_meeting: eventData?.link_meeting || ''
    }
  })

  const isDirty = form.formState.isDirty

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    let uuidAdreess = eventData?.adress_uuid || null

    try {
      if (data.location_type === 'venue' && addressEditMode) {
        // Si la dirección está en modo edición, guardarla primero
        const { data: addressData } = await upsertAddress(
          eventData?.adress_uuid || null,
          {
            address_line1: addressSaved?.address_line1 || '',
            address_line2: addressSaved?.address_line2 || '',
            city: addressSaved?.city || '',
            state: addressSaved?.state || '',
            postal_code: addressSaved?.postal_code || '',
            country: addressSaved?.country || '',
            latitude: addressSaved?.latitude || null,
            longitude: addressSaved?.longitude || null
          }
        )

        if (addressData) {
          uuidAdreess = addressData.id?.toString() || null
        }
      }

      // Enviar datos al servicio de creación de eventos
      const response = await updateEvent(eventData.id, {
        ...data,
        institution_id: institutionId,
        author_id: authorId,
        adress_uuid: uuidAdreess?.toString()
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
        form.reset()
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

  const selectedLocationType = form.watch('location_type')

  return (
    <div className="p-6 space-y-8">
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
          <Card className="shadow-none border border-gray-200 bg-white">
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
              <CardTitle>Descripción del evento</CardTitle>
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

          {/* Fechas */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>¿Cuándo inicia y termina tu evento?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de inicio *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy — HH:mm', {
                                  locale: es
                                })
                              ) : (
                                <span>Selecciona la fecha de inicio</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de finalización</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy — HH:mm', {
                                  locale: es
                                })
                              ) : (
                                <span>Selecciona la fecha de finalización</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues('start_date')
                              return startDate
                                ? date < startDate
                                : date < new Date()
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

          {/* Ubicación */}
          <Card className="shadow-none border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>¿Dónde se llevará a cabo tu evento?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location_type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        {locationTypes.map((type) => {
                          const Icon = type.icon
                          const isSelected = field.value === type.value
                          return (
                            <Button
                              key={type.value}
                              type="button"
                              variant={isSelected ? 'default' : 'outline'}
                              className="flex-1 h-auto p-3"
                              onClick={() => field.onChange(type.value)}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{type.label}</span>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedLocationType === 'venue' && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                    onClick={() =>
                      setShowMoreLocationOptions(!showMoreLocationOptions)
                    }
                  >
                    {showMoreLocationOptions ? (
                      <>
                        <Pin />
                        Buscar localidad
                      </>
                    ) : (
                      <>
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        Add location details
                      </>
                    )}
                  </Button>
                  {!showMoreLocationOptions && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col gap-2 relative">
                              <SearchLocation
                                className="w-full"
                                onSelect={(address, lat, lon) => {
                                  field.onChange(address)
                                  form.setValue('lat', lat)
                                  form.setValue('lon', lon)
                                }}
                              />
                              <p className="text-sm text-muted-foreground">
                                Dirección seleccionada:{' '}
                                {form.getValues('location')}
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {selectedLocationType === 'online' && (
                <FormField
                  control={form.control}
                  name="link_meeting"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Solo si el evento tiene link de acceso en línea"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="mt-1">
                        Si el evento es en línea tendrá más de un enlace de
                        acceso (Zoom, Google Meet, YouTube, etc.), despues
                        podrás agregar los enlaces en la descripción del evento
                        (Más Información).
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              {selectedLocationType === 'venue' && (
                <div className="space-y-2">
                  {!showMoreLocationOptions && (
                    <>
                      {/* Placeholder para el mapa */}
                      {form.watch('lat') && form.watch('lon') ? (
                        <iframe
                          title="Ubicación en el mapa"
                          src={`https://maps.google.com/maps?q=${form.watch(
                            'lat'
                          )},${form.watch('lon')}&z=15&output=embed`}
                          className="w-full h-48 rounded-lg border"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                            <p>Map will appear here</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {showMoreLocationOptions && (
                    <AddressForm
                      onChange={setAddressSaved}
                      onChangeEdit={() => {
                        setAddressEditMode(true)
                        form.setValue(
                          'location',
                          addressSaved?.address_line1 || ''
                        )
                      }}
                    />
                  )}
                </div>
              )}
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
          <div className="flex gap-4 pt-6">
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
