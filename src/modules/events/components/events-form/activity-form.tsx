// components/scheduler/activity-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale' // Importante para español
import {
  CalendarIcon,
  Loader2,
  Trash2,
  MapPin,
  Clock,
  AlignLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { DialogFooter } from '@/components/ui/dialog'
import {
  eventActivitySchema,
  EventActivityForm,
  EventMode
} from '@/modules/events/schemas'
import { EventStatus } from '@/types'

interface ActivityFormProps {
  eventId: string
  initialData?: Partial<EventActivityForm>
  onSubmit: (data: EventActivityForm) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  isSubmitting?: boolean
  onCancel: () => void
}

export function ActivityForm({
  eventId,
  initialData,
  onSubmit,
  onDelete,
  isSubmitting = false,
  onCancel
}: ActivityFormProps) {
  const form = useForm<EventActivityForm>({
    resolver: zodResolver(eventActivitySchema),
    defaultValues: {
      event_id: eventId,
      activity_name: initialData?.activity_name || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : null,
      start_time: initialData?.start_time
        ? new Date(initialData.start_time)
        : new Date(),
      end_time: initialData?.end_time
        ? new Date(initialData.end_time)
        : new Date(new Date().setHours(new Date().getHours() + 1)),
      activity_mode:
        (initialData?.activity_mode as EventMode) || EventMode.PRESENCIAL,
      status: (initialData?.status as EventStatus) || EventStatus.DRAFT,
      meeting_url: initialData?.meeting_url || '',
      custom_location: initialData?.custom_location || '', // Campo de ubicación
      id: initialData?.id
    }
  })

  // --- LOGICA DEL BANNER EN VIVO ---
  // Observamos los valores para actualizar el banner en tiempo real
  const watchedValues = form.watch([
    'activity_name',
    'start_time',
    'end_time',
    'custom_location'
  ])
  const [wName, wStart, wEnd, wLocation] = watchedValues

  const handleDelete = async () => {
    if (initialData?.id && onDelete) {
      await onDelete(initialData.id)
    }
  }

  // Helper para formato en español
  const formatDatePE = (date: Date) => {
    return format(date, "EEEE d 'de' MMMM, h:mm a", { locale: es })
  }

  return (
    <Form {...form}>
      {/* --- BANNER MINIMALISTA (Live Preview) --- */}
      <div className="bg-slate-50 dark:bg-zinc-900 border-primary/70 p-4 mb-6 rounded-lg border transition-all duration-300">
        <div className="flex flex-col space-y-2">
          {/* Título */}
          <h3
            className={cn(
              'font-semibold text-sm leading-none tracking-tight',
              !wName && 'text-muted-foreground italic'
            )}
          >
            {wName || 'Sin título'}
          </h3>

          <div className="text-xs text-muted-foreground space-y-1">
            {/* Fechas */}
            <div className="flex items-center gap-2 ">
              <Clock className="w-3.5 h-3.5 text-primary/60" />
              <span className="capitalize">
                {wStart ? formatDatePE(wStart) : '--'}
              </span>
              <span className="text-xs px-1">hasta</span>
              <span className="capitalize">
                {wEnd ? format(wEnd, 'h:mm a', { locale: es }) : '--'}
              </span>
            </div>

            {/* Ubicación (si existe) */}
            {wLocation && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{wLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la Actividad */}
        <FormField
          control={form.control}
          name="activity_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la actividad</FormLabel>
              <FormControl>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej. Taller de React"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grid de Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fecha Inicio */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal capitalize',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'EEE d, p', { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(newDate) => {
                        // Preservar la hora al cambiar el día
                        if (newDate && field.value) {
                          newDate.setHours(
                            field.value.getHours(),
                            field.value.getMinutes()
                          )
                        }
                        field.onChange(newDate)
                      }}
                      disabled={(date) => date < new Date('1900-01-01')}
                      locale={es} // Calendario en español
                    />
                    <div className="p-3 border-t bg-slate-50 dark:bg-zinc-900">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Modificar Hora
                      </label>
                      <Input
                        type="time"
                        className="w-full"
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':')
                          const newDate = new Date(field.value || new Date())
                          newDate.setHours(parseInt(hours), parseInt(minutes))
                          field.onChange(newDate)
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha Fin */}
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal capitalize',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'EEE d, p', { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(newDate) => {
                        if (newDate && field.value) {
                          newDate.setHours(
                            field.value.getHours(),
                            field.value.getMinutes()
                          )
                        }
                        field.onChange(newDate)
                      }}
                      locale={es}
                    />
                    <div className="p-3 border-t bg-slate-50 dark:bg-zinc-900">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Modificar Hora
                      </label>
                      <Input
                        type="time"
                        className="w-full"
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':')
                          const newDate = new Date(field.value || new Date())
                          newDate.setHours(parseInt(hours), parseInt(minutes))
                          field.onChange(newDate)
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Modalidad y Ubicación (Nuevo campo) */}
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="activity_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EventMode.PRESENCIAL}>
                      Presencial
                    </SelectItem>
                    <SelectItem value={EventMode.VIRTUAL}>Virtual</SelectItem>
                    <SelectItem value={EventMode.HIBRIDO}>Híbrido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="custom_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lugar / Sala</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ej. Auditorio A"
                      className="pl-9"
                      {...field}
                      value={field.value || ''}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles de la actividad..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2 sm:gap-0 mt-4 flex flex-col sm:flex-row sm:justify-between">
          {initialData?.id && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {initialData?.id ? 'Actualizar' : 'Crear Actividad'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
