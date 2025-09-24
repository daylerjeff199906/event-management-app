'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { EditRoleUserModal } from '@/modules/dashboard/components/edit-role-user-modal'
import { IUserRoleFull } from '@/types'
import { X } from 'lucide-react'

interface UsersTableProps {
  users: IUserRoleFull[]
  currentUserId?: string
  isOwner?: boolean
}

export function UsersTable({ users, currentUserId, isOwner }: UsersTableProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.charAt(0) || ''
    const lastInitial = lastName?.charAt(0) || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'institution_owner':
        return 'outline'
      case 'member':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>USUARIO</TableHead>
            <TableHead>DETALLES</TableHead>
            <TableHead>HABILITADO</TableHead>
            <TableHead>ROL</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((userRole) => (
            <TableRow key={userRole.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userRole?.user?.profile_image || undefined}
                    alt={`${userRole?.user?.first_name} ${userRole?.user?.last_name}`}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      userRole?.user?.first_name,
                      userRole?.user?.last_name
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userRole?.user?.email}
                  </span>
                  {userRole?.user_id === currentUserId && (
                    <Badge variant="outline" className="w-fit text-xs">
                      Tú
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    {userRole?.user?.first_name && userRole?.user?.last_name
                      ? `${userRole?.user?.first_name} ${userRole?.user?.last_name}`
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userRole?.user?.phone || 'N/A'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={userRole.access_enabled ? 'default' : 'secondary'}
                >
                  {userRole.access_enabled ? 'Sí' : 'No'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(userRole?.role)}>
                  {userRole?.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  {/* {isOwner && !(userRole?.user_id === currentUserId) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      // onClick={() => onRemoveUser(userRole?.user_id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )} */}
                  {isOwner && !(userRole?.user_id === currentUserId) && (
                    <EditRoleUserModal
                      key={userRole.id}
                      idRole={userRole.id}
                      value={userRole?.role}
                      userId={userRole?.user_id}
                      institutionId={userRole?.institution_id?.toString() || ''}
                    />
                  )}
                </div>
              </TableCell>
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
