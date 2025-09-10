'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, MapPinIcon, GlobeIcon, ClockIcon } from 'lucide-react'
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
import { EventStatus } from '@/types'

const locationTypes = [
  {
    value: 'venue',
    label: 'Venue',
    icon: MapPinIcon,
    description: 'Evento presencial en una ubicación específica'
  },
  {
    value: 'online',
    label: 'Online event',
    icon: GlobeIcon,
    description: 'Evento virtual o en línea'
  },
  {
    value: 'tba',
    label: 'To be announced',
    icon: ClockIcon,
    description: 'Ubicación por anunciar'
  }
]

export const EventsCreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: '',
      description: '',
      location: '',
      location_type: 'venue',
      cover_image_url: '',
      status: EventStatus.DRAFT
    }
  })

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Datos del evento:', data)
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error al crear evento:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedLocationType = form.watch('location_type')

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-balance">
          Create an event with AI
        </h1>
        <p className="text-muted-foreground text-pretty">
          Answer a few questions about your event and our AI creation tool will
          use internal data to build an event page. You can still{' '}
          <Button variant="link" className="p-0 h-auto text-blue-600">
            create an event without AI
          </Button>
          .
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nombre del evento */}
          <Card>
            <CardHeader>
              <CardTitle>What's the name of your event?</CardTitle>
              <CardDescription>
                This will be your event's title. Your title will be used to help
                create your event's summary, description, category, and tags -
                so be specific!
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
                        placeholder="Event title *"
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
          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
              <CardDescription>
                Provide more details about your event to help attendees
                understand what to expect.
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
                        placeholder="Tell people more about your event..."
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
          <Card>
            <CardHeader>
              <CardTitle>When does your event start and end?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
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
                                <span>15/10/2025 — 23/10/2025</span>
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
                      <FormLabel>End Date</FormLabel>
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
                                <span>Select end date</span>
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

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle>Where is it located?</CardTitle>
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
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Location *"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedLocationType === 'online' && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Meeting link or platform details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedLocationType === 'venue' && (
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    Add location details
                  </Button>

                  {/* Placeholder para el mapa */}
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                      <p>Map will appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* URL de imagen de portada */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Add a cover image to make your event more attractive (optional).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="cover_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image that represents your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Estado del evento */}
          <Card>
            <CardHeader>
              <CardTitle>Event Status</CardTitle>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select event status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Draft</Badge>
                            <span>Save as draft</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="PUBLISHED">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Published</Badge>
                            <span>Publish immediately</span>
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
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
