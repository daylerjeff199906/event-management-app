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
            }
          ]
        }
      ]}
    >
      {children}
    </AdminPanelLayout>
  )
}
