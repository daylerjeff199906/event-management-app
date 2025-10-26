import { APP_URL } from '@/data/config-app-url'
import { Building2, Columns3Cog, User } from 'lucide-react'

export const teamOptions = [
  {
    key: 'profile',
    name: 'Perfil de usuario',
    logo: User,
    plan: 'Mi perfil',
    href: APP_URL.DASHBOARD.BASE,
    roles: ['user']
  },
  {
    key: 'organization',
    name: 'Mis organizaciones',
    logo: Building2,
    plan: 'Owner',
    href: APP_URL.ORGANIZATION.BASE,
    roles: ['institutional']
  },
  {
    key: 'admin',
    name: 'Administrador',
    logo: Columns3Cog,
    plan: 'Panel Admin',
    href: APP_URL.ADMIN.BASE,
    roles: ['admin']
  }
]
