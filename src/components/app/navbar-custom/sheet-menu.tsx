import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet'
import { SectionElement } from '@/types'
import { Building2, Columns3Cog, MenuIcon, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from './menu'
import { APP_CONFIG } from '@/data/config.app'
import { TeamSwitcher } from './team-switcher'
import { APP_URL } from '@/data/config-app-url'

interface SheetMenuProps {
  title?: string
  menuItems?: SectionElement[]
}

export function SheetMenu(props: SheetMenuProps) {
  const { menuItems } = props
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
        <Menu isOpen menuItems={menuItems} />
      </SheetContent>
    </Sheet>
  )
}
