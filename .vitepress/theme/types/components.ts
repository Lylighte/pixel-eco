export interface Author {
  name: string
  avatar: string
  tags?: AuthorTag[]
}

export interface AuthorTag {
  text: string
  color: string
  bg: string
}

export interface NavItem {
  name: string
  url: string
}

export interface SocialLink {
  link: string
  icon?: string
  text?: string
}

export interface NewsCardData {
  title: string
  brief: string
  image: string
  link: string
  date: string
  category: string
}

export interface SidebarItem {
  text: string
  link: string
  order: number
}

export interface SidebarGroup {
  title: string
  items: SidebarItem[]
  groupOrder: number
}

export interface DocCard {
  name: string
  url: string
  image: string
  description: string
}
