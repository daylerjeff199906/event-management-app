import * as React from 'react'
import { Search, UserPlus, Check, UserX } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

// Tipo para representar un usuario
export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  role?: string | null
}

// Props del componente
interface AddUsersDialogProps {
  onAddUsers: (users: User[]) => Promise<void>
  searchUsers: (query: string) => Promise<User[]>
  existingUsers?: User[]
  isLoading?: boolean
  trigger?: React.ReactNode
  title?: string
  description?: string
  searchPlaceholder?: string
  addButtonText?: string
  cancelButtonText?: string
  className?: string
}

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para memorizar los existingUsers
function useExistingUsers(existingUsers: User[] = []) {
  const existingUsersIds = React.useMemo(() => {
    return new Set(existingUsers.map((user) => user.id))
  }, [existingUsers])

  return existingUsersIds
}

export function AddUsersDialog({
  onAddUsers,
  searchUsers,
  existingUsers = [],
  isLoading = false,
  trigger,
  title = 'Añadir personas al proyecto',
  description = 'Buscar por nombre de usuario, nombre completo o email',
  searchPlaceholder = 'Buscar personas',
  addButtonText = 'Añadir al proyecto',
  cancelButtonText = 'Cancelar',
  className
}: AddUsersDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<User[]>([])
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isSearching, setIsSearching] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)

  // Memorizar los IDs de los usuarios existentes
  const existingUsersIds = useExistingUsers(existingUsers)

  // Debounce de la búsqueda para evitar llamadas excesivas
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Efecto para realizar la búsqueda cuando cambia el query debounced
  React.useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await searchUsers(debouncedSearchQuery)
        // Ya no filtramos, mostramos todos los resultados
        setSearchResults(results)
      } catch (error) {
        console.error('Error al buscar usuarios:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery, searchUsers])

  // Función para seleccionar un usuario (solo si no está ya añadido)
  const handleUserSelection = (user: User) => {
    if (!existingUsersIds.has(user.id)) {
      setSelectedUser(user)
    }
  }

  // Función para deseleccionar el usuario
  const handleDeselectUser = () => {
    setSelectedUser(null)
  }

  // Función para manejar la adición del usuario
  const handleAddUser = async () => {
    if (!selectedUser) return

    setIsAdding(true)
    try {
      await onAddUsers([selectedUser])
      // Resetear estado después de añadir exitosamente
      setSelectedUser(null)
      setSearchQuery('')
      setSearchResults([])
      setOpen(false)
    } catch (error) {
      console.error('Error al añadir usuario:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Resetear estado cuando se cierra el dialog
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedUser(null)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={className}>
            <UserPlus className="size-4" />
            Añadir personas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Resultados de búsqueda */}
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4">
              {isSearching && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    Buscando...
                  </div>
                </div>
              )}

              {!isSearching && searchQuery && searchResults.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    No se encontraron usuarios
                  </div>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((user) => {
                    const isSelected = selectedUser?.id === user.id
                    const isExistingUser = existingUsersIds.has(user.id)

                    return (
                      <div
                        key={user.id}
                        className={cn(
                          'flex items-center gap-3 rounded-lg p-3 transition-colors',
                          isExistingUser
                            ? 'cursor-not-allowed opacity-50 bg-muted/30'
                            : 'cursor-pointer hover:bg-accent',
                          isSelected && !isExistingUser && 'bg-accent'
                        )}
                        onClick={() =>
                          !isExistingUser && handleUserSelection(user)
                        }
                      >
                        <Avatar className="size-10">
                          <AvatarImage
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {user.name}
                            {isExistingUser && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                <Check className="size-3" />
                                Ya añadido
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.username} • {user.role || 'Colaborador'}
                          </div>
                        </div>
                        {isSelected && !isExistingUser && (
                          <div className="size-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="size-2 rounded-full bg-primary-foreground" />
                          </div>
                        )}
                        {isExistingUser && (
                          <UserX className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {!searchQuery && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    Escribe para buscar usuarios
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Usuario seleccionado */}
          {selectedUser && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Usuario seleccionado</div>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-accent">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={selectedUser.avatar || '/placeholder.svg'}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {selectedUser.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedUser.username}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectUser}
                  className="h-8 px-2"
                >
                  Cambiar
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAdding}
          >
            {cancelButtonText}
          </Button>
          <Button onClick={handleAddUser} disabled={!selectedUser || isAdding}>
            {isAdding ? 'Añadiendo...' : addButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
