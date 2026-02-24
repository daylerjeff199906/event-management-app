"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: {
    name: string
    email: string
    avatar: string
  }
  menuTeamSwitcher?: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
  menuNavBar?: {
    navMain: {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
      items?: {
        title: string
        url: string
      }[]
    }[]
    projects?: {
      name: string
      url: string
      icon: LucideIcon
    }[]
  }
}

export function AppSidebar({
  userData,
  menuTeamSwitcher = [],
  menuNavBar,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {menuTeamSwitcher.length > 0 && <TeamSwitcher teams={menuTeamSwitcher} />}
      </SidebarHeader>
      <SidebarContent>
        {menuNavBar?.navMain && <NavMain items={menuNavBar.navMain} />}
        {menuNavBar?.projects && <NavProjects projects={menuNavBar.projects} />}
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
