'use client'
import Link from 'next/link'
import React from 'react'
import { LogoRender } from '../miscellaneous/logo-render'
import { APP_URL } from '@/data/config-app-url'

export const FooterPortal = () => {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <LogoRender isOpened href={APP_URL.PORTAL.BASE} />
            <p className="text-muted-foreground mb-4 max-w-md text-sm sm:text-base">
              La plataforma líder para descubrir y crear eventos locales en
              Iquitos. Conectamos comunidades a través de experiencias únicas.
            </p>
            <p className="text-sm text-muted-foreground">
              En beta - Seguimos mejorando para ti
            </p>
          </div>

          {/* Plataforma */}
          <div className="mt-6 sm:mt-0">
            <h4 className="font-semibold mb-4 text-base sm:text-lg">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Explorar eventos
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Ciudades
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Crear evento
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="mt-6 sm:mt-0">
            <h4 className="font-semibold mb-4 text-base sm:text-lg">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors block py-1"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
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
