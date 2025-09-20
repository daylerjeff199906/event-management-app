'use client'
import { APP_URL } from '@/data/config-app-url'
import {
  Building,
  Coins,
  // Dock,
  HomeIcon,
  Layers,
  Settings,
  Star,
  TicketIcon,
  UserIcon,
  Users
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

export const subMenuElementInstitucional = {
  section: {
    id: 4,
    name: 'Institucional'
  },
  menus: [
    {
      menu: {
        id: 4,
        name: 'Instituciones',
        url: APP_URL.ORGANIZATION.INSTITUTION.BASE,
        icon: Layers,
        isExternal: true
      },
      submenus: []
    }
  ]
}

export const menuOrganization = (idInstitution: string) => [
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
          url: APP_URL.ORGANIZATION.BASE,
          icon: HomeIcon
        },
        submenus: []
      },
      {
        menu: {
          id: 2,
          name: 'Usuarios',
          url: APP_URL.ORGANIZATION.USERS.USER_INSTITUTION(idInstitution),
          icon: Users
        },
        submenus: []
      }
    ]
  },
  {
    section: {
      id: 2,
      name: 'Configuración'
    },
    menus: [
      {
        menu: {
          id: 3,
          name: 'Configuración',
          url: APP_URL.ORGANIZATION.CONFIGURATIONS.CONFIG_INSTITUTION(
            idInstitution
          ),
          icon: Settings
        },
        submenus: []
      },
      {
        menu: {
          id: 4,
          name: 'Pagos',
          url: '#',
          icon: Coins,
          isDisabled: true
        },
        submenus: []
      }
    ]
  }
]

export const adminMenu = [
  {
    section: {
      id: 1,
      name: 'Administración'
    },
    menus: [
      {
        menu: {
          id: 1,
          name: 'Inicio',
          url: APP_URL.ADMIN.BASE,
          icon: HomeIcon
        },
        submenus: []
      }
    ]
  },
  {
    section: {
      id: 2,
      name: 'Gestión'
    },
    menus: [
      {
        menu: {
          id: 2,
          name: 'Solcitudes',
          url: APP_URL.ADMIN.REQUESTS_APPROVAL.BASE,
          icon: Layers
        },
        submenus: []
      },
      {
        menu: {
          id: 3,
          name: 'Instituciones',
          url: APP_URL.ADMIN.INSTITUTIONS.BASE,
          icon: Building
        },
        submenus: []
      }
    ]
  },
  {
    section: {
      id: 3,
      name: 'Usuarios'
    },
    menus: [
      {
        menu: {
          id: 4,
          name: 'Usuarios',
          url: APP_URL.ADMIN.USERS.BASE,
          icon: UserIcon
        },
        submenus: []
      }
    ]
  },
  {
    section: {
      id: 4,
      name: 'Configuración'
    },
    menus: [
      {
        menu: {
          id: 5,
          name: 'Configuración',
          url: APP_URL.ADMIN.SETTINGS,
          icon: Settings
        },
        submenus: []
      }
    ]
  }
]
