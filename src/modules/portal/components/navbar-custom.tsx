'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_URL } from '@/data/config-app-url'
import { LogoRender } from '@/components/app/miscellaneous/logo-render'

export interface MenuItem {
  label: string
  href: string
  subItems?: MenuItem[]
}

export interface NavbarProps {
  // Logo props
  logoText?: string
  logoImage?: string
  logoHref?: string

  // Menu props
  menuItems: MenuItem[]

  // Auth props
  isLoggedIn?: boolean
  userName?: string
  onLogin?: () => void
  onSignUp?: () => void
  onLogout?: () => void

  // Style props
  className?: string
  variant?: 'default' | 'transparent'
}

export function NavbarCustom({
  logoHref = '/',
  menuItems = [],
  isLoggedIn = false,
  userName,
  onSignUp,
  onLogout,
  className,
  variant = 'default'
}: NavbarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'flex items-center gap-1',
                isMobile && 'w-full justify-start'
              )}
            >
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? 'start' : 'center'}>
            {item.subItems.map((subItem) => (
              <DropdownMenuItem key={subItem.label} asChild>
                <Link href={subItem.href} className="w-full">
                  {subItem.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          'text-foreground hover:text-primary transition-colors',
          isMobile && 'block py-2'
        )}
        onClick={() => isMobile && setIsSheetOpen(false)}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        variant === 'transparent' && 'bg-transparent border-transparent',
        className
      )}
      style={{
        zIndex: 9999
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center space-x-2">
            <LogoRender href={logoHref} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {userName && (
                      <span className="hidden lg:inline">{userName}</span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracion">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button className="rounded-full" variant="ghost" asChild>
                  <Link
                    className="hover:cursor-pointer"
                    href={APP_URL.AUTH.LOGIN}
                  >
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button onClick={onSignUp} className="rounded-full">
                  <Link
                    className="hover:cursor-pointer"
                    href={APP_URL.AUTH.REGISTER}
                  >
                    Crear Cuenta
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Menú</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {menuItems.map((item) => renderMenuItem(item, true))}
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t space-y-2">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-medium">
                          {userName || 'Usuario'}
                        </span>
                      </div>
                      <Link
                        href="/perfil"
                        className="block py-2 text-foreground hover:text-primary"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/configuracion"
                        className="block py-2 text-foreground hover:text-primary"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Configuración
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-2"
                        onClick={() => {
                          onLogout?.()
                          setIsSheetOpen(false)
                        }}
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          className="hover:cursor-pointer"
                          href={APP_URL.AUTH.LOGIN}
                        >
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button className="w-full hover:cursor-pointer" asChild>
                        <Link
                          className="hover:cursor-pointer"
                          href={APP_URL.AUTH.REGISTER}
                        >
                          Crear Cuenta
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
