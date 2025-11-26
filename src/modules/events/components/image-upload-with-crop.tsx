// components/image-upload-simple.tsx
'use client'

import type React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Upload, X } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

interface ImageUploadSimpleProps {
  isOpen: boolean
  onClose: () => void
  onImageChange: (imageUrl: string) => void
  currentImageUrl?: string
}

export default function ImageUploadSimple({
  isOpen,
  onClose,
  onImageChange,
  currentImageUrl
}: ImageUploadSimpleProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo debe ser menor a 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const handleSave = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    try {
      const response = await fetch(selectedImage)
      const blob = await response.blob()

      const file = new File([blob], `event-image-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      })

      const uploadResponse = await fetch(
        `/api/images/upload?filename=${file.name}&override=true`,
        {
          method: 'POST',
          body: file
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Error en la subida')
      }

      const newBlob = await uploadResponse.json()
      onImageChange(newBlob.url)

      onClose()
      setSelectedImage(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    onClose()
  }

  return (
    <>
      <input
        ref={inputFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentImageUrl
                ? 'Cambiar imagen del evento'
                : 'Agregar imagen al evento'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!selectedImage ? (
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm font-medium mb-2">
                    Selecciona una imagen para el evento
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Formatos: JPEG, PNG, WebP • Máximo: 5MB
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => inputFileRef.current?.click()}
                  >
                    Elegir archivo
                  </Button>
                </div>

                {currentImageUrl && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Imagen actual:</p>
                    <img
                      src={currentImageUrl}
                      alt="Imagen actual del evento"
                      className="max-h-40 mx-auto rounded"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">
                    Vista previa de la nueva imagen:
                  </p>
                  <img
                    src={selectedImage}
                    alt="Nueva imagen del evento"
                    className="max-h-60 mx-auto rounded"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Elegir otra imagen
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            {selectedImage && (
              <Button onClick={handleSave} disabled={isUploading}>
                {isUploading ? 'Guardando...' : 'Guardar imagen'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
