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
import { Upload, X, ImageIcon } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

interface ImageUploadProps {
  urlImage?: string
  title?: string
  onImageChange?: (imageUrl: string) => void
  showExamples?: boolean
}

export default function ImageUpload({
  urlImage,
  onImageChange,
  showExamples = true
}: ImageUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showExamplesState, setShowExamplesState] = useState(showExamples)

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
        setShowExamplesState(false)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
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
      setShowExamplesState(false)
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
        throw new Error('Error al subir la imagen')
      }

      const { url } = await uploadResponse.json()
      setImageUrl(url)
      onImageChange?.(url)

      setIsModalOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const handleUploadClick = () => {
    inputFileRef.current?.click()
    setShowExamplesState(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Imágen</h2>
        {showExamplesState && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-blue-600">✨</span>
            <span className="font-medium">Pro tip:</span>
            <span>
              Usa fotos que transmitan el ambiente, y evita texto superpuesto
              que distraiga.
            </span>
            <button
              className="text-blue-600 hover:underline ml-1"
              onClick={() => setShowExamplesState(false)}
            >
              Ver ejemplos →
            </button>
          </div>
        )}
      </div>

      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center space-y-6 bg-muted/20"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {imageUrl || urlImage ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-80 rounded-lg overflow-hidden border">
              <img
                src={imageUrl || urlImage}
                alt="Imagen subida"
                className="w-full h-full object-cover"
              />
              <Button
                size="sm"
                type="button"
                variant="secondary"
                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                Arrastra y suelta una imagen o
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleUploadClick}
              className="px-8 bg-transparent"
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Imagen
            </Button>
          </>
        )}

        <input
          ref={inputFileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground justify-center">
        <span>• Tamaño recomendado: 2160 x 1080px</span>
        <span>• Tamaño máximo: 5MB</span>
        <span>• Formatos soportados: JPEG, PNG</span>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Imagen</DialogTitle>
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
                    Máximo 5MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => inputFileRef.current?.click()}
                >
                  Seleccionar archivo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <Cropper className="h-64 w-96" image={selectedImage}>
                    <CropperImage />
                    <CropperCropArea />
                  </Cropper>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                    type="button"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cambiar imagen
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} type="button">
              Cancelar
            </Button>
            {selectedImage && (
              <Button onClick={handleSave} disabled={isUploading} type="button">
                {isUploading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
