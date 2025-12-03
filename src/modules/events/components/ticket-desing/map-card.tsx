import { Edit3, MoreVertical, Trash2 } from 'lucide-react'
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

import {
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle
} from 'lucide-react'

const getShapeInfo = (shape?: string) => {
  switch (shape) {
    case 'square':
      return {
        icon: <Square size={20} />,
        label: 'Cuadrado',
        color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
      }
    case 'vertical':
      return {
        icon: <RectangleVertical size={20} />,
        label: 'Vertical',
        color:
          'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400'
      }
    case 'stadium':
      return {
        icon: <Circle className="scale-x-125" size={20} />,
        label: 'Estadio',
        color:
          'text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
      }
    case 'circle':
      return {
        icon: <Circle size={20} />,
        label: 'Circular',
        color:
          'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
      }
    case 'rectangle':
    default:
      return {
        icon: <RectangleHorizontal size={20} />,
        label: 'Rectangular',
        color: 'text-gray-500 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-400'
      }
  }
}

export const MapCard = ({ map, index, onDesign, onDelete }: MapCardProps) => {
  const shapeInfo = getShapeInfo(map.config?.shape)

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-black/20 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-600">
      {/* Header: Icono Forma + Info + Menu */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Visual Identifier (Inspirado en la imagen T1, T2...) */}
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors border border-transparent group-hover:scale-105 duration-200',
              shapeInfo.color // Aplica el color según la forma
            )}
          >
            {shapeInfo.icon}
          </div>

          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
              {map.name || `Escenario ${index + 1}`}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              {/* Badge ID */}
              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                ID: {map.id?.slice(-4)}
              </span>
              <span className="text-gray-300 dark:text-zinc-700">•</span>
              {/* Badge Dimensiones */}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {map.width} x {map.height} px
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 text-gray-300 hover:text-black dark:text-zinc-600 dark:hover:text-white"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-zinc-950 dark:border-zinc-800"
          >
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
              onClick={() => onDelete(map.id!)}
            >
              <Trash2 size={14} className="mr-2" /> Eliminar Mapa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Footer / Acción Principal */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {shapeInfo.label}
        </div>
        <Button
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-lg transition-transform active:scale-95 shadow-sm"
          size="sm"
          onClick={() => onDesign(map.id!)}
        >
          <Edit3 size={14} className="mr-2" />
          DISEÑAR
        </Button>
      </div>
    </div>
  )
}
