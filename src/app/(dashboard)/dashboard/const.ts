import { APP_URL } from '@/data/config-app-url'
import {
  Dock,
  HomeIcon,
  Settings,
  Star,
  TicketIcon,
  UserIcon
} from 'lucide-react'

export const menuDashboard = [
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
          id: 1,
          name: 'Mis tickets',
          url: APP_URL.DASHBOARD.TICKETS,
          icon: Dock
        },
        submenus: []
      },
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
]
