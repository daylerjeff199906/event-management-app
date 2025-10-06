'use client'

import { Button } from '@/components/ui/button'
import { APP_URL } from '@/data/config-app-url'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

const TEXTS = {
  title: 'Bienvenido',
  subtitle: 'La forma más fácil de gestionar y descubrir eventos',
  heading1: '¡Impulsa tus ',
  heading2: 'eventos',
  heading3: ' y conecta con ',
  heading4: 'personas increíbles',
  heading5: ' hoy mismo!',
  buttonUser: 'REGÍSTRATE GRATIS',
  buttonInstitution: 'SOLICITAR COMO ORGANIZADOR',
  description:
    'Organiza, promociona y encuentra eventos de manera sencilla en la plataforma preferida por miles de usuarios.',
  descriptionHighlight: ' ¡Únete y haz que tu evento sea un éxito!'
}

const BUTTONS = [
  {
    key: 'user',
    show: (isAuthenticated: boolean) => !isAuthenticated,
    href: (userRegisterUrl: string) => userRegisterUrl,
    icon: null,
    text: TEXTS.buttonUser,
    className:
      'bg-primary text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto hover:cursor-pointer py-6',
    variant: undefined
  },
  {
    key: 'institution',
    show: () => true,
    href: (institutionRequestUrl: string) => institutionRequestUrl,
    icon: <Building2 className="h-5 w-5 mr-2" />,
    text: TEXTS.buttonInstitution,
    className:
      'border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 w-full sm:w-auto bg-transparent hover:cursor-pointer py-6 bg-gray-50',
    variant: 'outline'
  }
]

interface EventsCTAProps {
  isAuthenticated?: boolean
  onInstitutionRequest?: () => void
  userRegisterUrl?: string
  institutionRequestUrl?: string
  urlImageBackground?: string
}

export default function EventsCTA({
  isAuthenticated,
  userRegisterUrl = APP_URL.AUTH.REGISTER,
  institutionRequestUrl = APP_URL.PORTAL.INSTITUTION_REQUEST,
  urlImageBackground
}: EventsCTAProps) {
  return (
    <div className="relative bg-gray-50 py-20 px-6 lg:px-12 dark:bg-zinc-900 overflow-hidden">
      {urlImageBackground && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('${urlImageBackground}')`
          }}
        />
      )}

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 dark:text-white">
            {TEXTS.title}
          </h3>
          <p
            className="text-gray-600 dark:text-gray-300 text-lg
          "
          >
            {TEXTS.subtitle}
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 dark:text-white">
            {TEXTS.heading1}
            <span className="font-black">{TEXTS.heading2}</span>,
            <br />
            {TEXTS.heading3}
            <span className="font-black">{TEXTS.heading4}</span>
            <br />
            <span className="font-black">{TEXTS.heading5}</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          {BUTTONS.map(
            (btn) =>
              btn.show(isAuthenticated ?? false) && (
                <Link
                  key={btn.key}
                  href={
                    btn.key === 'user'
                      ? btn.href(userRegisterUrl)
                      : btn.href(institutionRequestUrl)
                  }
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className={btn.className}>
                    {btn.icon}
                    {btn.text}
                  </Button>
                </Link>
              )
          )}
        </div>

        <p className="text-gray-600 mt-8 text-lg max-w-2xl mx-auto dark:text-gray-300">
          {TEXTS.description}
          <span className="font-semibold">{TEXTS.descriptionHighlight}</span>
        </p>
      </div>
    </div>
  )
}
