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
}

export function EventManageLayout({
  children,
  menuItems,
  activeItem,
  onItemClick,
  urlBack,
  backLabel = 'Volver'
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

    return pathname.includes(itemId)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
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
          'sticky left-0 top-0 lg:top-14 z-50 h-fit w-80 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-6">
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
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Opciones
              </h3>
              <div className="space-y-4">
                {menuItems.map((item) => {
                  const isActive = isActiveItem(item.id)
                  const isCompleted = !item.disabled

                  return (
                    <Link
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'w-full text-left group p-2 ',
                        item.disabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:cursor-pointer'
                      )}
                      href={item.disabled ? '#' : item.href || '#'}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0',
                            isActive
                              ? 'bg-primary border-primary'
                              : 'border-gray-300 bg-white'
                          )}
                        >
                          {isActive && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              'font-medium text-sm',
                              isActive || isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            )}
                          >
                            {item.label}
                          </h4>

                          {isActive && item.description && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
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

          <div className="lg:hidden p-4 border-t border-gray-200 mt-auto">
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
          'flex-1 p-6 lg:pl-8 lg:pr-12 lg:py-8',
          sidebarOpen ? 'opacity-50 pointer-events-none' : 'opacity-100',
          'max-w-4xl mx-auto w-full'
        )}
      >
        {children}
      </main>
    </div>
  )
}
