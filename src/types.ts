import type { ReactNode } from "react";

export interface BaseMenuItem {
  key: string
  name?: string
  onClick?: () => void
  disabled?: boolean
  icon?: string | ReactNode
  keyboard?: string
}

export interface MenuItemMenu extends BaseMenuItem {
  type?: 'menu'
  show: boolean
  children?: MenuItem[]
}

export interface MenuItemDivider
  extends Omit<BaseMenuItem, 'name' | 'onClick' | 'icon' | 'keyboard' | 'disabled'> {
  type: 'divider'
}

export type MenuItem = MenuItemMenu | MenuItemDivider
