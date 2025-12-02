'use client'

import { useState, useMemo } from 'react' // Agregar useEffect
import { Address, EventFormData, addressSchemaForm } from '../schemas'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, MapPin, Trash2, Save } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { upsertAddress, deleteAddress } from '@/services/address.services'
import { updateEvent } from '@/services/events.services'
import { toast } from 'react-toastify'
import { cn } from '@/lib/utils'
import { PERU_LOCATIONS, ubigeoUtils } from '../data/ubigeo'

interface AddressFormProps {
  defaultValues?: Partial<Address> | null
  className?: string
  isLoading?: boolean
  form: UseFormReturn<EventFormData>
}

// Función mejorada para normalizar nombres
const normalizeName = (name: string | null | undefined): string => {
  if (!name) return ''
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

// Función para buscar ID por nombre normalizado
const findUbigeoIdByName = (
  normalizedName: string,
  list: Array<{ id: string; name: string }>
): string => {
  if (!normalizedName) return ''

  return (
    list.find((item) => normalizeName(item.name) === normalizedName)?.id || ''
  )
}

export function AddressForm({
  defaultValues,
  className,
  isLoading: parentLoading = false,
  form
}: AddressFormProps) {
  const [showLocationDetails, setShowLocationDetails] = useState<boolean>(
    !!defaultValues
  )
  const [isSaving, setIsSaving] = useState(false)

  const [addressData, setAddressData] = useState<Partial<Address>>({
    country: 'Perú',
    department: defaultValues?.department || '',
    province: defaultValues?.province || '',
    street: defaultValues?.street || '',
    district: defaultValues?.district || '',
    postal_code: defaultValues?.postal_code || '',
    reference: defaultValues?.reference || '',
    ...defaultValues
  })

  // IDs para controlar la UI de los Selects
  const [selectedDept, setSelectedDept] = useState<string>(
    defaultValues?.department
      ? findUbigeoIdByName(
          normalizeName(defaultValues.department),
          PERU_LOCATIONS.departments
        )
      : ''
  )
  const [selectedProv, setSelectedProv] = useState<string>(
    defaultValues?.province
      ? findUbigeoIdByName(
          normalizeName(defaultValues.province),
          PERU_LOCATIONS.provinces
        )
      : ''
  )
  console.log('selectedProv:', selectedProv)
  const [selectedDist, setSelectedDist] = useState<string>(
    defaultValues?.district
      ? findUbigeoIdByName(
          normalizeName(defaultValues.district),
          PERU_LOCATIONS.districts
        )
      : ''
  )
  console.log('selectedDist:', selectedDist)

  // Listas calculadas
  const availableProvinces = useMemo(() => {
    return selectedDept
      ? ubigeoUtils.getProvincesByDepartment(selectedDept)
      : []
  }, [selectedDept])

  const availableDistricts = useMemo(() => {
    return selectedProv ? ubigeoUtils.getDistrictsByProvince(selectedProv) : []
  }, [selectedProv])

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeptChange = (deptId: string) => {
    const dept = PERU_LOCATIONS.departments.find((d) => d.id === deptId)

    setSelectedDept(deptId)
    setSelectedProv('')
    setSelectedDist('')

    setAddressData((prev) => ({
      ...prev,
      department: dept ? normalizeName(dept.name) : '',
      province: '',
      district: ''
    }))
  }

  const handleProvChange = (provId: string) => {
    const prov = availableProvinces.find((p) => p.id === provId)

    setSelectedProv(provId)
    setSelectedDist('')

    setAddressData((prev) => ({
      ...prev,
      province: prov ? normalizeName(prov.name) : '',
      district: ''
    }))
  }

  const handleDistChange = (distId: string) => {
    const dist = availableDistricts.find((d) => d.id === distId)

    setSelectedDist(distId)

    setAddressData((prev) => ({
      ...prev,
      district: dist ? normalizeName(dist.name) : ''
    }))
  }

  const handleSaveAddress = async () => {
    try {
      setIsSaving(true)

      // Validación
      if (
        !addressData.street ||
        !addressData.province ||
        !addressData.department
      ) {
        toast.error('Por favor completa: Dirección, Departamento y Provincia')
        return
      }

      // Payload final
      const payload = addressSchemaForm.parse({
        ...addressData,
        country: 'Perú'
      })

      const savedAddress = await upsertAddress({
        address: payload,
        id: form.getValues('address_id') || null
      })

      const finalData = savedAddress.data
      if (!finalData?.id) throw new Error('Error ID')

      const newAddressId = finalData.id

      form.setValue('address_id', newAddressId, {
        shouldValidate: true,
        shouldDirty: true
      })
      setAddressData(finalData)

      const eventId = form.getValues('id')
      if (eventId) {
        const updateResponse = await updateEvent(eventId, {
          address_id: newAddressId,
          custom_location: null
        })
        if (updateResponse.error) throw updateResponse.error
        toast.success('Dirección guardada correctamente')
      } else {
        toast.success('Dirección guardada')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveAddress = async () => {
    try {
      setIsSaving(true)
      const currentAddressId = form.getValues('address_id')
      const eventId = form.getValues('id')

      form.setValue('address_id', null, {
        shouldValidate: true,
        shouldDirty: true
      })

      if (eventId) await updateEvent(eventId, { address_id: null })
      if (currentAddressId) await deleteAddress(currentAddressId)

      setShowLocationDetails(false)
      setAddressData({
        country: 'Perú',
        department: '',
        province: '',
        street: '',
        district: '',
        postal_code: '',
        reference: ''
      })
      setSelectedDept('')
      setSelectedProv('')
      setSelectedDist('')
    } catch (error) {
      const err = error as Error
      toast.error(`Error al eliminar: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn('w-full transition-all', className)}>
      {!showLocationDetails && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 h-14 hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setShowLocationDetails(true)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Agregar ubicación presencial al evento
        </Button>
      )}

      {showLocationDetails && (
        <Card className="border shadow-none animate-in fade-in slide-in-from-top-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Ubicación del Evento
                </CardTitle>
                <CardDescription>
                  Configura dónde se realizará el evento.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                onClick={handleRemoveAddress}
                disabled={isSaving || parentLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Quitar
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* País y Departamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>País</Label>
                <Input
                  value="Perú"
                  disabled
                  className="bg-muted text-muted-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Departamento / Región <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedDept}
                  onValueChange={handleDeptChange}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={isSaving ? 'Cargando...' : 'Selecciona...'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {PERU_LOCATIONS.departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Provincia y Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Provincia <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedProv.toString()}
                  onValueChange={handleProvChange}
                  disabled={!selectedDept || isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedDept
                          ? 'Selecciona departamento primero'
                          : isSaving
                          ? 'Cargando...'
                          : 'Selecciona...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProvinces.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id}>
                        {prov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Distrito</Label>
                <Select
                  value={selectedDist.toString()}
                  onValueChange={handleDistChange}
                  disabled={!selectedProv || isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedProv
                          ? 'Selecciona provincia primero'
                          : isSaving
                          ? 'Cargando...'
                          : 'Selecciona...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((dist) => (
                      <SelectItem key={dist.id} value={dist.id.toString()}>
                        {dist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dirección Exacta */}
            <div className="space-y-2">
              <Label>
                Dirección (Calle, Av., Nro){' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ej. Av. Abelardo Quiñones Km 2.5"
                value={addressData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                disabled={isSaving}
              />
            </div>

            {/* Referencia y CP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Referencia (Opcional)</Label>
                <Input
                  placeholder="Ej. Frente al gobierno regional..."
                  value={addressData.reference || ''}
                  onChange={(e) =>
                    handleInputChange('reference', e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label>Código Postal</Label>
                <Input
                  placeholder="Ej. 16001"
                  value={addressData.postal_code || ''}
                  onChange={(e) =>
                    handleInputChange('postal_code', e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={handleSaveAddress}
                disabled={
                  isSaving ||
                  !selectedDept ||
                  !selectedProv ||
                  !addressData.street
                }
                className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Dirección
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
