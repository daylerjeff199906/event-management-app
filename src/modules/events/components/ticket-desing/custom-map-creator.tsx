'use client'

import React, { useState } from 'react'
import {
  Settings2,
  Loader2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle,
  MoveHorizontal,
  MoveVertical
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

// --- Tipos de Formas Predefinidas ---
type ShapeType = 'rectangle' | 'square' | 'vertical' | 'stadium' | 'circle'

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
    w: 1200,
    h: 800,
    radius: '0px'
  },
  {
    id: 'square',
    label: 'Cuadrado',
    icon: <Square />,
    w: 1000,
    h: 1000,
    radius: '0px'
  },
  {
    id: 'vertical',
    label: 'Vertical',
    icon: <RectangleVertical />,
    w: 800,
    h: 1200,
    radius: '0px'
  },
  {
    id: 'stadium',
    label: 'Estadio',
    icon: <Circle className="scale-x-150" />,
    w: 1500,
    h: 900,
    radius: '9999px'
  } // Mucho radio para bordes redondos
]

interface CustomMapCreatorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (config: { width: number; height: number }) => void
  isPending: boolean
}

export const CustomMapCreator: React.FC<CustomMapCreatorProps> = ({
  isOpen,
  onOpenChange,
  onCreate,
  isPending
}) => {
  // Estado local
  const [config, setConfig] = useState({ width: 1200, height: 800 })
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle')

  // Calcular el estilo del borde basado en la forma seleccionada
  const currentShapeData = PRESET_SHAPES.find((s) => s.id === selectedShape)
  const borderRadius = currentShapeData?.radius || '0px'

  // Función para manejar selección de presets
  const handleShapeSelect = (shape: (typeof PRESET_SHAPES)[0]) => {
    setSelectedShape(shape.id)
    setConfig({ width: shape.w, height: shape.h })
  }

  // --- Lógica de Escalado para el Preview ---
  // Queremos que el mapa (ej. 1200px) quepa en un contenedor de ej. 300px
  const PREVIEW_CONTAINER_SIZE = 280
  const maxDim = Math.max(config.width, config.height)
  const scale = PREVIEW_CONTAINER_SIZE / Math.max(maxDim, 1000) // 1000px base mínimo para que no se vea gigante si es pequeño

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 size={20} /> Configuración de Escenario
          </DialogTitle>
          <DialogDescription>
            Diseña las dimensiones y la forma base de tu mapa.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
          {/* COLUMNA IZQUIERDA: CONTROLES */}
          <div className="md:col-span-5 space-y-6">
            {/* 1. Selector de Formas */}
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
                      'h-16 flex flex-col items-center justify-center gap-1',
                      selectedShape === shape.id
                        ? 'bg-black text-white'
                        : 'hover:border-black'
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

            {/* 2. Sliders de Dimensiones */}
            <div className="space-y-4 border-t pt-4">
              {/* ANCHO */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase">
                    <MoveHorizontal size={14} /> Ancho
                  </Label>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {config.width} px
                  </span>
                </div>
                {/* Slider Component (o input range nativo) */}
                <input
                  type="range"
                  min={500}
                  max={3000}
                  step={50}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  value={config.width}
                  onChange={(e) =>
                    setConfig({ ...config, width: Number(e.target.value) })
                  }
                />
              </div>

              {/* ALTO */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase">
                    <MoveVertical size={14} /> Alto
                  </Label>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {config.height} px
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={3000}
                  step={50}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  value={config.height}
                  onChange={(e) =>
                    setConfig({ ...config, height: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Inputs Numéricos Precisos (Opcional, para ajuste fino) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  type="number"
                  className="h-8 text-xs pr-6"
                  value={config.width}
                  onChange={(e) =>
                    setConfig({ ...config, width: Number(e.target.value) })
                  }
                />
                <span className="absolute right-2 top-2 text-[10px] text-gray-400">
                  W
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  className="h-8 text-xs pr-6"
                  value={config.height}
                  onChange={(e) =>
                    setConfig({ ...config, height: Number(e.target.value) })
                  }
                />
                <span className="absolute right-2 top-2 text-[10px] text-gray-400">
                  H
                </span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VISUALIZADOR */}
          <div className="md:col-span-7 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
            {/* Grid de fondo decorativo */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
              style={{
                backgroundImage:
                  'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Etiqueta flotante */}
            <div className="absolute top-3 right-3 text-[10px] font-bold uppercase text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
              Vista Previa
            </div>

            {/* EL MAPA REPRESENTADO */}
            <div
              className="relative bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out flex items-center justify-center"
              style={{
                width: config.width * scale,
                height: config.height * scale,
                borderRadius: borderRadius,
                // Si es estadio, añadimos un color sutil verde, si no blanco
                backgroundColor:
                  selectedShape === 'stadium' ? '#f0fdf4' : undefined // green-50
              }}
            >
              {/* Cotas / Medidas Visuales */}
              <div className="absolute -top-6 text-xs font-bold text-gray-500 flex items-center gap-1">
                <span className="w-16 h-px bg-gray-300"></span>
                {config.width}px
                <span className="w-16 h-px bg-gray-300"></span>
              </div>
              <div className="absolute -left-8 -rotate-90 text-xs font-bold text-gray-500 flex items-center gap-1">
                {config.height}px
              </div>

              {/* Decoración interior del mapa */}
              {selectedShape === 'stadium' && (
                <div className="w-[80%] h-[70%] border-2 border-green-100 rounded-[100px] pointer-events-none" />
              )}
              {selectedShape !== 'stadium' && (
                <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
              )}

              <span className="text-gray-300 font-black text-xl select-none opacity-50">
                MAPA
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => onCreate(config)}
            disabled={isPending}
            className="bg-black text-white hover:bg-gray-800"
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
