'use client'

import type React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Cropper, CropperCropArea, CropperImage } from '@/components/ui/cropper'
import { Camera, Upload, X } from 'lucide-react'
import type { PutBlobResult } from '@vercel/blob'
import { useState, useRef, useCallback } from 'react'

interface AvatarUploadProps {
  urlImage?: string
  username?: string
  onAvatarChange?: (avatarUrl: string) => void
}

export default function AvatarUpload({
  username = 'John Doe',
  urlImage,
  onAvatarChange
}: AvatarUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 1024 * 1024) {
        alert('El archivo debe ser menor a 1MB')
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

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      alert('El archivo debe ser menor a 1MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
    },
    []
  )

  const handleSave = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    try {
      // En un caso real, aquí procesarías la imagen recortada
      // Por ahora, simplemente convertimos la imagen seleccionada a blob
      const response = await fetch(selectedImage)
      const blob = await response.blob()

      const file = new File([blob], `${username}-avatar.jpg`, {
        type: 'image/jpeg'
      })

      const uploadResponse = await fetch(
        `/api/avatar/upload?filename=${file.name}&override=true`,
        {
          method: 'POST',
          body: file
        }
      )

      const newBlob = (await uploadResponse.json()) as PutBlobResult
      setBlob(newBlob)
      onAvatarChange?.(newBlob.url)

      setIsModalOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-32 h-32 border">
          <AvatarImage
            src={blob?.url || urlImage}
            alt={username}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>

        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-1 -right-0 rounded-full w-8 h-8 p-0 shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col space-y-1">
        <h3 className="text-base font-semibold text-center">
          Actualiza tu foto de perfil
        </h3>
        <p className="text-xs text-gray-500 text-center">
          Sube una imagen en formato JPG, PNG o WEBP. Tamaño máximo 1MB.
        </p>
      </div>
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Avatar</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-xs text-muted-foreground">
                    o haz click para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Máximo 1MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => inputFileRef.current?.click()}
                >
                  Seleccionar archivo
                </Button>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <Cropper className="h-64 w-full" image={selectedImage}>
                    <CropperImage />
                    <CropperCropArea className="rounded-full" />
                  </Cropper>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cambiar imagen
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            {selectedImage && (
              <Button onClick={handleSave} disabled={isUploading}>
                {isUploading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
