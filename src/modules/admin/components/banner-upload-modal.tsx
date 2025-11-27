'use client'

import React, { useState, useRef } from 'react'
import { Upload, ImageIcon, Move, Check, Loader2 } from 'lucide-react'
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

interface BannerUploadModalProps {
  defaultImage?: string
  onUpload: (imageUrl: string) => void
  title?: string
  description?: string
  aspectRatio?: number // Ej: 3/1 para banners anchos
  folder?: string
}

export function BannerUploadModal({
  defaultImage,
  onUpload,
  title = 'Actualizar Portada',
  description = 'Arrastra la imagen para ajustarla al espacio del banner.',
  aspectRatio = 3 / 1, // Relación de aspecto estándar para banners
  folder = 'institutions/covers'
}: BannerUploadModalProps) {
  // Estados
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Refs
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Handlers de Archivos ---

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) processFile(file)
  }

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return alert('Máximo 5MB') // Banners pueden ser más pesados

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setOffset({ x: 0, y: 0 }) // Reset posición
      setZoom(1) // Reset zoom
    }
    reader.readAsDataURL(file)
  }

  // --- Lógica de Arrastre (Drag) ---

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

  // --- Lógica de Recorte y Subida (Canvas) ---

  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!imageRef.current || !containerRef.current) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Dimensiones reales del contenedor visual
    const containerRect = containerRef.current.getBoundingClientRect()

    // Configurar canvas para alta resolución (doble del tamaño visual para calidad retina)
    const scaleFactor = 2
    canvas.width = containerRect.width * scaleFactor
    canvas.height = containerRect.height * scaleFactor

    // Dibujar
    // La lógica aquí replica lo que se ve en pantalla (CSS transform) al Canvas
    // Calculamos la posición relativa de la imagen dentro del contenedor

    const image = imageRef.current

    // Cuánto mide la imagen renderizada en pantalla actualmente (con zoom)
    // Nota: Esta es una aproximación visual. Para precisión matemática absoluta
    // se suele usar librerías, pero esto funciona para casos de uso general.

    // Simplificación: Dibujamos la imagen completa desplazada
    ctx.scale(scaleFactor, scaleFactor)

    // Necesitamos "clippear" el área. Pero como el canvas tiene el tamaño exacto del crop,
    // solo necesitamos dibujar la imagen con el offset y escala correctos.

    // Centro del canvas
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

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

  // Estilo dinámico para la imagen arrastrable
  const imageStyle: React.CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
  }

  return (
    <>
      {/* TRIGGER: La vista previa en el formulario */}
      <div className="group relative w-full rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 hover:bg-muted/20 transition-colors overflow-hidden">
        {defaultImage ? (
          // Si hay imagen, mostramos el banner con su aspect ratio
          <div className="relative w-full bg-gray-100" style={{ aspectRatio }}>
            <img
              src={defaultImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" onClick={() => setIsOpen(true)}>
                <Move className="mr-2 h-4 w-4" /> Ajustar / Cambiar
              </Button>
            </div>
          </div>
        ) : (
          // Estado vacío
          <div
            className="flex flex-col items-center justify-center p-8 text-center"
            style={{ aspectRatio }}
            onClick={() => setIsOpen(true)}
          >
            <div className="p-4 rounded-full bg-background shadow-sm mb-3 cursor-pointer">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Subir Banner</p>
            <p className="text-xs text-muted-foreground mt-1">
              1920 x 640 recomendado
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!selectedImage ? (
              // STEP 1: Selección de archivo
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium">
                  Click para seleccionar imagen
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              // STEP 2: Editor (Crop)
              <div className="space-y-4">
                {/* Contenedor de Recorte (Viewport) */}
                <div
                  ref={containerRef}
                  className="relative w-full bg-slate-900 rounded-lg overflow-hidden shadow-inner select-none"
                  style={{ aspectRatio }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Imagen Fantasma (Para centrar inicialmente) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      alt="Edit"
                      draggable={false}
                      style={imageStyle}
                      className="max-w-none max-h-none select-none"
                      // onLoad para centrar imagen si quisieras agregar lógica extra
                    />
                  </div>

                  {/* Guías visuales (Opcional) */}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                </div>

                {/* Controles de Zoom */}
                <div className="flex items-center gap-4 px-2">
                  <span className="text-xs font-medium w-12">Zoom</span>
                  {/* Usa tu componente Slider o un input range simple */}
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex justify-center">
                  <p className="text-xs text-muted-foreground">
                    <Move className="inline w-3 h-3 mr-1" /> Arrastra para
                    encuadrar
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between">
            {selectedImage && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedImage(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                Cambiar Imagen
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
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Guardar Banner
                    </>
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
