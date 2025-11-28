// components/scheduler/activity-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils' // Tu utilidad de shadcn
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
  EventActivityForm
} from '@/modules/events/schemas' // Tu path
import { EventStatus } from '@/types' // Tus tipos
import { EventMode } from '@/modules/events/schemas'

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
  // Configuración del formulario con valores por defecto inteligentes
  const form = useForm<EventActivityForm>({
    resolver: zodResolver(eventActivitySchema),
    defaultValues: {
      event_id: eventId,
      activity_name: initialData?.activity_name || '',
      description: initialData?.description || '',
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
      custom_location: initialData?.custom_location || '',
      id: initialData?.id // Importante para updates
    }
  })

//   const errors = form.formState.errors
//   console.log('Form Errors:', errors)
  const handleDelete = async () => {
    if (initialData?.id && onDelete) {
      await onDelete(initialData.id)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la Actividad */}
        <FormField
          control={form.control}
          name="activity_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la actividad</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Taller de React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Fecha Inicio - Simplificado, idealmente usarías un TimePicker combo */}
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
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP p') // Fecha y hora
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
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                    {/* Nota: Shadcn Calendar por defecto no tiene selector de hora. 
                         Para producción, recomiendo instalar un TimePicker component o inputs de tipo 'datetime-local' */}
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':')
                          const newDate = new Date(field.value)
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
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP p')
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
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':')
                          const newDate = new Date(field.value)
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

        {/* Modalidad y Estado */}
        <div className="grid grid-cols-2 gap-4">
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
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione modalidad" />
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
          {/* ... Puedes agregar el campo de Estado aquí similar al de Modalidad ... */}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles de la actividad..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2 sm:gap-0">
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

          <div className="flex gap-2">
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
