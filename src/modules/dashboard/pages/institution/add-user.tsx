'use client'
import { IUserRoleFull } from '@/types'
import { AddUsersDialog } from '../../components'
import { getUserList } from '@/services/user.services'
import { User } from '../../components/add-users-dialog'

interface IProps {
  existingUsers: IUserRoleFull[]
}

export const AddUserSection = (props: IProps) => {
  const { existingUsers } = props

  return (
    <div>
      <AddUsersDialog
        existingUsers={
          existingUsers?.map(
            (user): User => ({
              id: String(user.user?.id),
              name: `${user.user?.first_name} ${user.user?.last_name}`,
              username: user.user?.username || '',
              email: user.user?.email || '',
              avatar: user.user?.profile_image || undefined,
              role: user.role || null
            })
          ) || []
        }
        searchUsers={async (query: string) => {
          const userList = await getUserList({
            page: 1,
            searchQuery: query
          })
          return (
            (userList.data.map((user) => ({
              id: user.id!,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email || '',
              username: user.username || '',
              avatar: user.profile_image || null
            })) as User[]) || []
          )
        }}
        searchPlaceholder="Buscar usuarios por email o username"
        onAddUsers={async (selectedUsers: User[]) => {
          // Aquí deberías llamar a tu servicio para añadir usuarios a la institución
          console.log('Usuarios añadidos:', selectedUsers)
        }}
        className="w-full"
        addButtonText="Añadir a la institución"
      />
    </div>
  )
}
