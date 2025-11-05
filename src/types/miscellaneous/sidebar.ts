import * as LucideIcons from 'lucide-react'
export type LucideIconName = keyof typeof LucideIcons
export interface SectionElement {
  section: SectionSection
  menus: MenuElement[]
}

export interface MenuElement {
  menu: SubmenuElement
  submenus: SubmenuElement[]
}

export interface SubmenuElement {
  id: number
  name: string
  description?: string
  icon?: LucideIconName
  url: null | string
  isDisabled?: boolean
  isExternal?: boolean
}

export interface SectionSection {
  id: number
  name: string
}
