'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Menu,
  ChevronDown,
  MapPin,
  Search,
  User,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoRender } from '@/components/app/miscellaneous/logo-render'
import { APP_URL } from '@/data/config-app-url'
import { Category } from '@/types'
import { ProfilePopover } from '@/components/app/navbar-custom/profile-popover'
import { MENU_PROFILE } from '@/components/app/navbar-custom/profile-menu'
import { ModeToggle } from '@/components/app/miscellaneous/mode-toggle'
import { useSearchParams } from 'next/navigation'

export interface SearchConfig {
  placeholder?: string
  onSearch?: (query: string) => void
  showSearchButton?: boolean
}

export interface CategoryConfig {
  label: string
  options: string[]
  onCategorySelect?: (category: string) => void
}

export interface UserConfig {
  isLoggedIn?: boolean
  userName?: string
  email?: string
  userAvatar?: string
  onLogout?: () => void
  onProfile?: () => void
  onSettings?: () => void
}

export interface NavbarFeverProps {
  // Logo props
  logoText?: string
  logoHref?: string

  // Search configuration
  searchConfig?: SearchConfig

  // Category configuration
  categoryConfig?: CategoryConfig

  // User configuration
  userConfig?: UserConfig

  // Style props
  className?: string
  variant?: 'default' | 'transparent'
  categories?: Category[]
}

export function NavbarCustom({
  logoHref = '/',
  searchConfig = {
    placeholder: 'Descubrir eventos ...',
    showSearchButton: true
  },
  userConfig = {
    isLoggedIn: false
  },
  className,
  variant = 'default',
  categories = []
}: NavbarFeverProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<string>(
    'Detectando ubicación...'
  )

  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  // const searchParam = searchParams.get('search') || ''

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Usando API de geocoding reverso para obtener la ciudad
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
            )
            const data = await response.json()
            const city =
              data.city ||
              data.locality ||
              data.principalSubdivision ||
              'Ubicación detectada'
            setUserLocation(city)
          } catch (error) {
            console.error('Error obteniendo ubicación:', error)
            setUserLocation('Ubicación no disponible')
          }
        },
        (error) => {
          console.error('Error de geolocalización:', error)
          setUserLocation('Ubicación no disponible')
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      )
    } else {
      setUserLocation('Geolocalización no soportada')
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchConfig.onSearch && searchQuery.trim()) {
      searchConfig.onSearch(searchQuery.trim())
    }
  }

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full border-b bg-white shadow-sm dark:border-gray-800 dark:bg-zinc-900',
        variant === 'transparent' &&
          'bg-gray-900/40 border-transparent shadow-none dark:bg-dark backdrop-blur',
        className
      )}
      style={{
        zIndex: 9999
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <LogoRender isOpened href={logoHref} />
            <hr
              className={cn(
                'h-6 border-l border-gray-300',
                variant === 'transparent' && 'border-white/50'
              )}
            />
            <div
              className={cn(
                'items-center gap-2 text-muted-foreground hidden md:flex',
                variant === 'transparent' && 'text-white/90'
              )}
            >
              <MapPin className="h-4 w-4" />
              <span className="max-w-32 truncate text-sm">{userLocation}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 max-w-4xl justify-center w-full">
            {/* Categories */}
            {categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center gap-1 text-muted-foreground hover:text-foreground',
                      variant === 'transparent' && 'text-white/90'
                    )}
                  >
                    {categoryParam
                      ? categories.find(
                          (cat) => cat.id.toString() === categoryParam
                        )?.name || 'Categorías'
                      : 'Categorías'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => {
                        if (categoryParam === category.id.toString()) {
                          // Si la categoría ya está seleccionada, la deseleccionamos
                          const params = new URLSearchParams(
                            searchParams.toString()
                          )
                          params.delete('category')
                          params.delete('page')
                          window.location.search = params.toString()
                        } else {
                          const params = new URLSearchParams(
                            searchParams.toString()
                          )
                          params.set('category', category.id.toString())
                          params.delete('page')
                          window.location.search = params.toString()
                        }
                      }}
                      className={cn(
                        categoryParam === category.id.toString() &&
                          'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchConfig.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-muted/50 border-0 focus:bg-background rounded-full"
                />
                {searchConfig.showSearchButton && (
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-7 rounded-full p-0"
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* User Section - Desktop */}
            <ModeToggle
              variant={variant === 'transparent' ? 'light' : 'default'}
            />
            <div className="hidden md:block">
              {userConfig.isLoggedIn ? (
                <>
                  {/*Menu de perfil*/}
                  <ProfilePopover
                    profileData={{
                      names: `${userConfig.userName || 'Usuario'}`,
                      email: userConfig.email || '',
                      photo: userConfig.userAvatar || ''
                    }}
                    menuSections={MENU_PROFILE.APP_MENU}
                    showProgress={false}
                    showBorders={false}
                  />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm"
                    asChild
                  >
                    <Link href={APP_URL.AUTH.LOGIN}>Iniciar Sesión</Link>
                  </Button>
                  <Button className="rounded-full text-sm" asChild>
                    <Link href={APP_URL.AUTH.REGISTER}>Registrarse</Link>
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
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={searchConfig.placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Ubicación
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {userLocation}
                    </div>
                  </div>

                  {/* Mobile Categories */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Categorías
                    </h3>
                    {categories.map((category: Category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          // If you want to call a callback, you can add it here
                          setIsSheetOpen(false)
                        }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="pt-4 border-t space-y-2">
                    {userConfig.isLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 py-2">
                          {userConfig.userAvatar ? (
                            <img
                              src={userConfig.userAvatar || '/placeholder.svg'}
                              alt="Avatar"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                              {userConfig.userName
                                ? userConfig.userName.charAt(0).toUpperCase()
                                : 'U'}
                            </div>
                          )}
                          <span className="font-medium">
                            {userConfig.userName || 'Usuario'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            userConfig.onProfile?.()
                            setIsSheetOpen(false)
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mi Perfil
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            userConfig.onSettings?.()
                            setIsSheetOpen(false)
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configuración
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            userConfig.onLogout?.()
                            setIsSheetOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
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
                          <Link href={APP_URL.AUTH.LOGIN}>Iniciar Sesión</Link>
                        </Button>
                        <Button className="w-full" variant="default" asChild>
                          <Link href={APP_URL.AUTH.REGISTER}>Registrarse</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
