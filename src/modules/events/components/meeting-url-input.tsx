// components/meeting-url-input.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { EventFormData } from '@/modules/events/schemas'

interface MeetingUrlInputProps {
  form: UseFormReturn<EventFormData>
}

export const MeetingUrlInput = ({ form }: MeetingUrlInputProps) => {
  return (
    <FormField
      control={form.control}
      name="meeting_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL de la Reunión Virtual</FormLabel>
          <FormControl>
            <Input
              placeholder="https://meet.google.com/abc-def-ghi"
              type="url"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
