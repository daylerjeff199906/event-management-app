'use client'

import React, { useState, useRef } from 'react'
import { Upload, Camera, Loader2, ImageIcon } from 'lucide-react' // Agregué Camera
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
import { PutBlobResult } from '@vercel/blob'
// import { PutBlobResult } from '@vercel/blob' // Descomenta si usas vercel blob

interface BannerUploadModalProps {
  defaultImage?: string
  onUpload: (imageUrl: string) => void
  title?: string
  description?: string
  aspectRatio?: number
  folder?: string
}

export function BannerUploadModal({
  defaultImage,
  onUpload,
  title = 'Actualizar Portada',
  description = 'Arrastra la imagen para ajustarla al espacio del banner.',
  aspectRatio = 3 / 1,
  folder = 'institutions/covers'
}: BannerUploadModalProps) {
  // --- ESTADOS (Lógica original intacta) ---
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // --- REFS ---
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- HANDLERS (Lógica original intacta) ---
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) processFile(file)
  }

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return alert('Máximo 5MB')
    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setOffset({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!imageRef.current || !containerRef.current) return null
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const containerRect = containerRef.current.getBoundingClientRect()
    const scaleFactor = 2
    canvas.width = containerRect.width * scaleFactor
    canvas.height = containerRect.height * scaleFactor

    const image = imageRef.current
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    ctx.scale(scaleFactor, scaleFactor)
    ctx.translate(centerX, centerY)
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)
    ctx.translate(-image.width / 2, -image.height / 2)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    })
  }

  const handleUpload = async () => {
    if (!selectedImage) return
    setIsUploading(true)

    try {
      const blob = await getCroppedImageBlob()
      if (!blob) throw new Error('Error al procesar imagen')

      const file = new File([blob], `banner-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      })

      // Tu endpoint de subida existente
      const response = await fetch(
        `/api/images/upload?filename=${file.name}&folder=${folder}`,
        { method: 'POST', body: file }
      )

      if (!response.ok) throw new Error('Fallo subida')

      const newBlob = (await response.json()) as PutBlobResult
      onUpload(newBlob.url)
      setIsOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error(error)
      alert('Error al guardar el banner')
    } finally {
      setIsUploading(false)
    }
  }

  const imageStyle: React.CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
  }

  // --- RENDERIZADO (DISEÑO ACTUALIZADO) ---
  return (
    <>
      {/* TRIGGER VISUAL: Banner completo estilo Facebook/LinkedIn */}
      <div
        className="group relative w-full overflow-hidden bg-muted/30"
        style={{ aspectRatio }} // Mantiene la proporción del contenedor
      >
        {defaultImage ? (
          // CASO: Hay imagen
          <>
            <img
              src={defaultImage}
              alt="Portada Institución"
              className="w-full h-full object-cover"
            />
            {/* Overlay oscuro suave al hacer hover */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Botón flotante en la esquina inferior derecha */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="shadow-lg"
              >
                <Camera className="mr-2 h-4 w-4" /> Editar portada
              </Button>
            </div>
          </>
        ) : (
          // CASO: Estado vacío (Placeholder elegante)
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 cursor-pointer hover:from-slate-200 hover:to-slate-300 transition-all"
            onClick={() => setIsOpen(true)}
          >
            <div className="p-3 bg-white/50 rounded-full mb-2 backdrop-blur-sm">
              <ImageIcon className="h-6 w-6 text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Agregar foto de portada
            </span>
          </div>
        )}
      </div>

      {/* --- MODAL (Sin cambios estructurales, solo UI interna) --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!selectedImage ? (
              // STEP 1: Selección
              <div
                className="border-2 border-dashed rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Haz clic para subir imagen
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 1200x400px o superior
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              // STEP 2: Editor
              <div className="space-y-4">
                <div
                  ref={containerRef}
                  className="relative w-full bg-slate-900 rounded-lg overflow-hidden shadow-inner select-none cursor-grab active:cursor-grabbing"
                  style={{ aspectRatio }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      alt="Edit"
                      draggable={false}
                      style={imageStyle}
                      className="max-w-none max-h-none select-none"
                    />
                  </div>
                  {/* Grid overlay opcional para ayudar al encuadre */}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-1">
                    <div className="border-r border-white/10" />
                    <div className="border-r border-white/10" />
                  </div>
                </div>

                {/* Slider de Zoom mejorado */}
                <div className="flex items-center gap-4 px-1">
                  <span className="text-xs font-medium text-muted-foreground w-12">
                    Alejar
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    Acercar
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between sm:items-center">
            {selectedImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedImage(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Elegir otra
              </Button>
            )}
            <div className="flex gap-2 justify-end w-full">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              {selectedImage && (
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Guardando...
                    </>
                  ) : (
                    <>Guardar cambios</>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
