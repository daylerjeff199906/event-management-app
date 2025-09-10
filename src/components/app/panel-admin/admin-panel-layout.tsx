'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import { SideBar } from './side-bar'
import { SectionElement } from '@/types'
import { NavBarCustom } from '../navbar-custom/nav-bar-custom'
import { Footer } from './footer'

// SubmenuElement

export default function AdminPanelLayout({
  children,
  email,
  urlPhoto,
  userName,
  menuItems,
  menuOptional,
  isInstitutional = false
}: {
  children: React.ReactNode
  menuItems?: SectionElement[]
  email?: string
  urlPhoto?: string
  userName?: string
  isInstitutional?: boolean
  menuOptional?: SectionElement[]
}) {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState, settings } = sidebar
  const isCurrentlyOpen = getOpenState()

  const menuDashboardFinal = isInstitutional
    ? [...(menuItems ?? []), ...(menuOptional ?? [])]
    : menuItems ?? []

  return (
    <>
      <SideBar menuItems={menuDashboardFinal} />

      <main
        className={cn(
          'min-h-screen bg-background dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 relative',
          !settings.disabled && (isCurrentlyOpen ? 'lg:ml-60' : 'lg:ml-[90px]')
        )}
      >
        <NavBarCustom
          urlPhoto={urlPhoto}
          email={email}
          userName={userName}
          menuItems={menuDashboardFinal}
        />
        <main className="w-full container mx-auto py-4 zoom-adjust px-4 md:px-6">
          {children}
        </main>
      </main>
      <Footer />
    </>
  )
}
