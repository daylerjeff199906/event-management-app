'use client'

import { useState } from 'react'
import { Address } from '../schemas'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AddressFormProps {
  defaultValues?: Partial<Address>
  className?: string
  onChange?: (address: Address) => void
  onChangeEdit?: (value: boolean) => void
}

export function AddressForm({
  defaultValues = {},
  className,
  onChange,
  onChangeEdit
}: AddressFormProps) {
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

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = {
        ...address,
        [field]: e.target.value
      }
      setAddress(newAddress)
      if (onChange) {
        onChange(newAddress)
        if (onChangeEdit) onChangeEdit(true)
      }
    }

  return (
    <Card className={cn('border shadow-none', className)}>
      <CardHeader>
        <CardTitle>Información de dirección</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
