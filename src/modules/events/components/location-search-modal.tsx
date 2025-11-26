// components/location-search-modal.tsx
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAddressList } from '@/services/address.services'
import { Loader, MapPin, Edit } from 'lucide-react'
import { Address } from '@/types'

interface LocationSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (
    addressId: string | null,
    customAddress: string | null
  ) => void
  currentSearch: string
}

export const LocationSearchModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  currentSearch
}: LocationSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState(currentSearch)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSearchQuery(currentSearch)
  }, [currentSearch])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await getAddressList({ search: searchQuery })
      if (!response.error) {
        setAddresses(response.data || [])
      }
    } catch (error) {
      console.error('Error searching addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseCustomLocation = () => {
    if (searchQuery.trim()) {
      onLocationSelect(null, searchQuery.trim())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buscar Ubicación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <Input
              placeholder="Buscar dirección, lugar o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                'Buscar'
              )}
            </Button>
          </div>

          {/* Resultados */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {/* Opción para usar texto ingresado */}
            {searchQuery.trim() && (
              <div
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={handleUseCustomLocation}
              >
                <Edit className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Usar: {searchQuery}</p>
                  <p className="text-sm text-gray-500">
                    Guardar como texto personalizado
                  </p>
                </div>
              </div>
            )}

            {/* Direcciones existentes */}
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => onLocationSelect(address.id || null, null)}
              >
                <MapPin className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">
                    {address.place_name || address.address_line1}
                  </p>
                  <p className="text-sm text-gray-500">
                    {[address.address_line1, address.city, address.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            ))}

            {addresses.length === 0 && searchQuery && !isLoading && (
              <p className="text-center text-gray-500 py-4">
                No se encontraron direcciones. Usa el texto ingresado arriba.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
