'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Dot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'
import { SubmenuElement } from '@/types'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'

interface CollapseMenuButtonProps {
  icon: string
  label: string
  active: boolean
  submenus: SubmenuElement[]
  isOpen: boolean | undefined
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  submenus,
  isOpen
}: CollapseMenuButtonProps) {
  const pathname = usePathname()
  const isSubmenuActive = submenus.some((submenu) => submenu.url === pathname)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive)

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 
             ${isSubmenuActive ? 'font-bold text-white' : 'text-gray-300'}
             `}
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                {Icon && (
                  <span
                    className={cn(
                      isSubmenuActive ? 'text-white' : 'text-gray-300'
                    )}
                    dangerouslySetInnerHTML={{ __html: Icon }}
                  />
                )}
              </span>
              <p
                className={cn(
                  'max-w-[150px] truncate',
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-96 opacity-0'
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                'whitespace-nowrap',
                isOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-96 opacity-0'
              )}
            >
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ name, url, isExternal }, index) => {
          const isActive = url === pathname
          return (
            <Button
              key={index}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start h-10 mb-1 ${
                isActive ? 'font-bold text-white' : 'text-gray-400'
              }`}
              asChild
            >
              <Link href={url ?? '#'} target={isExternal ? '_blank' : '_self'}>
                <span className="mr-4 ml-2">
                  <Dot size={18} />
                </span>
                <p
                  className={cn(
                    'max-w-[170px] truncate',
                    isOpen
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-96 opacity-0'
                  )}
                >
                  {name}
                </p>
              </Link>
            </Button>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSubmenuActive ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>
                      {Icon && (
                        <span
                          className={cn(
                            isSubmenuActive ? 'text-white' : 'text-gray-300'
                          )}
                          dangerouslySetInnerHTML={{ __html: Icon }}
                        />
                      )}
                    </span>
                    <p
                      className={cn(
                        'max-w-[200px] truncate',
                        isOpen === false ? 'opacity-0' : 'opacity-100'
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ url, name, isExternal }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              // className={`cursor-pointer ${
              //   ((active === undefined && pathname === url) || active) &&
              //   'bg-secondary'
              // }`}
              href={url ?? '#'}
              target={isExternal ? '_blank' : '_self'}
            >
              <p className="max-w-[180px] truncate">{name}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
