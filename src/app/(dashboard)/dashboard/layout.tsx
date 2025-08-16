'use client'
import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'
import { APP_URL } from '@/data/config-app-url'
import { HomeIcon, Settings, Star, TicketIcon, UserIcon } from 'lucide-react'

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
                url: APP_URL.DASHBOARD.BASE,
                icon: HomeIcon
              },
              submenus: []
            },
            {
              menu: {
                id: 2,
                name: 'Eventos',
                url: APP_URL.DASHBOARD.EVENTS.BASE,
                icon: TicketIcon
              },
              submenus: []
            },
            {
              menu: {
                id: 3,
                name: 'Mis favoritos',
                url: APP_URL.DASHBOARD.FAVORITES,
                icon: Star
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
                url: APP_URL.DASHBOARD.PROFILE,
                icon: UserIcon
              },
              submenus: []
            },
            {
              menu: {
                id: 5,
                name: 'Configuración',
                url: APP_URL.DASHBOARD.SETTINGS,
                icon: Settings
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
