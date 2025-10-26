/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ChevronsUpDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function TeamSwitcher({
  teams
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
    href?: string
  }[]
}) {
  //   const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = useState(teams[0])
  const pathname = usePathname()

  useEffect(() => {
    const currentTeam = teams.find((team) => isActive(team))
    if (currentTeam) {
      setActiveTeam(currentTeam)
    }
  }, [pathname, teams])

  if (!activeTeam) {
    return null
  }

  const isActive = (team: (typeof teams)[number]) => {
    return pathname.startsWith(team.href || '')
  }

  const getTeamHref = (team: (typeof teams)[number]) => {
    if (team.href) {
      return team.href
    }
    return '#'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer w-full lg:w-auto"
        >
          <div className="bg-sidebar-border text-shadow-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <activeTeam.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Teams
        </DropdownMenuLabel>
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.name}
            onClick={() => setActiveTeam(team)}
            className="gap-2 p-2 cursor-pointer"
            asChild
          >
            <Link
              className={
                isActive(team)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground rounded-md w-full flex items-center gap-2 p-2'
                  : 'rounded-md w-full flex items-center gap-2 p-2'
              }
              href={getTeamHref(team)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <team.logo className="size-3.5 shrink-0" />
              </div>
              {team.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
