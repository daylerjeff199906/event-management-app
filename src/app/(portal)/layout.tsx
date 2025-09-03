import { Footer } from '@/components/app/panel-admin/footer'
import { NavbarCustom } from '@/modules/portal/components'
import { MenuItem } from '@/modules/portal/components/navbar-custom'

interface LayoutProps {
  children: React.ReactNode
}

const menuItems: MenuItem[] = [
  {
    label: 'Inicio',
    href: '/'
  },
  {
    label: 'Productos',
    href: '/productos',
    subItems: [
      { label: 'Categoría 1', href: '/productos/categoria-1' },
      { label: 'Categoría 2', href: '/productos/categoria-2' },
      { label: 'Ofertas', href: '/productos/ofertas' }
    ]
  },
  {
    label: 'Servicios',
    href: '/servicios',
    subItems: [
      { label: 'Consultoría', href: '/servicios/consultoria' },
      { label: 'Soporte', href: '/servicios/soporte' }
    ]
  },
  {
    label: 'Acerca de',
    href: '/acerca'
  },
  {
    label: 'Contacto',
    href: '/contacto'
  }
]

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavbarCustom menuItems={menuItems} />
      {children}
      <Footer />
    </>
  )
}
