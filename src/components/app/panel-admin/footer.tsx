'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { LogoRender } from '../miscellaneous/logo-render'
import { APP_URL } from '@/data/config-app-url'

interface FooterProps {
  disabledOpen?: boolean
}

export const Footer = ({ disabledOpen }: FooterProps) => {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState } = sidebar
  const isCurrentlyOpen = getOpenState()

  return (
    <footer
      className={cn(
        'py-12',
        disabledOpen && 'mx-auto container',
        isCurrentlyOpen && !disabledOpen && 'max-w-[calc(100vw-16rem)] ml-auto',
        !isCurrentlyOpen &&
          !disabledOpen &&
          'lg:max-w-[calc(100vw-6.3rem)] ml-auto'
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <LogoRender isOpened href={APP_URL.PORTAL.BASE} />
            <p className="text-muted-foreground mb-4 max-w-md">
              La plataforma líder para descubrir y crear eventos locales en
              Iquitos. Conectamos comunidades a través de experiencias únicas.
            </p>
            <p className="text-sm text-muted-foreground">
              En beta - Seguimos mejorando para ti
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Explorar eventos
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Ciudades
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Crear evento
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} VamoYA. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
