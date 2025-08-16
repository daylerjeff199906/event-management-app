'use client'
import { MenuSection } from './interfaces.profile.popover'
import { APP_URL } from '@/data/config-app-url'
import { handleLogout } from '@/utils/logout'

export const MENU_PROFILE_USER: MenuSection[] = [
  {
    label: 'Opciones',
    items: [
      {
        label: 'Perfil',
        href: APP_URL.PROFILE.URL_BASE
      },
      {
        label: 'Mi cuenta',
        href: APP_URL.PROFILE.ACCOUNT
      },
      {
        label: 'Cerrar sesión',
        onClick: () => {
          handleLogout(APP_URL.AUTH.LOGIN)
        }
      }
    ]
  }
]

export const MENU_PROFILE = {
  APP_MENU: MENU_PROFILE_USER
}
