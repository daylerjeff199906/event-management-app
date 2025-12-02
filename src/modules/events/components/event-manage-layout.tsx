'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  href?: string
}

interface EventManageLayoutProps {
  children: React.ReactNode
  menuItems: MenuItem[]
  title?: string
  activeItem?: string
  onItemClick?: (itemId: string) => void
  urlBack?: string
  backLabel?: string
  /**
   * Determina el diseño del layout.
   * 'sidebar': Diseño original con panel lateral izquierdo.
   * 'tabs': Nuevo diseño con pestañas superiores.
   * @default 'sidebar'
   */
  variant?: 'sidebar' | 'tabs'
}

export function EventManageLayout({
  children,
  menuItems,
  activeItem,
  onItemClick,
  urlBack,
  backLabel = 'Volver',
  variant = 'sidebar'
}: EventManageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick()
    }
    if (onItemClick) {
      onItemClick(item.id)
    }
    setSidebarOpen(false)
  }

  const isActiveItem = (itemId: string) => {
    if (activeItem) {
      return activeItem === itemId
    }
    return pathname === itemId
  }

  // --- RENDERIZADO VARIANTE TABS ---
  if (variant === 'tabs') {
    return (
      <div className="min-h-screen flex flex-col container mx-auto max-w-5xl">
        <div className="px-6 lg:px-0 pt-6 pb-4">
          {/* Header con botón volver para Tabs */}
          {urlBack && (
            <div className="mb-4">
              <Button
                variant="ghost"
                className="p-0 h-auto text-muted-foreground hover:text-primary hover:bg-transparent font-normal"
                asChild
              >
                <Link href={urlBack} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  {backLabel}
                </Link>
              </Button>
            </div>
          )}

          {/* Navegación Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav
              className="-mb-px flex space-x-8 overflow-x-auto scrollbar-none"
              aria-label="Tabs"
            >
              {menuItems.map((item) => {
                const isActive = isActiveItem(item.id)
                return (
                  <Link
                    key={item.id}
                    href={item.disabled ? '#' : item.href || '#'}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-700',
                      item.disabled && 'cursor-not-allowed opacity-50'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Contenido Tabs */}
        <main className="flex-1 p-6 lg:px-0 pt-6">{children}</main>
      </div>
    )
  }

  // --- RENDERIZADO VARIANTE SIDEBAR (Original) ---
  return (
    <div className="min-h-screen flex flex-col lg:flex-row container mx-auto">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'sticky left-0 top-0 lg:top-16 z-50 h-fit w-64 transform border-r border-gray-200 dark:border-gray-800 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:z-auto bg-background',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-2">
            {urlBack && (
              <Button
                variant="ghost"
                className="mb-6 p-0 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent font-normal"
                asChild
              >
                <Link href={urlBack} className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {backLabel}
                </Link>
              </Button>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">
                Opciones
              </h3>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = isActiveItem(item.id)

                  return (
                    <Link
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'w-full block text-left group p-2 rounded-md transition-colors',
                        item.disabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                      )}
                      href={item.disabled ? '#' : item.href || '#'}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors',
                            isActive
                              ? 'bg-primary border-primary'
                              : 'border-gray-300 bg-transparent group-hover:border-gray-400 dark:border-gray-600'
                          )}
                        >
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              'font-medium text-sm',
                              isActive && !item.disabled
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            {item.label}
                          </h4>

                          {isActive && item.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:hidden p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(false)}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main
        className={cn(
          'flex-1 p-6 lg:pl-8 lg:pr-12 py-0',
          sidebarOpen ? 'opacity-50 pointer-events-none' : 'opacity-100',
          'max-w-7xl mx-auto w-full'
        )}
      >
        {children}
      </main>
    </div>
  )
}
