'use client'

import { Button } from '@/components/ui/button'
import { APP_URL } from '@/data/config-app-url'
import { ArrowUpRight, Users, Building2 } from 'lucide-react'
import Link from 'next/link'

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
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${urlImageBackground}')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative text-white py-16 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
                  CREA Y PUBLICA
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl text-orange-400">
                  TU EVENTO
                </h2>
              </div>

              <div className="space-y-3 text-lg max-w-2xl">
                <div>
                  <span className="text-3xl font-bold text-orange-300">
                    ¡Impulsa tu evento al éxito!
                  </span>
                </div>
                <div>
                  Publica tu evento en nuestra plataforma líder y conecta con
                  una audiencia masiva lista para participar.{' '}
                  <span className="opacity-90 font-medium">
                    Fácil, rápido y seguro. ¡Comienza hoy!
                  </span>
                </div>
              </div>

              <div className="max-w-md flex flex-col gap-4 lg:flex-row lg:gap-4">
                {!isAuthenticated && (
                  <Link href={userRegisterUrl}>
                    <Button
                      size="lg"
                      className="bg-amber-600 text-black hover:bg-orange-400 flex items-center gap-2 font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <Users className="h-5 w-5" />
                      CREAR CUENTA
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href={institutionRequestUrl}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-black flex items-center gap-2 bg-transparent rounded-full font-bold text-lg px-8 py-5 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                  >
                    <Building2 className="h-5 w-5" />
                    SOLICITAR COMO INSTITUCIÓN
                  </Button>
                </Link>
              </div>
            </div>

            {/* <div className="flex flex-col gap-4 lg:self-end">
              {onUserRegister ? (
                <Button
                  onClick={onUserRegister}
                  size="lg"
                  className="bg-atext-amber-600 text-white hover:bg-orange-400 flex items-center gap-2 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-orange-500 border"
                >
                  <Users className="h-5 w-5" />
                  CREAR CUENTA
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              ) : (
                <Link href={userRegisterUrl}>
                  <Button
                    size="lg"
                    className="bg-atext-amber-600 text-white hover:bg-orange-400 flex items-center gap-2 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full border-orange-500 border"
                  >
                    <Users className="h-5 w-5" />
                    CREAR CUENTA
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {onInstitutionRequest ? (
                <Button
                  onClick={onInstitutionRequest}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-black flex items-center gap-2 bg-transparent rounded-full font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Building2 className="h-5 w-5" />
                  SOLICITAR COMO INSTITUCIÓN
                </Button>
              ) : (
                <Link href={institutionRequestUrl}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-black flex items-center gap-2 bg-transparent rounded-full font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                  >
                    <Building2 className="h-5 w-5" />
                    SOLICITAR COMO INSTITUCIÓN
                  </Button>
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
