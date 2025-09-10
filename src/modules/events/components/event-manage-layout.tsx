'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface MenuItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  completed?: boolean
  onClick?: () => void
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
  title = 'Event Management',
  activeItem,
  onItemClick,
  urlBack,
  backLabel = 'Volver'
}: EventManageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick()
    }
    if (onItemClick) {
      onItemClick(item.id)
    }
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          'fixed left-0 top-0 z-50 h-full w-80 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
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
              <h3 className="text-sm font-medium text-gray-500 mb-4">Steps</h3>
              <div className="space-y-4">
                {menuItems.map((item, index) => {
                  const isActive = activeItem === item.id
                  const isCompleted = item.completed

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0',
                            isActive || isCompleted
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 bg-white'
                          )}
                        >
                          {(isActive || isCompleted) && (
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
                    </button>
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
      <div className="lg:ml-80">
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </header>

        {/* Contenido */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
