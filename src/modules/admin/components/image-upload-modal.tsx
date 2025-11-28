'use client'

import type React from 'react'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Edit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PutBlobResult } from '@vercel/blob'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/utils'

interface ImageUploadModalProps {
  defaultImage?: string
  onUpload: (imageUrl: string) => void
  title?: string
  description?: string
  folder?: string
  nameInstitution?: string
}

export function ImageUploadModal({
  defaultImage,
  onUpload,
  title = 'Subir Imagen',
  description = 'Selecciona una imagen para subir o arrastra y suelta aquí',
  folder = 'institutions',
  nameInstitution = 'institution'
}: ImageUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)

  // Reset state when modal opens
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (open) {
      setSelectedImage(defaultImage || null)
      setIsDragOver(false)
    }
  }

  // File select handler (input)
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

  // Drag and drop handlers
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
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
      setIsDragOver(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragOver(false)
    },
    []
  )

  // Upload handler
  const handleUpload = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    try {
      const response = await fetch(selectedImage)
      const blob = await response.blob()

      const file = new File([blob], `${nameInstitution}-brand.jpg`, {
        type: 'image/jpeg'
      })

      const uploadResponse = await fetch(
        `/api/images/upload?filename=${file.name}&folder=${folder}&override=true`,
        {
          method: 'POST',
          body: file
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen')
      }

      const newBlob = (await uploadResponse.json()) as PutBlobResult
      setBlob(newBlob)
      onUpload(newBlob.url)
      setIsModalOpen(false)
      setSelectedImage(null)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="relative">
        <Avatar className="w-24 h-24 border">
          <AvatarImage
            src={blob?.url || defaultImage}
            alt={nameInstitution}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(nameInstitution)}
          </AvatarFallback>
        </Avatar>

        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-1 -right-0 rounded-full w-8 h-8 p-0 shadow-lg"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
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
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF hasta 1MB
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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
    </>
  )
}
