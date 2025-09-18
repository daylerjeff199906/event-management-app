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

interface SheetMenuProps {
  title?: string
  menuItems?: SectionElement[]
}

export function SheetMenu(props: SheetMenuProps) {
  const { title, menuItems } = props
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
              <div id="logo" className="flex items-center space-x-2">
                <Image
                  src={APP_CONFIG.logos.logoHorizontalDark}
                  alt="Logo"
                  width={18}
                  height={18}
                />
                {title && (
                  <h1 className="font-bold text-xs line-clamp-2">{title}</h1>
                )}
              </div>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen menuItems={menuItems} />
      </SheetContent>
    </Sheet>
  )
}
