'use client'
import { IUserRoleFull } from '@/types'
import { AddUsersDialog } from '../../components'
import { getUserList } from '@/services/user.services'
import { createUserRole } from '@/services/user.roles.services'
import { User } from '../../components/add-users-dialog'
import { APP_URL } from '@/data/config-app-url'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

interface IProps {
  existingUsers: IUserRoleFull[]
  institutionId: string
}

export const AddUserSection = (props: IProps) => {
  const { existingUsers, institutionId } = props

  const handleAddUser = async (userId: string) => {
    const { data, error } = await createUserRole({
      userId,
      institutionId,
      role: 'editor',
      urlRevalidate: APP_URL.ORGANIZATION.USERS.USER_INSTITUTION(institutionId)
    })
    if (error) {
      toast.error(
        <ToastCustom title="Error" description="Error al añadir el usuario" />
      )
      console.error('Error adding user:', error)
    } else {
      toast.success(
        <ToastCustom
          title="Éxito"
          description={`Usuario ${data?.user?.email} añadido correctamente`}
        />
      )
    }
  }

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
          const userSeleted = selectedUsers[0]
          await handleAddUser(userSeleted.id)
        }}
        className="w-full"
        addButtonText="Añadir a la institución"
      />
    </div>
  )
}
