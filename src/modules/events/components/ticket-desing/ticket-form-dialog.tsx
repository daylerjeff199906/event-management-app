import React, { useState, useEffect } from 'react'
import { Loader2, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { EventTicketform } from '@/modules/events/schemas'

interface TicketFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<EventTicketform>) => void
  initialData?: EventTicketform | null
  isPending: boolean
}

export const TicketFormDialog: React.FC<TicketFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isPending
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    totalCapacity: '',
    description: ''
  })

  // Resetea o llena el formulario cuando abre/cierra o cambia la data
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        totalCapacity: initialData.quantity_total.toString(),
        description: initialData.description || ''
      })
    } else if (!open) {
      setFormData({ name: '', price: '', totalCapacity: '', description: '' })
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name.toUpperCase(),
      price: parseFloat(formData.price),
      quantity_total: parseInt(formData.totalCapacity),
      description: formData.description
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 uppercase">
            <Ticket className="w-5 h-5" />
            {initialData ? 'Editar Ticket' : 'Nuevo Ticket'}
          </DialogTitle>
          <DialogDescription>
            Configura los detalles de la entrada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              Nombre
            </Label>
            <Input
              id="name"
              className="font-bold uppercase"
              placeholder="EJ. GENERAL"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="desc"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              Descripción
            </Label>
            <Input
              id="desc"
              placeholder="Detalles..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="capacity"
                className="text-xs font-bold text-gray-500 uppercase"
              >
                Capacidad
              </Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.totalCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, totalCapacity: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="price"
                className="text-xs font-bold text-gray-500 uppercase"
              >
                Precio (S/)
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                className="font-bold"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formData.name}
              className="bg-black text-white"
            >
              {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {initialData ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
