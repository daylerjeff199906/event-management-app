'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Search, Filter, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EventStatus } from '@/types'
import { APP_URL } from '@/data/config-app-url'

interface InstitutionEventsHeaderProps {
  className?: string
  institutionId?: string
}

export const InstitutionEventsHeader = ({
  className,
  institutionId
}: InstitutionEventsHeaderProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [showDeleted, setShowDeleted] = useState(
    searchParams.get('deleted') === 'true'
  )

  // Sincronizar con parámetros de URL
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    const currentStatus = searchParams.get('status') || 'all'
    const currentShowDeleted = searchParams.get('deleted') === 'true'

    setSearchTerm(currentSearch)
    setStatus(currentStatus)
    setShowDeleted(currentShowDeleted)
  }, [searchParams])

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Siempre mantener la página en 1 cuando se cambian los filtros
    params.set('page', '1')

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSearchSubmit = () => {
    updateUrlParams({ search: searchTerm || null })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateUrlParams({ status: value === 'all' ? null : value })
  }

  const handleToggleDeleted = () => {
    const newShowDeleted = !showDeleted
    setShowDeleted(newShowDeleted)
    updateUrlParams({ deleted: newShowDeleted ? 'true' : null })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatus('all')
    setShowDeleted(false)

    // Limpiar todos los parámetros de filtro
    const params = new URLSearchParams()
    params.set('page', '1')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const hasActiveFilters = searchTerm || status !== 'all' || showDeleted

  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-6 bg-muted/50 rounded-lg border',
        className
      )}
    >
      {/* Título y acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Eventos de la Institución</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona y visualiza todos los eventos de tu institución
          </p>
        </div>
        <div>
          <Button
            onClick={() =>
              router.push(
                APP_URL.DASHBOARD.INSTITUTION.CREATE_EVENT(institutionId!)
              )
            }
            className="flex items-center gap-2"
          >
            Agregar Evento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Buscador */}
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="search" className="text-sm font-medium mb-2 block">
            Buscar eventos
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Buscar por nombre, descripción..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="w-full sm:w-[200px]">
          <label htmlFor="status" className="text-sm font-medium mb-2 block">
            Estado
          </label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value={EventStatus?.PUBLIC}>Publicados</SelectItem>
              <SelectItem value={EventStatus?.DRAFT}>Borradores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 items-end">
          <Button
            onClick={handleSearchSubmit}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <Search className="w-4 h-4" />
            Buscar
          </Button>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Limpiar
            </Button>
          )}
          <Button
            onClick={handleToggleDeleted}
            variant={showDeleted ? 'default' : 'outline'}
            size="sm"
          >
            {showDeleted ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar eliminados
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ver eliminados
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          <span className="font-medium">Filtros activos:</span>

          {searchTerm && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
              Búsqueda: {`${searchTerm}`}
            </span>
          )}

          {status !== 'all' && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
              Estado: {status}
            </span>
          )}

          {showDeleted && (
            <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md">
              Mostrando eliminados
            </span>
          )}
        </div>
      )}
    </div>
  )
}
