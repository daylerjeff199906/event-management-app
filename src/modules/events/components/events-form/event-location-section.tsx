// components/event-location-section.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { UseFormReturn } from 'react-hook-form'
import { EventFormData } from '@/modules/events/schemas'
import { EventModeSelector } from './event-mode-selector'
import { LocationSelector } from '../location-selector'
import { MeetingUrlInput } from '../meeting-url-input'
import { FormField } from '@/components/ui/form'
import { useEffect } from 'react'
import { AddressForm } from '../address-form'

interface EventLocationSectionProps {
  form: UseFormReturn<EventFormData>
}

export const EventLocationSection = ({ form }: EventLocationSectionProps) => {
  const eventMode = form.watch('event_mode')

  //   Limpiar campos cuando cambia el tipo de evento
  const handleEventModeChange = (value: string) => {
    form.setValue('event_mode', value as EventFormData['event_mode'])

    // Limpiar campos no relevantes
    if (value === 'VIRTUAL') {
      form.setValue('address_id', null)
      form.setValue('custom_location', null)
    } else if (value === 'PRESENCIAL') {
      form.setValue('meeting_url', null)
    }
  }

  useEffect(() => {
    handleEventModeChange(eventMode || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventMode])

  return (
    <Card className="shadow-none border border-gray-200">
      <CardHeader>
        <CardTitle>¿Dónde se realizará tu evento?</CardTitle>
        <CardDescription>
          Selecciona el tipo de evento y proporciona la información de ubicación
          correspondiente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de tipo de evento */}
        <FormField
          control={form.control}
          name="event_mode"
          render={({}) => <EventModeSelector form={form} />}
        />

        {/* Ubicación presencial (solo para PRESENCIAL e HÍBRIDO) */}
        {(eventMode === 'PRESENCIAL' || eventMode === 'HIBRIDO') && (
          <LocationSelector form={form} />
        )}

        {/* Meeting URL (solo para VIRTUAL e HÍBRIDO) */}
        {(eventMode === 'VIRTUAL' || eventMode === 'HIBRIDO') && (
          <MeetingUrlInput form={form} />
        )}

        {/*Add location details if needed*/}
        {(eventMode === 'PRESENCIAL' || eventMode === 'HIBRIDO') && (
          <AddressForm />
        )}
      </CardContent>
    </Card>
  )
}
