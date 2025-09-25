
import * as React from 'react'
import { Search, UserPlus } from 'lucide-react'
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
  role?: string
}

// Props del componente
interface AddUsersDialogProps {
  onAddUsers: (users: User[]) => Promise<void>
  searchUsers: (query: string) => Promise<User[]>
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

export function AddUsersDialog({
  onAddUsers,
  searchUsers,
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
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)

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

  // Función para alternar la selección de un usuario
  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id)
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  // Función para manejar la adición de usuarios
  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) return

    setIsAdding(true)
    try {
      await onAddUsers(selectedUsers)
      // Resetear estado después de añadir exitosamente
      setSelectedUsers([])
      setSearchQuery('')
      setSearchResults([])
      setOpen(false)
    } catch (error) {
      console.error('Error al añadir usuarios:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Resetear estado cuando se cierra el dialog
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedUsers([])
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
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id
                    )
                    return (
                      <div
                        key={user.id}
                        className={cn(
                          'flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent',
                          isSelected && 'bg-accent'
                        )}
                        onClick={() => toggleUserSelection(user)}
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
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.username} • {user.role || 'Colaborador'}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="size-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="size-2 rounded-full bg-primary-foreground" />
                          </div>
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

          {/* Usuarios seleccionados */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Usuarios seleccionados ({selectedUsers.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
                  >
                    <Avatar className="size-5">
                      <AvatarImage
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                ))}
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
          <Button
            onClick={handleAddUsers}
            disabled={selectedUsers.length === 0 || isAdding}
          >
            {isAdding ? 'Añadiendo...' : addButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
