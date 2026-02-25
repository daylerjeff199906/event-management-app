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
import { Cropper, CropperCropArea, CropperImage } from '@/components/ui/cropper'
import { Upload, X, ImageIcon, Check, Star, Trash2 } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface EventImage {
  id?: string
  image_url: string
  is_main: boolean
}

interface ImageUploadProps {
  images?: EventImage[]
  onImagesChange?: (images: EventImage[]) => void
  maxImages?: number
}

export default function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 5
}: ImageUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const handleDrop = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo debe ser menor a 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setIsModalOpen(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
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

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'events')

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData
      })
      console.log(uploadResponse)

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen')
      }

      const { url } = await uploadResponse.json()

      const newImages = [...images]
      const isFirst = newImages.length === 0

      newImages.push({
        image_url: url,
        is_main: isFirst
      })

      onImagesChange?.(newImages)
      setIsModalOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = (index: number) => {
    const newImages = [...images]
    const wasMain = newImages[index].is_main
    newImages.splice(index, 1)

    // If we deleted the main image and there are others, set a new main
    if (wasMain && newImages.length > 0) {
      newImages[0].is_main = true
    }

    onImagesChange?.(newImages)
  }

  const handleSetMain = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_main: i === index
    }))
    onImagesChange?.(newImages)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const handleUploadClick = () => {
    inputFileRef.current?.click()
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={cn(
              "group relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-video",
              image.is_main ? "border-blue-500 ring-2 ring-blue-500/20" : "border-muted"
            )}
          >
            <img
              src={image.image_url}
              alt={`Event image ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
                onClick={() => handleDelete(index)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              {image.is_main ? (
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Principal
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleSetMain(index)}
                  type="button"
                >
                  Marcar como principal
                </Button>
              )}
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 hover:bg-muted/30 transition-colors aspect-video"
          >
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Añadir imagen
            </div>
            <div className="text-xs text-muted-foreground/60">
              {images.length} / {maxImages} imagenes
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>• Formatos: JPEG, PNG, WebP</span>
        <span>• Máx. 5MB por imagen</span>
        <span>• Recomendado: 16:9 / 2160x1080px</span>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajustar Imagen</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedImage && (
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex justify-center items-center">
                <Cropper className="max-h-[60vh] w-full" image={selectedImage}>
                  <CropperImage />
                  <CropperCropArea className="aspect-video" />
                </Cropper>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} type="button">
              Cancelar
            </Button>
            {selectedImage && (
              <Button onClick={handleSave} disabled={isUploading} type="button">
                {isUploading ? 'Subiendo...' : 'Guardar imagen'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
