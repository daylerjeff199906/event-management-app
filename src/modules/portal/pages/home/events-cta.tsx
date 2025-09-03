'use client'

import { Button } from '@/components/ui/button'
import { APP_URL } from '@/data/config-app-url'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Users, Building2 } from 'lucide-react'
import Link from 'next/link'

interface EventsCTAProps {
  onUserRegister?: () => void
  onInstitutionRequest?: () => void
  userRegisterUrl?: string
  institutionRequestUrl?: string
}

export default function EventsCTA({
  onUserRegister,
  onInstitutionRequest,
  userRegisterUrl = APP_URL.AUTH.REGISTER,
  institutionRequestUrl = APP_URL.PORTAL.INSTITUTION_REQUEST
}: EventsCTAProps) {
  return (
    <div
      className={cn(
        'text-white py-12 px-6 lg:px-12 mb-12 lg:mb-24',
        'bg-gradient-to-r from-amber-700 to-orange-900'
      )}
      //   style={{
      //     background: 'linear-gradient(to right, #6B7280, #111827)'
      //   }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
              Únete a la revolución de eventos
            </h2>
            <p className="text-sm lg:text-base opacity-90 max-w-md">
              Descubre experiencias únicas, conecta con tu comunidad y
              transforma la manera de vivir eventos. Tu próxima aventura te está
              esperando.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {onUserRegister ? (
              <Button
                onClick={onUserRegister}
                className="bg-white text-orange-700 hover:bg-gray-100 flex items-center gap-2 w-full rounded-full"
              >
                <Users className="h-4 w-4" />
                Registrarse como Usuario
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            ) : (
              <Link href={userRegisterUrl}>
                <Button className="bg-white text-orange-700 hover:bg-gray-100 flex items-center gap-2 w-full rounded-full">
                  <Users className="h-4 w-4" />
                  Registrarse como Usuario
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {onInstitutionRequest ? (
              <Button
                onClick={onInstitutionRequest}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-700 flex items-center gap-2 bg-transparent rounded-full w-full"
              >
                <Building2 className="h-4 w-4" />
                Solicitar Cuenta Institucional
              </Button>
            ) : (
              <Link href={institutionRequestUrl}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-700 flex items-center gap-2 w-full bg-transparent rounded-full"
                >
                  <Building2 className="h-4 w-4" />
                  Solicitar Cuenta Institucional
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
