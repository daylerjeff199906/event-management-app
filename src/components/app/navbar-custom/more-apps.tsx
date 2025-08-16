'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import type { IMoreApp } from '@/types/index'
import { ExternalLink, Grid3X3, List, Grip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MoreAppsProps {
  apps: IMoreApp[]
  children?: React.ReactNode
  className?: string
  title?: string
  viewMode?: 'grid' | 'list'
  showBadges?: boolean
}

export const MoreApps = ({
  apps,
  className,
  title = 'Servicios del Sistema',
  viewMode = 'grid',
  showBadges = false,
}: MoreAppsProps) => {
  const [currentViewMode, setCurrentViewMode] = React.useState<'grid' | 'list'>(
    viewMode
  )

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative hover:bg-white/10 transition-all duration-200',
                  'text-white hover:text-white focus:text-white',
                  'hover:scale-105 active:scale-95',
                  className
                )}
              >
                <Grip className="w-5 h-5" />
                <span className="sr-only">Abrir menú de servicios</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Servicios del sistema</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          className={cn(
            'w-80 p-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm',
            currentViewMode === 'list' && 'w-72'
          )}
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <DropdownMenuLabel className="text-base font-semibold text-gray-900 p-0">
                {title}
              </DropdownMenuLabel>
              <p className="text-xs text-gray-600 mt-1">
                {apps.length} servicios disponibles
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'w-7 h-7',
                  currentViewMode === 'grid' && 'bg-white shadow-sm'
                )}
                onClick={() => setCurrentViewMode('grid')}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'w-7 h-7',
                  currentViewMode === 'list' && 'bg-white shadow-sm'
                )}
                onClick={() => setCurrentViewMode('list')}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Apps Grid/List */}
          <div
            className={cn(
              'p-3',
              currentViewMode === 'grid'
                ? 'grid grid-cols-3 gap-2'
                : 'flex flex-col gap-1'
            )}
          >
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={index}
                asChild
                className="p-0 h-auto"
              >
                {currentViewMode === 'grid' ? (
                  <AppGridItem
                    app={app}
                    showBadges={showBadges}
                  />
                ) : (
                  <AppListItem
                    app={app}
                    showBadges={showBadges}
                  />
                )}
              </DropdownMenuItem>
            ))}
          </div>

          {apps.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay servicios disponibles</p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

const AppGridItem = ({
  app,
  showBadges,
}: {
  app: IMoreApp
  showBadges: boolean
}) => {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col items-center justify-center p-3 rounded-lg',
        'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50',
        'transition-all duration-200 cursor-pointer text-center',
        'border border-transparent hover:border-blue-200/50',
        'hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'
      )}
    >
      <div className="relative mb-2">
        <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
          <img
            src={app.icon || '/placeholder.svg'}
            alt={app.title}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded text-white text-xs font-bold md:flex items-center justify-center">
            {app.title.charAt(0)}
          </div>
        </div>
        {showBadges && (
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 w-3 h-3 p-0 text-[8px]"
          >
            •
          </Badge>
        )}
      </div>

      <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-700 transition-colors">
        {app.title}
      </h3>
      <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">
        {app.description}
      </p>

      <ExternalLink className="w-3 h-3 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

const AppListItem = ({
  app,
  showBadges,
}: {
  app: IMoreApp
  showBadges: boolean
}) => {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg',
        'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50',
        'transition-all duration-200 cursor-pointer',
        'border border-transparent hover:border-blue-200/50',
        'hover:shadow-sm'
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
          <img
            src={app.icon || '/placeholder.svg'}
            alt={app.title}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded text-white text-xs font-bold md:flex items-center justify-center">
            {app.title.charAt(0)}
          </div>
        </div>
        {showBadges && (
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 w-3 h-3 p-0 text-[8px]"
          >
            •
          </Badge>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
          {app.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
          {app.description}
        </p>
      </div>

      <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </a>
  )
}
