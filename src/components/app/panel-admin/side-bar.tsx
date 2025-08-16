import { cn } from '@/lib/utils'
import React from 'react'
import { Menu } from './menu'
import { useSidebar } from '@/hooks/use-sidebar'
import { useStore } from '@/hooks/use-store'
import { SectionElement } from '@/types'
import { LogoRender } from '../miscellaneous/logo-render'
import { APP_URL } from '@/data/config-app-url'
import { PanelLeftDashed } from 'lucide-react'

interface SideBarProps {
  // app?: MenuConfigApps
  menuItems?: SectionElement[]
}

export const SideBar = (props: SideBarProps) => {
  const { menuItems } = props
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState, setIsHover, settings, setIsOpen, isOpen } = sidebar

  return (
    <aside
      className={cn(
        `fixed top-0 left-0 z-10 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 w-72 text-white bg-gray-900 dark:bg-zinc-900 shadow-md dark:shadow-zinc-800`,
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden'
      )}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 w-full"
      >
        <div
          className={cn(
            'flex items-center',
            isOpen ? 'justify-between' : 'justify-center'
          )}
        >
          <LogoRender
            nameApp="Tu panel"
            subtitle="Bienvenido"
            href={APP_URL.DASHBOARD.BASE}
            className="w-full max-w-36"
          />
          <button onClick={() => setIsOpen(!isOpen)}>
            <PanelLeftDashed />
          </button>
        </div>
        <Menu isOpen={getOpenState()} menuItems={menuItems} />
      </div>
    </aside>
  )
}
