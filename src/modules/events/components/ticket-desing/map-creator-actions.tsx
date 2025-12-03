import React, { useState } from 'react'
import {
  Plus,
  Loader2,
  ChevronDown,
  FilePlus,
  LayoutTemplate,
  Settings2,
  Map as MapIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { CustomMapCreator } from './custom-map-creator'

// Mock Data
const MOCK_TEMPLATES = [
  {
    id: 'tpl_1',
    name: 'Teatro Pequeño',
    width: 800,
    height: 600,
    desc: 'Ideal para aforos < 100'
  },
  {
    id: 'tpl_2',
    name: 'Estadio Básico',
    width: 2000,
    height: 1500,
    desc: 'Campo y graderías'
  },
  {
    id: 'tpl_3',
    name: 'Auditorio',
    width: 1200,
    height: 1000,
    desc: 'Distribución estándar'
  }
]

interface MapCreatorActionsProps {
  onCreateMap: (config: {
    width: number
    height: number
    bg?: string | null
  }) => void
  isPending: boolean
}

export const MapCreatorActions: React.FC<MapCreatorActionsProps> = ({
  onCreateMap,
  isPending
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [isTemplateOpen, setIsTemplateOpen] = useState(false)

  const handleCreateBlank = () => onCreateMap({ width: 1200, height: 1000 })

  const handleCreateTemplate = (tpl: (typeof MOCK_TEMPLATES)[0]) => {
    onCreateMap({ width: tpl.width, height: tpl.height })
    setIsTemplateOpen(false)
  }

  return (
    <>
      <div className="inline-flex -space-x-px rounded-md shadow-sm">
        <Button
          onClick={handleCreateBlank}
          disabled={isPending}
          className="rounded-r-none focus:z-10"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Plus size={16} className="mr-2" />
          )}
          NUEVO MAPA (BLANCO)
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-none border-l px-3 focus:z-10">
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Método de Creación</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCreateBlank}
              className="flex items-start"
            >
              <FilePlus className="mr-2 h-4 w-4 text-gray-500 mt-2 dark:text-gray-400" />{' '}
              <div>
                <p>Mapa en Blanco</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Crea un mapa desde cero sin plantilla.
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsTemplateOpen(true)}>
              <LayoutTemplate className="mr-2 h-4 w-4 text-purple-500" />{' '}
              <div>
                <p>Desde Plantilla</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Elige una plantilla predefinida.
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsCustomOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4 text-blue-500" />{' '}
              <div>
                <p>Configuración Personalizada</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Define dimensiones y opciones avanzadas.
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal Custom */}
      <CustomMapCreator
        isOpen={isCustomOpen}
        onOpenChange={setIsCustomOpen}
        onCreate={(config) => {
          onCreateMap(config)
          setIsCustomOpen(false)
        }}
        isPending={isPending}
      />
      {/* Modal Template */}
      <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate size={20} /> Galería de Plantillas
            </DialogTitle>
            <DialogDescription>
              Selecciona una estructura base.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {MOCK_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                disabled={isPending}
                onClick={() => handleCreateTemplate(tpl)}
                className="flex flex-col items-start p-4 border rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
              >
                <div className="w-full h-24 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                  <MapIcon size={32} />
                </div>
                <h5 className="font-bold text-sm">{tpl.name}</h5>
                <p className="text-xs text-gray-500 mb-2">
                  {tpl.width}x{tpl.height}px
                </p>
                <p className="text-xs text-gray-600">{tpl.desc}</p>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTemplateOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
