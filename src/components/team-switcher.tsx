"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: string
    plan: string
    url: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  const handleTeamChange = (team: typeof activeTeam) => {
    setActiveTeam(team)
    router.push(team.url)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {activeTeam.logo && activeTeam.logo.startsWith('http') ? (
                  <img src={activeTeam.logo} alt={activeTeam.name} className="size-6 object-contain rounded" />
                ) : (
                  <span className="text-xs font-bold">{activeTeam.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              {
                teams.length > 1 && <ChevronsUpDown className="ml-auto" />
              }
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs px-2 py-1.5">
              Organizaciones
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2 text-xs uppercase cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background w-[32px] h-[32px]">
                  {team.logo && team.logo.startsWith('http') ? (
                    <img src={team.logo} alt={team.name} className="object-contain min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]" />
                  ) : (
                    <span className="text-[10px] font-bold">{team.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="line-clamp-2">
                  {team.name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
