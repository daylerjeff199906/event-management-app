import React, { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventTicketform } from '@/modules/events/schemas'
import { PRESET_COLORS } from '../../data/types'
import { TicketFormDialog } from './ticket-form-dialog'
import { ConfirmAlertDialog } from '@/components/app/miscellaneous/confirm-alert-dialog'

interface TicketsSectionProps {
  tickets: EventTicketform[]
  onSaveTicket: (
    ticket: Partial<EventTicketform>,
    editingId: string | null
  ) => void
  onDeleteTicket: (id: string) => void
  isPending: boolean
}

export const TicketsSection: React.FC<TicketsSectionProps> = ({
  tickets,
  onSaveTicket,
  onDeleteTicket,
  isPending
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<EventTicketform | null>(
    null
  )
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)

  const handleCreate = () => {
    setEditingTicket(null)
    setIsFormOpen(true)
  }

  const handleEdit = (ticket: EventTicketform) => {
    setEditingTicket(ticket)
    setIsFormOpen(true)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h2 className="text-xl tracking-tight uppercase font-semibold">
            1. Gestión de Entradas
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Define los tipos de entrada y sus precios.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={18} className="mr-2" /> CREAR TICKET
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map((t, idx) => (
          <div
            key={t.id}
            className="flex flex-col md:flex-row border border-black md:h-24 overflow-hidden rounded-lg group transition-all bg-white dark:bg-gray-800"
          >
            <div className="flex-1 p-4 flex items-center gap-4">
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{
                  backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
                }}
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-black text-lg uppercase leading-tight">
                  {t.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {t.description || `${t.quantity_total} personas`}
                </p>
              </div>
            </div>
            <div
              className="w-full md:w-48 text-white flex flex-col items-center justify-center relative py-2 md:py-0"
              style={{
                backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length]
              }}
            >
              <span className="font-bold text-2xl tracking-tight">
                S/{' '}
                {t.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] uppercase font-bold opacity-80 tracking-widest">
                Precio
              </span>
            </div>
            <div className="w-full md:w-40 bg-gray-50 flex items-center justify-center gap-2 py-2 md:py-0 border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <Button
                onClick={() => handleEdit(t)}
                size="icon"
                variant="outline"
                className="rounded-full"
              >
                <Edit size={16} />
              </Button>
              <Button
                onClick={() => setTicketToDelete(t.id!)}
                size="icon"
                variant="destructive"
                className="rounded-full"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            No hay tickets creados.
          </div>
        )}
      </div>

      <TicketFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTicket}
        onSubmit={(data) => {
          onSaveTicket(data, editingTicket?.id || null)
          setIsFormOpen(false)
        }}
        isPending={isPending}
      />

      <ConfirmAlertDialog
        open={!!ticketToDelete}
        onOpenChange={(open) => !open && setTicketToDelete(null)}
        title="¿Eliminar Ticket?"
        description="Esta acción eliminará el ticket y sus zonas asociadas en todos los mapas."
        confirmText="Sí, eliminar"
        confirmVariant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (ticketToDelete) onDeleteTicket(ticketToDelete)
          setTicketToDelete(null)
        }}
      />
    </div>
  )
}
