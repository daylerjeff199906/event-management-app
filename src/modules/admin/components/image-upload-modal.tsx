'use client'

import type React from 'react'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImageUploadModalProps {
  trigger: React.ReactNode
  defaultImage?: string
  onUpload: (imageUrl: string) => void
  title?: string
  description?: string
  folder?: string
}

export function ImageUploadModal({
  trigger,
  defaultImage,
  onUpload,
  title = 'Subir Imagen',
  description = 'Selecciona una imagen para subir o arrastra y suelta aquí',
  folder = 'institutions'
}: ImageUploadModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    defaultImage || null
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when modal opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setSelectedImage(defaultImage || null)
      setSelectedFile(null)
      setIsDragOver(false)
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo debe ser menor a 5MB')
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith('image/'))

      if (imageFile) {
        handleFileSelect(imageFile)
      }
    },
    [handleFileSelect]
  )

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle upload action
  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Subir la imagen al API con el parámetro folder=institutions
      const response = await fetch(
        `/api/images/upload?filename=${selectedFile.name}&folder=${folder}&override=true`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      const blob = await response.json()

      // Llamar a la función onUpload con la URL de la imagen
      onUpload(blob.url)
      setIsOpen(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Preview */}
          {selectedImage && (
            <div className="relative">
              <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden border">
                <img
                  src={selectedImage || '/placeholder.svg'}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : selectedImage
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Seleccionar archivo
                  </span>
                  <span className="text-sm text-gray-500">
                    {' '}
                    o arrastra y suelta
                  </span>
                </Label>
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedImage || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
