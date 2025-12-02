'use client'

import { useState, useEffect } from 'react'
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
import {
  upsertAddress,
  deleteAddress,
  getAddressById
} from '@/services/address.services'
import { updateEvent } from '@/services/events.services'
import { toast } from 'react-toastify'
import { cn } from '@/lib/utils'
import { PERU_LOCATIONS } from '../data/ubigeo'

interface AddressFormProps {
  defaultValues?: Partial<Address> | null
  className?: string
  isLoading?: boolean
  form: UseFormReturn<EventFormData>
}

export function AddressForm({
  defaultValues,
  className,
  isLoading: parentLoading = false,
  form
}: AddressFormProps) {
  const [showLocationDetails, setShowLocationDetails] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState(false)

  // 1. ESTADO ACTUALIZADO CON NUEVOS NOMBRES
  const [addressData, setAddressData] = useState<Partial<Address>>({
    country: 'Perú',
    department: '', // Antes: state
    province: '', // Antes: city
    street: '', // Antes: address_line1
    district: '', // Antes: address_line2
    postal_code: '',
    reference: '', // Antes: instructions
    ...defaultValues
  })

  const [selectedDept, setSelectedDept] = useState<string>('')
  const [selectedProv, setSelectedProv] = useState<string>('')
  const [selectedDist, setSelectedDist] = useState<string>('')

  // 2. EFECTO ACTUALIZADO PARA MAPEAR LOS NUEVOS CAMPOS
  useEffect(() => {
    const addressId = form.getValues('address_id') || defaultValues?.id

    // Verificar si hay datos por defecto usando los nuevos nombres
    const hasDefaultData = defaultValues?.department && defaultValues?.province

    if (!addressId && !hasDefaultData) return

    setShowLocationDetails(true)

    let mounted = true
    const fetchAndSetData = async () => {
      try {
        let data = defaultValues || {}

        if (addressId) {
          setIsSaving(true)
          const res = await getAddressById(addressId)
          if (res?.data) data = res.data
        }

        if (!mounted) return

        setAddressData(data)

        // Helper de búsqueda
        const findIdByName = (
          list: { id: string; name: string }[],
          nameToFind: string | null | undefined
        ) => {
          if (!nameToFind) return ''
          const normalizedName = nameToFind.trim().toLowerCase()
          const item = list.find(
            (i) => i.name.trim().toLowerCase() === normalizedName
          )
          return item ? item.id : ''
        }

        // --- RECONSTRUIR CASCADA CON NUEVOS CAMPOS ---

        // A. Departamento (data.department)
        const deptId = findIdByName(PERU_LOCATIONS.departments, data.department)
        setSelectedDept(deptId)

        // B. Provincia (data.province)
        let provId = ''
        if (deptId) {
          const provList =
            PERU_LOCATIONS.provinces[
              deptId as keyof typeof PERU_LOCATIONS.provinces
            ] || []
          provId = findIdByName(provList, data.province)
          setSelectedProv(provId)
        }

        // C. Distrito (data.district)
        if (provId) {
          const distList =
            PERU_LOCATIONS.districts[
              provId as keyof typeof PERU_LOCATIONS.districts
            ] || []
          const distId = findIdByName(distList, data.district)
          setSelectedDist(distId)
        }
      } catch (err) {
        console.error(err)
        toast.error('Error al cargar los detalles de la dirección')
      } finally {
        if (mounted) setIsSaving(false)
      }
    }

    fetchAndSetData()

    return () => {
      mounted = false
    }
  }, [form, defaultValues, ])

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  // --- HANDLERS ACTUALIZADOS ---

  const handleDeptChange = (deptId: string) => {
    const deptName =
      PERU_LOCATIONS.departments.find((d) => d.id === deptId)?.name || ''
    setSelectedDept(deptId)
    setSelectedProv('')
    setSelectedDist('')
    setAddressData((prev) => ({
      ...prev,
      department: deptName, // Guardamos como department
      province: '',
      district: ''
    }))
  }

  const handleProvChange = (provId: string) => {
    const provList =
      PERU_LOCATIONS.provinces[
        selectedDept as keyof typeof PERU_LOCATIONS.provinces
      ] || []
    const provName = provList.find((p) => p.id === provId)?.name || ''
    setSelectedProv(provId)
    setSelectedDist('')
    setAddressData((prev) => ({
      ...prev,
      province: provName, // Guardamos como province
      district: ''
    }))
  }

  const handleDistChange = (distId: string) => {
    const distList =
      PERU_LOCATIONS.districts[
        selectedProv as keyof typeof PERU_LOCATIONS.districts
      ] || []
    const distName = distList.find((d) => d.id === distId)?.name || ''
    setSelectedDist(distId)
    setAddressData((prev) => ({ ...prev, district: distName })) // Guardamos como district
  }

  // --- GUARDADO ---
  const handleSaveAddress = async () => {
    try {
      setIsSaving(true)

      // Validación con nuevos campos
      if (
        !addressData.street ||
        !addressData.province ||
        !addressData.department
      ) {
        toast.error('Por favor completa: Dirección, Departamento y Provincia')
        return
      }

      const payload = addressSchemaForm.parse({
        ...addressData,
        country: 'Perú'
      })

      const savedAddress = await upsertAddress({
        address: payload,
        id: form.getValues('address_id') || null
      })

      // Verificación segura del retorno
      const finalData = savedAddress.data
      if (!finalData?.id) throw new Error('Error al obtener ID de la dirección')

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
        toast.success('Dirección guardada y evento actualizado correctamente')
      } else {
        toast.success('Dirección guardada. Finaliza creando el evento.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la dirección')
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

      if (eventId) {
        await updateEvent(eventId, { address_id: null })
        toast.info('Dirección desvinculada del evento')
      }

      if (currentAddressId) {
        await deleteAddress(currentAddressId)
      }

      setShowLocationDetails(false)
      // Reset con nuevos campos
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
      toast.error(`Error: ${err.message}`)
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
                Quitar ubicación
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Fila 1: País y Departamento */}
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
                    <SelectValue placeholder="Selecciona..." />
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

            {/* Fila 2: Provincia y Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Provincia <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedProv}
                  onValueChange={handleProvChange}
                  disabled={!selectedDept || isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      PERU_LOCATIONS.provinces[
                        selectedDept as keyof typeof PERU_LOCATIONS.provinces
                      ] || []
                    ).map((prov) => (
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
                  value={selectedDist}
                  onValueChange={handleDistChange}
                  disabled={!selectedProv || isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      PERU_LOCATIONS.districts[
                        selectedProv as keyof typeof PERU_LOCATIONS.districts
                      ] || []
                    ).map((dist) => (
                      <SelectItem key={dist.id} value={dist.id}>
                        {dist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fila 3: Dirección Exacta (STREET) */}
            <div className="space-y-2">
              <Label>
                Dirección (Calle, Av., Nro){' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ej. Av. Abelardo Quiñones Km 2.5"
                value={addressData.street || ''} // Actualizado
                onChange={
                  (e) => handleInputChange('street', e.target.value) // Actualizado
                }
                disabled={isSaving}
              />
            </div>

            {/* Fila 4: Referencia y Código Postal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Referencia (Opcional)</Label>
                <Input
                  placeholder="Ej. Frente al gobierno regional..."
                  value={addressData.reference || ''} // Actualizado (reference)
                  onChange={
                    (e) => handleInputChange('reference', e.target.value) // Actualizado
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
                  !addressData.street // Actualizado
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
