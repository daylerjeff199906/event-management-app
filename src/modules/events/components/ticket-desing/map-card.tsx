import React from 'react'
import {
  Edit3,
  MoreVertical,
  Trash2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle,
  Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { EventMap } from '../../schemas'

interface MapCardProps {
  map: EventMap
  index: number
  onDesign: (id: string) => void
  onDelete: (id: string) => void
}

// Helper para obtener estilos y etiquetas según la forma
const getShapeInfo = (shape?: string) => {
  switch (shape) {
    case 'square':
      return {
        icon: <Square size={22} />,
        label: 'Cuadrado',
        // Estilo: Azul (Productividad/Estándar)
        style:
          'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      }
    case 'vertical':
      return {
        icon: <RectangleVertical size={22} />,
        label: 'Vertical',
        // Estilo: Violeta (Elegante)
        style:
          'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
      }
    case 'stadium':
      return {
        icon: <Circle className="scale-x-125" size={22} />,
        label: 'Estadio',
        // Estilo: Esmeralda (Naturaleza/Campo)
        style:
          'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
      }
    case 'circle':
      return {
        icon: <Circle size={22} />,
        label: 'Circular',
        // Estilo: Naranja (Dinámico)
        style:
          'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
      }
    case 'rectangle':
    default:
      return {
        icon: <RectangleHorizontal size={22} />,
        label: 'Rectangular',
        // Estilo: Zinc/Gris (Neutro)
        style:
          'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
      }
  }
}

export const MapCard = ({ map, index, onDesign, onDelete }: MapCardProps) => {
  const shapeInfo = getShapeInfo(map.config?.shape)

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white border border-gray-200 p-5  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
      {/* --- HEADER: Icono + Menu --- */}
      <div className="flex justify-between items-start mb-4">
        {/* Identificador Visual de Forma (Shape Icon) */}
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 duration-300',
            'shadow-sm', // Sutil sombra interna
            shapeInfo.style
          )}
        >
          {shapeInfo.icon}
        </div>

        {/* Menú de Acciones (3 Puntos) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 text-gray-400 hover:text-black dark:text-zinc-500 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 p-1 rounded-xl shadow-xl dark:bg-zinc-950 dark:border-zinc-800"
          >
            <DropdownMenuItem
              onClick={() => onDesign(map.id!)}
              className="cursor-pointer rounded-lg focus:bg-gray-100 dark:focus:bg-zinc-800"
            >
              <Edit3 size={14} className="mr-2 text-gray-500" /> Editar Diseño
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20 cursor-pointer rounded-lg mt-1"
              onClick={() => onDelete(map.id!)}
            >
              <Trash2 size={14} className="mr-2" /> Eliminar Mapa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- BODY: Título e Info --- */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight tracking-tight mb-2 truncate">
          {map.name || `Escenario ${index + 1}`}
        </h4>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Etiqueta de Forma */}
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-[10px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
            {shapeInfo.label}
          </span>

          {/* Etiqueta de Dimensiones */}
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-[10px] font-mono text-gray-500 border border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
            <Maximize2 size={10} className="mr-1" />
            {map.width}x{map.height}
          </span>
        </div>
      </div>

      {/* --- FOOTER: Botón de Acción Principal --- */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] text-gray-400 font-mono truncate">
            ID: {map.id?.slice(-6)}
          </div>

          <Button
            className={cn(
              'rounded-xl px-5 transition-all active:scale-95 shadow-sm',
              'bg-black text-white hover:bg-gray-800', // Light
              'dark:bg-white dark:text-black dark:hover:bg-gray-200' // Dark
            )}
            size="sm"
            onClick={() => onDesign(map.id!)}
          >
            <Edit3 size={14} className="mr-2" />
            Diseñar
          </Button>
        </div>
      </div>
    </div>
  )
}
