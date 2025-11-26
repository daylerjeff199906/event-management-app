import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@/components/ui/table'

interface RecentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  profile_image: string | null
}

interface UsersTableProps {
  users: RecentUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  // Formatea fecha a DD.MM.YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Iniciales para avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Fecha de registro</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              className="hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 border-2 border-white">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </TableCell>

              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>

              <TableCell className="text-gray-600">{user.email}</TableCell>

              <TableCell className="text-gray-600">
                {formatDate(user.created_at)}
              </TableCell>

              <TableCell>
                <Badge
                  variant={index % 2 === 0 ? 'default' : 'secondary'}
                  className={
                    index % 2 === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {index % 2 === 0 ? 'Active' : 'Pending'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
