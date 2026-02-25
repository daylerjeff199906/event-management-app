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
import { Upload, X, ImageIcon, Check, Star, Trash2, CloudUpload, GripVertical } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { addEventImage } from '@/services/events.services'
import { toast } from 'react-toastify'

interface EventImage {
  id?: string
  image_url: string
  is_main: boolean
}

interface ImageUploadProps {
  eventId?: string
  images?: EventImage[]
  onImagesChange?: (images: EventImage[]) => void
  maxImages?: number
}

export default function ImageUpload({
  eventId,
  images = [],
  onImagesChange,
  maxImages = 5
}: ImageUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo debe ser menor a 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setIsModalOpen(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDrop = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragging(false)

    // Check if it's a file drop
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      if (file) handleFile(file)
      return
    }

    // Handled by handleDropReorder for index-based drops
  }, [handleFile])

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
      // Only show upload drag state if files are being dragged
      if (event.dataTransfer.types.includes('Files')) {
        setIsDragging(true)
      }
    },
    []
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
      setIsDragging(false)
    },
    []
  )

  // Reordering logic
  const handleDragStartReorder = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOverReorder = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDropReorder = (event: React.DragEvent, targetIndex: number) => {
    event.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      return
    }

    const updatedImages = [...images]
    const [movedItem] = updatedImages.splice(draggedIndex, 1)
    updatedImages.splice(targetIndex, 0, movedItem)

    onImagesChange?.(updatedImages)
    setDraggedIndex(null)
  }

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

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen a almacenamiento')
      }

      const { url } = await uploadResponse.json()

      const newImages = [...images]
      const isFirst = newImages.length === 0

      let imageData: EventImage = {
        image_url: url,
        is_main: isFirst
      }

      // Auto-save to DB if eventId is provided
      if (eventId) {
        const dbResponse = await addEventImage({
          event_id: eventId,
          image_url: url,
          is_main: isFirst
        })

        if (dbResponse.error) {
          throw new Error('Error al registrar la imagen en la base de datos')
        }

        if (dbResponse.data) {
          imageData = {
            ...imageData,
            id: dbResponse.data.id
          }
        }
      }

      newImages.push(imageData)
      onImagesChange?.(newImages)
      setIsModalOpen(false)
      setSelectedImage(null)
      toast.success('Imagen subida correctamente')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
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
    <div
      className={cn(
        "w-full rounded-2xl transition-all duration-300",
        isDragging && "ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-900/10 p-4"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            draggable
            onDragStart={() => handleDragStartReorder(index)}
            onDragOver={(e) => handleDragOverReorder(e, index)}
            onDrop={(e) => handleDropReorder(e, index)}
            className={cn(
              "group relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-video shadow-sm cursor-move",
              image.is_main ? "border-primary ring-2 ring-primary/20" : "border-muted",
              draggedIndex === index && "opacity-50 grayscale"
            )}
          >
            <img
              src={image.image_url}
              alt={`Event image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
            />

            {/* Drag Handle Icon */}
            <div className="absolute top-2 left-2 z-10 p-1 rounded-md bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {image.is_main ? (
                <Badge variant="default" className="bg-primary hover:bg-primary/90 shadow-lg border-none">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Principal
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs font-semibold backdrop-blur-md bg-white/20 text-white border-white/30 hover:bg-white/40"
                  onClick={() => handleSetMain(index)}
                  type="button"
                >
                  Establecer principal
                </Button>
              )}
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleUploadClick}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-300 aspect-video",
              isDragging
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-muted-foreground/20 bg-muted/10 hover:bg-muted/30 hover:border-muted-foreground/40"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300",
              isDragging ? "bg-primary text-white scale-110" : "bg-white dark:bg-zinc-900 border text-muted-foreground"
            )}>
              {isDragging ? <CloudUpload className="h-6 w-6 animate-bounce" /> : <Upload className="h-6 w-6" />}
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">
                {isDragging ? '¡Suéltalo aquí!' : 'Sube tus imágenes'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {images.length} de {maxImages} permitidas
              </div>
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

      <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> JPEG, PNG, WEBP</span>
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Máx. 5MB</span>
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Formato 16:9</span>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <DialogHeader className="p-6 bg-zinc-950 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Ajustar tu imagen
            </DialogTitle>
          </DialogHeader>

          <div className="p-1 bg-zinc-100 dark:bg-zinc-950">
            {selectedImage && (
              <div className="relative w-full aspect-video bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                <Cropper className="w-full" image={selectedImage}>
                  <CropperImage />
                  <CropperCropArea className="aspect-video" />
                </Cropper>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-white dark:bg-zinc-900 gap-2">
            <Button variant="outline" onClick={handleCloseModal} type="button" className="rounded-full px-6">
              Cancelar
            </Button>
            {selectedImage && (
              <Button onClick={handleSave} disabled={isUploading} type="button" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-primary/20">
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subiendo...
                  </span>
                ) : 'Guardar imagen'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
