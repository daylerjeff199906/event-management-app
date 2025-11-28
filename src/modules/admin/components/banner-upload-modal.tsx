'use client'

import React, { useState, useRef } from 'react'
import { Upload, Camera, Loader2, ImageIcon } from 'lucide-react'
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
  aspectRatio?: number
  folder?: string
}

export function BannerUploadModal({
  defaultImage,
  onUpload,
  title = 'Actualizar Portada',
  description = 'Ajusta el zoom para encuadrar tu imagen correctamente.',
  // CAMBIO 1: 2.5/1 es un formato panorámico que no es tan "delgado" como el 3/1
  aspectRatio = 2.5 / 1,
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
      {/* TRIGGER VISUAL */}
      <div
        className="group relative w-full overflow-hidden bg-muted/30 md:rounded-t-lg shadow-sm border-b"
        style={{ aspectRatio }}
      >
        {/* CAMBIO 2: min-h-[220px] asegura que el banner tenga altura suficiente para verse bien */}
        <div className="absolute inset-0 w-full h-full min-h-[220px]">
          {defaultImage ? (
            <>
              <img
                src={defaultImage}
                alt="Portada Institución"
                // object-center evita que corte la parte superior si la imagen es alta
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsOpen(true)}
                  className="shadow-lg backdrop-blur-md bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                >
                  <Camera className="mr-2 h-4 w-4" /> Editar portada
                </Button>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 cursor-pointer hover:from-slate-200 hover:to-slate-300 transition-all"
              onClick={() => setIsOpen(true)}
            >
              <div className="p-3 bg-white/50 rounded-full mb-2 backdrop-blur-sm shadow-sm">
                <ImageIcon className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Agregar foto de portada
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 bg-muted/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-5 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Haz clic para subir imagen
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos soportados: JPG, PNG, WEBP
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
              <div className="space-y-6">
                <div
                  ref={containerRef}
                  // Añadí bg-black para que cuando hagas zoom out (alejar) se vean bordes negros estilo cine y no transparente
                  className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl select-none cursor-grab active:cursor-grabbing border border-border"
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
                  {/* Guías visuales sutiles */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full grid grid-cols-3">
                      <div className="border-r border-white"></div>
                      <div className="border-r border-white"></div>
                    </div>
                  </div>
                </div>

                {/* CONTROLES DE ZOOM MEJORADOS */}
                <div className="flex items-center gap-4 px-2 py-2 bg-muted/20 rounded-lg border">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />

                  {/* CAMBIO 3: min="0.1" permite hacer la imagen mucho más pequeña para que quepa en altura */}
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <ImageIcon className="h-5 w-5 text-foreground" />
                  <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                    {Math.round(zoom * 100)}%
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
