'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Settings2,
  Loader2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  Type,
  Expand
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { MapConfig } from '../../schemas'

// --- Tipos ---
// Asegúrate de que estos strings coincidan exactamente con lo que espera tu Base de Datos/Prisma Enum
type ShapeType = 'rectangle' | 'square' | 'vertical' | 'stadium' | 'circle'

// Configuración visual de las formas
const PRESET_SHAPES: {
  id: ShapeType
  label: string
  icon: React.ReactNode
  w: number
  h: number
  radius: string
}[] = [
  {
    id: 'rectangle',
    label: 'Rectángulo',
    icon: <RectangleHorizontal />,
    w: 800,
    h: 500,
    radius: '0px'
  },
  {
    id: 'square',
    label: 'Cuadrado',
    icon: <Square />,
    w: 800,
    h: 800,
    radius: '0px'
  },
  {
    id: 'vertical',
    label: 'Vertical',
    icon: <RectangleVertical />,
    w: 600,
    h: 900,
    radius: '0px'
  },
  {
    id: 'stadium',
    label: 'Estadio',
    icon: <Circle className="scale-x-150" />,
    w: 1200,
    h: 900,
    radius: '9999px'
  }
]

interface CustomMapCreatorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: {
    width: number
    height: number
    name: string
    config: MapConfig // Asegúrate de que MapConfig acepte { shape: string, borderRadius: string }
  }) => void
  isPending: boolean
}

export const CustomMapCreator: React.FC<CustomMapCreatorProps> = ({
  isOpen,
  onOpenChange,
  onCreate,
  isPending
}) => {
  // --- Estados ---
  // Renombramos 'config' a 'dimensions' para evitar confusión con el objeto config de salida
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [name, setName] = useState('')
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle')
  const [isDragging, setIsDragging] = useState(false)

  // Referencias para el cálculo del drag
  const dragStartRef = useRef<{
    x: number
    y: number
    w: number
    h: number
  } | null>(null)

  // Efecto para setear nombre por defecto al abrir
  useEffect(() => {
    if (isOpen) {
      if (!name) setName('Nuevo Escenario')
      // Resetear dimensiones a un default seguro al abrir
      setDimensions({ width: 800, height: 500 })
      setSelectedShape('rectangle')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // --- Lógica de Escalado (Matemática Visual) ---
  const PREVIEW_CONTAINER_SIZE = 250
  const maxDim = Math.max(dimensions.width, dimensions.height)
  const scale = PREVIEW_CONTAINER_SIZE / Math.max(maxDim, 800)

  // --- Handlers ---

  const handleShapeSelect = (shape: (typeof PRESET_SHAPES)[0]) => {
    setSelectedShape(shape.id)
    setDimensions({ width: shape.w, height: shape.h })
  }

  const handleRotate = () => {
    setDimensions((prev) => ({ width: prev.height, height: prev.width }))

    // Lógica para cambiar el ID de la forma si es necesario para mantener coherencia visual
    if (selectedShape === 'rectangle') setSelectedShape('vertical')
    else if (selectedShape === 'vertical') setSelectedShape('rectangle')
    // Nota: 'stadium' rotado sigue siendo 'stadium' pero con dimensiones invertidas, lo cual es correcto.
  }

  // --- Lógica de Arrastre (Drag to Resize) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: dimensions.width,
      h: dimensions.height
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStartRef.current) return

    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y

    const deltaW = deltaX / scale
    const deltaH = deltaY / scale

    setDimensions({
      width: Math.max(300, Math.round(dragStartRef.current.w + deltaW)),
      height: Math.max(300, Math.round(dragStartRef.current.h + deltaH))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragStartRef.current = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  // --- Final Submit (CORREGIDO) ---
  const handleSubmit = () => {
    // 1. Buscamos la configuración base del shape seleccionado
    const shapeData = PRESET_SHAPES.find((s) => s.id === selectedShape)

    // 2. Preparamos el payload asegurando que config exista y tenga datos
    const payload = {
      width: dimensions.width,
      height: dimensions.height,
      name: name || 'Escenario Personalizado',
      config: {
        // Forzamos el tipado para evitar errores de TS, pero asegúrate que el backend acepte estos strings
        shape: selectedShape as MapConfig['shape'],
        borderRadius: shapeData?.radius || '0px'
      }
    }

    onCreate(payload)
  }

  // Estilo dinámico para el preview
  const currentShapeData = PRESET_SHAPES.find((s) => s.id === selectedShape)
  const currentRadius = currentShapeData?.radius || '0px'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] overflow-hidden flex flex-col h-[90vh] sm:h-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 size={20} /> Diseño de Escenario
          </DialogTitle>
          <DialogDescription>
            Configura las dimensiones, forma y nombre del área.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-2 flex-1 overflow-y-auto sm:overflow-visible">
          {/* --- COLUMNA IZQUIERDA: CONTROLES --- */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-center">
            {/* 1. Nombre */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Type size={14} /> Nombre del Escenario
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Zona General, VIP..."
                className="font-medium"
              />
            </div>

            {/* 2. Formas */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-gray-500 uppercase">
                Forma Base
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SHAPES.map((shape) => (
                  <Button
                    key={shape.id}
                    type="button"
                    variant={selectedShape === shape.id ? 'default' : 'outline'}
                    className={cn(
                      'h-14 flex flex-col items-center justify-center gap-1 transition-all',
                      selectedShape === shape.id
                        ? 'bg-black text-white ring-2 ring-offset-1 ring-black'
                        : 'text-gray-500 hover:text-black hover:border-black'
                    )}
                    onClick={() => handleShapeSelect(shape)}
                  >
                    {shape.icon}
                    <span className="text-[10px] uppercase font-bold">
                      {shape.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 3. Dimensiones Manuales + Rotar */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">
                  Dimensiones
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="h-6 text-xs gap-1 hover:bg-gray-100"
                >
                  <RotateCw size={12} /> Rotar
                </Button>
              </div>

              {/* Ancho */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <MoveHorizontal size={12} /> Ancho
                  </span>
                  <span className="font-mono font-bold">
                    {dimensions.width}px
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3000}
                  step={10}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      width: Number(e.target.value)
                    })
                  }
                />
              </div>

              {/* Alto */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <MoveVertical size={12} /> Alto
                  </span>
                  <span className="font-mono font-bold">
                    {dimensions.height}px
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3000}
                  step={10}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      height: Number(e.target.value)
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: VISUALIZADOR --- */}
          <div className="lg:col-span-8 bg-gray-50/50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 relative flex items-center justify-center min-h-[400px] overflow-hidden select-none">
            {/* Fondo de Cuadrícula */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Indicador de Escala */}
            <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 font-mono bg-white border px-2 py-1 rounded">
              Escala: {(scale * 100).toFixed(0)}%
            </div>

            {/* === OBJETO MAPA INTERACTIVO === */}
            <div
              className={cn(
                'relative bg-white dark:bg-gray-800 shadow-2xl border border-gray-300 dark:border-gray-600 transition-all ease-out flex items-center justify-center group',
                isDragging ? 'duration-0' : 'duration-300'
              )}
              style={{
                width: dimensions.width * scale,
                height: dimensions.height * scale,
                borderRadius: currentRadius
              }}
            >
              {/* Cotas Exteriores (Dimensiones) */}
              <div className="absolute -top-8 w-full flex justify-center text-xs font-bold text-gray-400">
                <span className="bg-gray-100 px-2 rounded">
                  {dimensions.width} px
                </span>
              </div>
              <div className="absolute -left-10 h-full flex items-center text-xs font-bold text-gray-400">
                <span className="bg-gray-100 px-2 rounded -rotate-90 whitespace-nowrap">
                  {dimensions.height} px
                </span>
              </div>

              {/* Decoración Interna */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

              <span className="text-gray-300 font-semibold z-0 pointer-events-none uppercase tracking-widest opacity-40">
                {'PREVIEW'}
              </span>

              {/* === MANEJADOR DE REDIMENSIÓN (GRIP) === */}
              <div
                onMouseDown={handleMouseDown}
                className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center cursor-nwse-resize hover:bg-black/5 rounded-tl-lg transition-colors z-10 group-hover:opacity-100"
              >
                <Expand
                  size={20}
                  className="text-gray-400 group-hover:text-black dark:group-hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 mt-auto sm:mt-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name}
            className="bg-black text-white min-w-[150px]"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Settings2 className="mr-2 h-4 w-4" />
            )}
            Crear Escenario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
