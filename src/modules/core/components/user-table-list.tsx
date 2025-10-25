'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { IUser } from '@/types'

interface UsersTableProps {
  users: IUser[]
  currentUserId?: string
  showActions?: boolean
  onEditUser?: (user: IUser) => void
}

export function UsersTableList({
  users,
  currentUserId,
  showActions = false,
  onEditUser
}: UsersTableProps) {
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0) || ''
    const lastInitial = lastName?.charAt(0) || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const formatDate = (date: Date | null) => {
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

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>USUARIO</TableHead>
            <TableHead>INFORMACIÓN PERSONAL</TableHead>
            <TableHead>CONTACTO</TableHead>
            <TableHead>FECHA DE REGISTRO</TableHead>
            {showActions && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
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
                  {user?.id === currentUserId && (
                    <Badge variant="outline" className="w-fit text-xs">
                      Tú
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
                <div className="flex flex-col">
                  <p className="text-sm">{formatDate(user?.created_at)}</p>
                  {user?.updated_at && user.updated_at !== user.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Actualizado: {formatDate(user.updated_at)}
                    </p>
                  )}
                </div>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    {onEditUser && (
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length > 0 && (
        <div className="px-4 py-3 text-sm text-muted-foreground border-t">
          {users.length} usuario{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
