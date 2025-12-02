'use client'
import { useState } from 'react'
import { Address } from '../schemas'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Loader, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AddressFormProps {
  defaultValues?: Partial<Address>
  className?: string
  onSubmit?: (address: Address) => void
  isLoading?: boolean
}

export function AddressForm({
  defaultValues = {},
  className,
  onSubmit,
  isLoading = false
}: AddressFormProps) {
  const [showLocationDetails, setShowLocationDetails] = useState<boolean>(false)
  const [address, setAddress] = useState<Address>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: null,
    longitude: null,
    ...defaultValues
  })

  function handleChange(field: keyof Address) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  }

  return (
    <>
      {!showLocationDetails && (
        <Button
          type="button"
          variant="link"
          className="px-0 text-primary font-semibold h-auto"
          onClick={() => setShowLocationDetails(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar detalles de la dirección
        </Button>
      )}
      {showLocationDetails && (
        <div className="flex flex-col gap-4">
          <Card className={cn('border shadow-none', className)}>
            <CardHeader>
              <CardTitle>Información de dirección</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Dirección línea 1 *</label>
                      <Input
                        placeholder="Calle, número, empresa, c/o"
                        value={address.address_line1 || ''}
                        onChange={handleChange('address_line1')}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Dirección línea 2</label>
                      <Input
                        placeholder="Apartamento, piso, unidad, edificio, etc."
                        value={address.address_line2 || ''}
                        onChange={handleChange('address_line2')}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1">Ciudad *</label>
                      <Input
                        placeholder="Ciudad"
                        value={address.city || ''}
                        onChange={handleChange('city')}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Estado/Provincia</label>
                      <Input
                        placeholder="Estado o provincia"
                        value={address.state || ''}
                        onChange={handleChange('state')}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Código postal *</label>
                      <Input
                        placeholder="Código postal"
                        value={address.postal_code || ''}
                        onChange={handleChange('postal_code')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">País *</label>
                    <Input
                      placeholder="País"
                      value={address.country || ''}
                      onChange={handleChange('country')}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-white text-primary hover:bg-gray-100 border border-primary font-medium rounded-md px-4 py-2 mt-4 text-sm flex gap-2"
                  onClick={() => onSubmit && onSubmit(address)}
                  disabled={isLoading}
                  size="sm"
                >
                  Guardar dirección
                  {isLoading && <Loader className="ml-2 animate-spin" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button
            type="button"
            variant="link"
            className="px-0 text-secondary font-semibold h-auto"
            onClick={() => setShowLocationDetails(false)}
          >
            <Minus className="h-4 w-4 mr-2" />
            No agregar detalles de la dirección
          </Button>
        </div>
      )}
    </>
  )
}
