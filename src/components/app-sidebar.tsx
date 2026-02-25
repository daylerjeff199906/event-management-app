"use client"
import * as React from "react"

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: {
    name: string
    email: string
    avatar: string
    globalRole?: string
  }
  menuTeamSwitcher?: {
    name: string
    logo: string
    plan: string
  }[]
  menuNavBar?: {
    navMain: {
      title: string
      url: string
      icon?: string
      isActive?: boolean
      items?: {
        title: string
        url: string
      }[]
    }[]
    projects?: {
      name: string
      url: string
      icon: string
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
