'use client'
import { AddUsersDialog } from '../../components'

export const AddUserSection = () => {
  return (
    <div>
      <AddUsersDialog
        onAddUsers={async (users) => {
          console.log('Usuarios añadidos:', users)
        }}
        searchUsers={async (query) => {
          // Simulación de búsqueda de usuarios
          return [
            {
              id: '1',
              name: 'Juan Pérez',
              username: 'juanperez',
              email: 'juan.perez@example.com'
            }
          ]
        }}
        className="w-full"
        addButtonText="Añadir a la institución"
      />
    </div>
  )
}
