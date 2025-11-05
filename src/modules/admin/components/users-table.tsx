import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

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
  // Format date to DD.MM.YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              User
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              Profile
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
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
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(user.created_at)}
              </td>
              <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                {user.profile_image ? 'Has Photo' : 'No Photo'}
              </td>
              <td className="px-6 py-4 text-sm">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
