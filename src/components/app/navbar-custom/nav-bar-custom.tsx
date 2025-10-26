'use client'
import { SheetMenu } from './sheet-menu'
import { useSidebar } from '@/hooks'
import { cn } from '@/lib/utils'
import { IMoreApp } from './interface.navbar'
import { SectionElement } from '@/types'
import { useStore } from 'zustand'
import { MENU_PROFILE } from './profile-menu'
import { ProfilePopover } from './profile-popover'
import { SearchBar } from '../miscellaneous/search-bar'
import { ModeToggle } from '../miscellaneous/mode-toggle'
import { TeamSwitcher } from './team-switcher'
import { Building2, Columns3Cog, User } from 'lucide-react'
import { APP_URL } from '@/data/config-app-url'

interface NavBarCustomProps {
  moreApps?: Array<IMoreApp>
  userName?: string
  urlPhoto?: string
  email?: string
  menuItems?: SectionElement[]
}

export const NavBarCustom = (props: NavBarCustomProps) => {
  const { userName, urlPhoto, email, menuItems } = props

  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null

  return (
    <header
      className={cn(
        `sticky top-0 z-50 w-full border border-b-gray-200 bg-white dark:bg-zinc-900 dark:border-b-gray-700`
      )}
    >
      <div className="px-4 sm:px-6 md:px-7 flex h-16 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0 sm:gap-3 w-full">
          <SheetMenu title="Tu panel" menuItems={menuItems} />
          <div className="hidden lg:flex items-center justify-start gap-4 flex-1">
            <TeamSwitcher
              teams={[
                {
                  name: 'Perfil de usuario',
                  logo: User,
                  plan: 'Mi perfil',
                  href: APP_URL.DASHBOARD.BASE
                },
                {
                  name: 'Mis organizaciones',
                  logo: Building2,
                  plan: 'Owner',
                  href: APP_URL.ORGANIZATION.BASE
                },
                {
                  name: 'Administrador',
                  logo: Columns3Cog,
                  plan: 'Panel Admin',
                  href: APP_URL.ADMIN.BASE
                }
              ]}
            />
          </div>
          <div className="w-full flex items-center justify-between gap-2 max-w-2xl mx-auto">
            <SearchBar showSmartButton={false} />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          {/*Menu de perfil*/}
          <ModeToggle />
          <ProfilePopover
            profileData={{
              names: `${userName}`,
              email,
              photo: urlPhoto
            }}
            menuSections={MENU_PROFILE.APP_MENU}
            showProgress={false}
            showBorders={false}
          />
        </div>
      </div>
    </header>
  )
}
