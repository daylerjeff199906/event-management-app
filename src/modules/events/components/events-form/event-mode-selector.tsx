// components/event-mode-selector.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { UseFormReturn } from 'react-hook-form'
import { EventFormData } from '@/modules/events/schemas'

interface EventModeSelectorProps {
  form: UseFormReturn<EventFormData>
}

export const EventModeSelector = ({ form }: EventModeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="event_mode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Evento *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el tipo de evento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="PRESENCIAL">Presencial</SelectItem>
              <SelectItem value="VIRTUAL">Virtual</SelectItem>
              <SelectItem value="HIBRIDO">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
