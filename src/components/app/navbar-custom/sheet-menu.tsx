import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet'
import { SectionElement } from '@/types'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from './menu'
import { APP_CONFIG } from '@/data/config.app'
import { TeamSwitcher } from './team-switcher'
import { teamOptions } from '../panel-admin/roles-menu'

interface SheetMenuProps {
  title?: string
  menuItems?: SectionElement[]
  isAdmin?: boolean
  isInstitutional?: boolean
}

export function SheetMenu(props: SheetMenuProps) {
  const { menuItems, isAdmin, isInstitutional } = props

  const userRoles = [
    'user',
    ...(isInstitutional ? ['institutional'] : []),
    ...(isAdmin ? ['admin'] : [])
  ]

  const teamsForSwitcher = teamOptions.filter((t) =>
    t.roles.some((r) => userRoles.includes(r))
  )

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8 " variant="link" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-72 px-3 h-full flex flex-col max-w-[280px]"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={APP_CONFIG.logos.logoHorizontalDark}
                alt="Logo"
                width={128}
                height={16}
              />
            </Link>
          </Button>
        </SheetHeader>
        <div className="flex lg:hidden justify-start gap-4 flex-1 px-3 w-full">
          <TeamSwitcher teams={teamsForSwitcher} />
        </div>
        <Menu isOpen menuItems={menuItems} />
      </SheetContent>
    </Sheet>
  )
}
