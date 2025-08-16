import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'

interface IProps {
  children: React.ReactNode
}

export default function Layout(props: IProps) {
  const { children } = props
  return (
    <AdminPanelLayout
      menuItems={[
        {
          section: {
            id: 1,
            name: 'Opciones generales'
          },
          menus: [
            {
              menu: {
                id: 1,
                name: 'Inicio',
                url: APP_URL.DASHBOARD.BASE
              },
              submenus: []
            },
            {
              menu: {
                id: 2,
                name: 'Descubre los eventos',
                url: APP_URL.DASHBOARD.EVENTS.BASE
              },
              submenus: []
            }
          ]
        },
        {
          section: {
            id: 2,
            name: 'Sección anclados'
          },
          menus: [
            {
              menu: {
                id: 3,
                name: 'Mis favoritos',
                url: APP_URL.DASHBOARD.FAVORITES
              },
              submenus: []
            }
          ]
        },
        {
          section: {
            id: 3,
            name: 'Mi perfil'
          },
          menus: [
            {
              menu: {
                id: 4,
                name: 'Perfil',
                url: APP_URL.DASHBOARD.PROFILE
              },
              submenus: []
            },
            {
              menu: {
                id: 5,
                name: 'Configuración',
                url: APP_URL.DASHBOARD.SETTINGS
              },
              submenus: []
            }
          ]
        }
      ]}
    >
      {children}
    </AdminPanelLayout>
  )
}
