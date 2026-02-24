'use client'

import { useEffect, useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { IProfile } from '@/types'
import { updateUserRoles } from '@/services/user.services'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super admin' }
] as const

interface UsersTableProps {
  users: IProfile[]
  currentUserId?: string
  canManageRoles?: boolean
}

interface RoleModalProps {
  user: IProfile
  onRolesUpdated: (roles: string[] | null) => void
}

const RoleUpdateModal = ({ user, onRolesUpdated }: RoleModalProps) => {
  const [open, setOpen] = useState(false)

  // Convertir global_role a array para el estado del componente
  const getInitialRoles = () => {
    if (user.global_role === 'super_admin') return ['SUPER_ADMIN']
    if (user.global_role === 'admin') return ['ADMIN']
    return []
  }

  const [selectedRoles, setSelectedRoles] = useState<string[]>(getInitialRoles())
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (open) {
      setSelectedRoles(getInitialRoles())
    }
  }, [open, user.global_role])

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((item) => item !== role)
        : [...prev, role]
    )
  }

  const handleSave = () => {
    if (!user.id) return
    startTransition(async () => {
      const rolesToSave = selectedRoles.length ? selectedRoles : null
      const { error, data } = await updateUserRoles({
        userId: user?.id || '',
        roles: rolesToSave,
        revalidateUrl: '/dashboard/admin/users'
      })

      if (error || !data) {
        toast.error(
          <ToastCustom
            title="Error al guardar"
            description={
              error?.message ||
              'No se pudo actualizar el rol del usuario seleccionado.'
            }
          />
        )
        return
      }

      toast.success(
        <ToastCustom
          title="Roles actualizados"
          description="Los permisos del usuario se guardaron correctamente."
        />
      )
      onRolesUpdated(rolesToSave)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Gestionar roles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Actualizar roles</DialogTitle>
          <DialogDescription>
            Selecciona los roles que deseas asignar al usuario.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {ROLE_OPTIONS.map((role) => (
            <label
              key={role.value}
              className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted"
            >
              <Checkbox
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={() => toggleRole(role.value)}
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{role.label}</span>
                <span className="text-xs text-muted-foreground">
                  {role.value === 'ADMIN'
                    ? 'Acceso de administracion general.'
                    : 'Permisos completos sobre el sistema.'}
                </span>
              </div>
            </label>
          ))}
          <p className="text-xs text-muted-foreground">
            Dejar sin roles eliminara todos los permisos (se guardara como valor
            nulo).
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UsersTableList({
  users,
  currentUserId,
  canManageRoles = false
}: UsersTableProps) {
  const [userList, setUserList] = useState<IProfile[]>(users)

  useEffect(() => {
    setUserList(users)
  }, [users])

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0) || ''
    const lastInitial = lastName?.charAt(0) || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-ES')
  }

  const getCountryDisplay = (country: string | null) => {
    return country || 'N/A'
  }

  const getGenderDisplay = (gender: string | null) => {
    if (!gender) return 'N/A'

    const genderMap: { [key: string]: string } = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro'
    }

    return genderMap[gender.toLowerCase()] || gender
  }

  const renderRoles = (roles?: string[] | null) => {
    if (!roles || roles.length === 0) {
      return <span className="text-xs text-muted-foreground">Sin roles</span>
    }

    return (
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Badge key={role} variant="outline">
            {role}
          </Badge>
        ))}
      </div>
    )
  }

  const handleRolesUpdated = (userId: string, roles: string[] | null) => {
    let newGlobalRole: IProfile['global_role'] = 'user'
    if (roles?.includes('SUPER_ADMIN')) newGlobalRole = 'super_admin'
    else if (roles?.includes('ADMIN')) newGlobalRole = 'admin'

    setUserList((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
            ...user,
            global_role: newGlobalRole
          }
          : user
      )
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>USUARIO</TableHead>
            <TableHead>INFORMACION PERSONAL</TableHead>
            <TableHead>CONTACTO</TableHead>
            <TableHead>ROLES</TableHead>
            <TableHead>FECHA DE REGISTRO</TableHead>
            {canManageRoles && <TableHead className="w-[140px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList?.map((user) => {
            const isSelf = user?.id === currentUserId
            const isSuperAdmin = user?.global_role === 'super_admin'
            const canEditThisUser =
              canManageRoles && !isSelf && !isSuperAdmin && !!user?.id

            return (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profile_image || undefined}
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(user?.first_name, user?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.username || user?.email}
                    </span>
                    {isSelf && (
                      <Badge variant="outline" className="w-fit text-xs">
                        Tu
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {getGenderDisplay(user?.gender)}
                      </Badge>
                      {user?.birth_date && (
                        <Badge variant="outline" className="text-xs">
                          {formatDate(user.birth_date)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">
                      {user?.email || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.phone || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getCountryDisplay(user?.country)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {user?.global_role !== 'user' ? (
                    <Badge variant="outline">
                      {user.global_role.toUpperCase()}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin roles</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-sm">{formatDate(user?.created_at)}</p>
                    {user?.updated_at &&
                      user.updated_at !== user.created_at && (
                        <p className="text-xs text-muted-foreground">
                          Actualizado: {formatDate(user.updated_at)}
                        </p>
                      )}
                  </div>
                </TableCell>
                {canManageRoles && (
                  <TableCell className="text-right">
                    {canEditThisUser ? (
                      <RoleUpdateModal
                        user={user}
                        onRolesUpdated={(roles) =>
                          handleRolesUpdated(user.id || '', roles)
                        }
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {isSelf
                          ? 'No puedes editarte.'
                          : isSuperAdmin
                            ? 'Protegido.'
                            : 'Sin acciones.'}
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {userList.length > 0 && (
        <div className="px-4 py-3 text-sm text-muted-foreground border-t">
          {userList.length} usuario{userList.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
