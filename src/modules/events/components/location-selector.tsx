// components/location-selector.tsx
import { useState } from 'react'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UseFormReturn } from 'react-hook-form'
import { EventFormData } from '@/modules/events/schemas'
import { Search, MapPin } from 'lucide-react'
import { LocationSearchModal } from './location-search-modal'

interface LocationSelectorProps {
  form: UseFormReturn<EventFormData>
}

export const LocationSelector = ({ form }: LocationSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const selectedAddressId = form.watch('address_id')
  const customLocation = form.watch('custom_location')

  const handleLocationSelect = (
    addressId: string | null,
    customAddress: string | null
  ) => {
    if (addressId) {
      form.setValue('address_id', addressId)
      form.setValue('custom_location', null)
    } else if (customAddress) {
      form.setValue('custom_location', customAddress)
      form.setValue('address_id', null)
    }
    setIsModalOpen(false)
  }

  const clearLocation = () => {
    form.setValue('address_id', null)
    form.setValue('custom_location', null)
  }

  return (
    <FormItem>
      <FormLabel>Ubicación Presencial *</FormLabel>
      <div className="space-y-2">
        {/* Input de visualización */}
        <div className="flex gap-2">
          <FormControl>
            <Input
              placeholder="Buscar ubicación..."
              value={
                customLocation ||
                (selectedAddressId ? 'Ubicación seleccionada' : '')
              }
              readOnly
              className="flex-1"
            />
          </FormControl>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          {(selectedAddressId || customLocation) && (
            <Button type="button" variant="outline" onClick={clearLocation}>
              <MapPin className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Modal de búsqueda */}
        <LocationSearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLocationSelect={handleLocationSelect}
          currentSearch={customLocation || ''}
        />

        <FormMessage />
      </div>
    </FormItem>
  )
}
