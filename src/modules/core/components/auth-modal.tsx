'use client'

import { X, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { APP_URL } from '@/data/config-app-url'
import { usePathname } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  institutionName: string
}

export function AuthModal({
  isOpen,
  onClose,
  institutionName
}: AuthModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Manejo de animación de entrada/salida
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200) // Esperar a que termine la animación
      document.body.style.overflow = 'unset'
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isVisible && !isOpen) return null

  // Construir URLs con redirección
  // Codificamos el pathname para asegurar que caracteres especiales pasen correctamente
  const redirectParam = pathname
    ? `?redirect=${encodeURIComponent(pathname)}`
    : ''
  const loginUrl = `${APP_URL.AUTH.LOGIN}${redirectParam}`
  const registerUrl = `${APP_URL.AUTH.REGISTER}${redirectParam}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop con efecto blur */}
      <div
        className={`
          absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenido del Modal */}
      <div
        className={`
          relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md 
          border border-zinc-200 dark:border-zinc-800 overflow-hidden 
          transform transition-all duration-300 ease-out
          ${
            isOpen
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-4'
          }
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-2">
            Acceso Requerido
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-orange-50 dark:ring-orange-900/10">
              <LockKeyhole className="w-8 h-8 text-orange-600 dark:text-orange-500" />
            </div>

            <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
              ¡Únete a la comunidad!
            </h4>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Para seguir a{' '}
              <span className="font-semibold text-zinc-900 dark:text-white">
                {institutionName}
              </span>{' '}
              y recibir notificaciones de sus próximos eventos, necesitas una
              cuenta.
            </p>
          </div>

          <div className="flex flex-col gap-3 space-y-1">
            <Link href={loginUrl} className="w-full" onClick={onClose}>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold h-12 text-base shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]">
                Iniciar Sesión
              </Button>
            </Link>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">
                  O si eres nuevo
                </span>
              </div>
            </div>

            <Link href={registerUrl} className="w-full" onClick={onClose}>
              <Button
                variant="outline"
                className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-11"
              >
                Crear cuenta gratis
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 text-center border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Al continuar, aceptas nuestros{' '}
            <Link
              href="/terms"
              className="underline hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link
              href="/privacy"
              className="underline hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
