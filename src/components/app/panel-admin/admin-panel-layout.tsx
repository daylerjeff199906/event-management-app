'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import { SideBar } from './side-bar'
import { IPerson, SectionElement } from '@/types'
import { NavBarCustom } from '../navbar-custom/nav-bar-custom'
import { Footer } from './footer'
import { menuDashboard } from '@/app/(dashboard)/dashboard/const'

export default function AdminPanelLayout({
  children,
  email,
  personData
}: {
  children: React.ReactNode
  menuItems?: SectionElement[]
  email?: string
  personData?: IPerson // Adjust type as needed, e.g., IPerson
}) {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState, settings } = sidebar

  return (
    <>
      <SideBar menuItems={menuDashboard} />

      <main
        className={cn(
          'min-h-screen bg-background dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 relative',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-60')
        )}
      >
        <NavBarCustom
          email={email}
          menuItems={menuDashboard}
          person={personData}
        />
        <main className="w-full container mx-auto py-4 zoom-adjust px-4 md:px-6">
          {children}
        </main>
      </main>
      <Footer />
    </>
  )
}
