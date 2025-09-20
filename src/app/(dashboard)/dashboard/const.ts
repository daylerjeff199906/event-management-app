import { APP_URL } from '@/data/config-app-url'
import { SectionElement } from '@/types'

export const menuDashboard: SectionElement[] = [
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
          icon: 'HomeIcon'
        },
        submenus: []
      },
      {
        menu: {
          id: 2,
          name: 'Eventos',
          url: APP_URL.DASHBOARD.EVENTS.BASE,
          icon: 'Calendar'
        },
        submenus: []
      },
      {
        menu: {
          id: 3,
          name: 'Mis favoritos',
          url: APP_URL.DASHBOARD.FAVORITES,
          icon: 'Heart'
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
          icon: 'UserIcon'
        },
        submenus: []
      },
      {
        menu: {
          id: 5,
          name: 'Configuración',
          url: APP_URL.DASHBOARD.SETTINGS,
          icon: 'Settings'
        },
        submenus: []
      }
    ]
  }
]

export const subMenuElementInstitucional: SectionElement = {
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
        icon: 'Layers',
        isExternal: true
      },
      submenus: []
    }
  ]
}

export const menuOrganization = (idInstitution: string): SectionElement[] => [
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
          icon: 'HomeIcon'
        },
        submenus: []
      },
      {
        menu: {
          id: 2,
          name: 'Usuarios',
          url: APP_URL.ORGANIZATION.USERS.USER_INSTITUTION(idInstitution),
          icon: 'Users'
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
          icon: 'Settings'
        },
        submenus: []
      },
      {
        menu: {
          id: 4,
          name: 'Pagos',
          url: '#',
          icon: 'Coins',
          isDisabled: true
        },
        submenus: []
      }
    ]
  }
]

export const adminMenu: SectionElement[] = [
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
          icon: 'HomeIcon'
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
          icon: 'ClipboardCheck'
        },
        submenus: []
      },
      {
        menu: {
          id: 3,
          name: 'Instituciones',
          url: APP_URL.ADMIN.INSTITUTIONS.BASE,
          icon: 'Layers'
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
          icon: 'Users'
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
          icon: 'Settings'
        },
        submenus: []
      }
    ]
  }
]
