'use client'

import { useState, useEffect } from 'react'
import { Address, EventFormData, addressSchemaForm } from '../schemas' // Asegúrate de importar tus schemas
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
  // Estado local para controlar si se muestra el formulario
  const [showLocationDetails, setShowLocationDetails] = useState<boolean>(false)

  // Estado de carga local para operaciones de guardado/borrado de dirección
  const [isSaving, setIsSaving] = useState(false)

  // Estado del formulario de dirección
  const [addressData, setAddressData] = useState<Partial<Address>>({
    country: 'Perú',
    state: '', // Departamento
    city: '', // Provincia
    address_line1: '', // Dirección exacta
    address_line2: '', // Distrito (o referencia)
    postal_code: '',
    ...defaultValues
  })

  // Estados para selectores en cascada
  const [selectedDept, setSelectedDept] = useState<string>('')
  const [selectedProv, setSelectedProv] = useState<string>('')
  const [selectedDist, setSelectedDist] = useState<string>('')

  // Efecto: Si ya existe un ID de dirección en el formulario padre o defaultValues, mostrar el form
  useEffect(() => {
    const currentAddressId = form.getValues('address_id')
    if (
      currentAddressId ||
      (defaultValues && Object.keys(defaultValues).length > 0)
    ) {
      setShowLocationDetails(true)
      // Aquí podrías lógica para pre-llenar los selectores si defaultValues trae la data
      if (defaultValues?.state)
        setSelectedDept(
          findIdByName(PERU_LOCATIONS.departments, defaultValues.state)
        )
      // Nota: Para pre-seleccionar provincia/distrito necesitarías lógica inversa (buscar ID por nombre)
    }
  }, [defaultValues, form])

  // Helper para cambios en inputs de texto
  const handleInputChange = (field: keyof Address, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  // --- LÓGICA DE CASCADA ---

  const handleDeptChange = (deptId: string) => {
    const deptName =
      PERU_LOCATIONS.departments.find((d) => d.id === deptId)?.name || ''
    setSelectedDept(deptId)
    setSelectedProv('') // Reset provincia
    setSelectedDist('') // Reset distrito
    setAddressData((prev) => ({
      ...prev,
      state: deptName,
      city: '',
      address_line2: '' // Usamos address_line2 para guardar el distrito por ahora o referencia
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
      city: provName,
      address_line2: ''
    }))
  }

  const handleDistChange = (distId: string) => {
    const distList =
      PERU_LOCATIONS.districts[
        selectedProv as keyof typeof PERU_LOCATIONS.districts
      ] || []
    const distName = distList.find((d) => d.id === distId)?.name || ''

    setSelectedDist(distId)
    // Guardamos el distrito en address_line2 o concatenado si prefieres.
    // Para este ejemplo, lo pondré en address_line2 para no perder el dato.
    setAddressData((prev) => ({ ...prev, address_line2: distName }))
  }

  // --- ACCIONES ---

  const handleSaveAddress = async () => {
    try {
      setIsSaving(true)

      // Validación simple
      if (
        !addressData.address_line1 ||
        !addressData.city ||
        !addressData.state
      ) {
        toast.error(
          'Por favor completa los campos obligatorios (Dirección, Departamento, Provincia)'
        )
        return
      }

      // Preparar payload
      const payload = addressSchemaForm.parse({
        ...addressData,
        // Asegurar campos opcionales
        country: 'Perú'
      })

      // Llamada al servicio (asumiendo que upsertAddress devuelve la dirección creada/actualizada)
      const savedAddress = await upsertAddress({
        address: payload,
        id: form.getValues('address_id') || null
      })

      if (savedAddress && savedAddress.data?.id) {
        // ACTUALIZAR FORMULARIO PADRE
        form.setValue('address_id', savedAddress.data.id, {
          shouldValidate: true,
          shouldDirty: true
        })

        // Actualizar estado local con la data confirmada
        setAddressData(savedAddress.data)
        toast.success('Dirección guardada y vinculada correctamente')
      } else {
        throw new Error('No se recibió el ID de la dirección')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar la dirección')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveAddress = async () => {
    try {
      setIsSaving(true)
      const currentId = form.getValues('address_id')

      // 1. Desvincular del formulario padre inmediatamente
      form.setValue('address_id', null, {
        shouldValidate: true,
        shouldDirty: true
      })

      // 2. Opcional: Eliminar de la base de datos si existe ID
      if (currentId) {
        // Si la lógica de negocio dice que se borre de la BD:
        await deleteAddress(currentId)
        toast.info('Dirección desvinculada y eliminada')
      } else {
        toast.info('Detalles de dirección removidos')
      }

      // 3. Resetear UI
      setShowLocationDetails(false)
      setAddressData({
        country: 'Perú',
        state: '',
        city: '',
        address_line1: '',
        address_line2: '',
        postal_code: ''
      })
      setSelectedDept('')
      setSelectedProv('')
      setSelectedDist('')
    } catch (error) {
      const err = error as Error
      toast.error(`Error al eliminar la dirección: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper para buscar ID por nombre (utilitario simple)
  const findIdByName = (list: { id: string; name: string }[], name: string) => {
    return list.find((item) => item.name === name)?.id || ''
  }

  return (
    <div className={cn('w-full transition-all', className)}>
      {/* Botón para activar el formulario si está oculto */}
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

      {/* Formulario de Dirección */}
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

            {/* Fila 3: Dirección Exacta */}
            <div className="space-y-2">
              <Label>
                Dirección (Calle, Av., Nro){' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ej. Av. Abelardo Quiñones Km 2.5"
                value={addressData.address_line1 || ''}
                onChange={(e) =>
                  handleInputChange('address_line1', e.target.value)
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
                  value={addressData.instructions || ''}
                  onChange={(e) =>
                    handleInputChange('instructions', e.target.value)
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

            {/* Botón de Guardar independiente */}
            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={handleSaveAddress}
                disabled={
                  isSaving ||
                  !selectedDept ||
                  !selectedProv ||
                  !addressData.address_line1
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
