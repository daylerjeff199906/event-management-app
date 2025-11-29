'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface ConfirmAlertDialogProps {
  /** Controla si el diálogo está abierto */
  open: boolean
  /** Callback cuando se cierra el diálogo */
  onOpenChange: (open: boolean) => void
  /** Título del diálogo */
  title: string
  /** Descripción/mensaje del diálogo */
  description: string
  /** Texto del botón de confirmar */
  confirmText?: string
  /** Texto del botón de cancelar */
  cancelText?: string
  /** Variante del botón de confirmar */
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  /** Callback ejecutado cuando se confirma */
  onConfirm: () => void | Promise<void>
  /** Callback ejecutado cuando se cancela */
  onCancel?: () => void
  /** Imagen opcional a renderizar en el centro */
  imageUrl?: string
  /** Alt text para la imagen */
  imageAlt?: string
  /** Ancho de la imagen en píxeles */
  imageWidth?: number
  /** Alto de la imagen en píxeles */
  imageHeight?: number
  /** Estado de carga durante la confirmación */
  isLoading?: boolean
  /** Deshabilitar el botón de confirmar */
  isDisabled?: boolean
}

export function ConfirmAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'default',
  onConfirm,
  onCancel,
  imageUrl,
  imageAlt = 'Dialog image',
  imageWidth = 80,
  imageHeight = 80,
  isLoading = false,
  isDisabled = false
}: ConfirmAlertDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error('Error en confirmación:', error)
    } finally {
      setIsProcessing(false)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader className="flex flex-col">
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl || '/placeholder.svg'}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="mx-auto"
              />
            </div>
          )}
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className=" text-base">
          {description}
        </AlertDialogDescription>

        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-6">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isProcessing || isLoading}
            className="order-2 sm:order-1 rounded-full"
          >
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || isLoading || isDisabled}
            variant={confirmVariant}
            className="order-1 sm:order-2 rounded-full"
          >
            {isProcessing || isLoading ? 'Procesando...' : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
