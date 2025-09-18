import { icons } from 'lucide-react'
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
  icon?: null | (typeof icons)[keyof typeof icons]
  url: null | string
  isDisabled?: boolean
  isExternal?: boolean
}

export interface SectionSection {
  id: number
  name: string
}
