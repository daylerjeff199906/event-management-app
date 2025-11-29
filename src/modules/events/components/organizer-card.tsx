'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import {
  followInstitution,
  unfollowInstitution
} from '@/services/institution.follow.service'
import { usePathname } from 'next/navigation'
import { Loader2, UserPlus, Check } from 'lucide-react'
import { AuthModal } from '@/modules/core/components/auth-modal'
import { EventItemDetails } from '@/types'
import { APP_URL } from '@/data/config-app-url'

interface OrganizerCardProps {
  event: EventItemDetails // Deberías usar tu tipo Event real aquí
  isAuthenticated: boolean
  initialIsFollowing: boolean
}

export function OrganizerCard({
  event,
  isAuthenticated,
  initialIsFollowing
}: OrganizerCardProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()

  // Determinar si mostramos datos de institución o de autor
  const entityName =
    event.institution?.institution_name ||
    `${event.author?.first_name} ${event.author?.last_name}`
  const entityImage =
    event.institution?.logo_url || event.author?.profile_image || ''
  const entitySlug = event.institution?.slug
  const institutionId = event.institution?.id

  const handleFollowClick = () => {
    // 1. Si no está logueado, abrir modal
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    // 2. Si es un autor individual y no una institución, quizás no quieras permitir seguir (ajustar lógica)
    if (!institutionId) {
      toast.info('Solo se pueden seguir instituciones por el momento.')
      return
    }

    // 3. Lógica de Seguir/Dejar de seguir (Optimistic UI)
    const newState = !isFollowing
    setIsFollowing(newState)

    startTransition(async () => {
      try {
        const payload = { institutionId, path: pathname }
        const response = newState
          ? await followInstitution(payload)
          : await unfollowInstitution(payload)

        if (response.error) {
          setIsFollowing(!newState) // Revertir
          toast.error(response.error)
        } else {
          toast.success(
            newState
              ? `Siguiendo a ${entityName}`
              : `Dejaste de seguir a ${entityName}`
          )
        }
      } catch {
        setIsFollowing(!newState) // Revertir
        toast.error('Ocurrió un error inesperado')
      }
    })
  }

  return (
    <>
      <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">
          Presentado por
        </h3>
        <div className="flex items-center gap-6 bg-zinc-50 p-6 rounded-lg border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
          <Avatar className="w-20 h-20 border-2 border-zinc-200 dark:border-zinc-700">
            <AvatarImage src={entityImage} />
            <AvatarFallback className="bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-xl font-bold">
              {entityName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Link
              href={
                entitySlug
                  ? APP_URL.PORTAL.PLACES.INSTITUTIONS.DETAIL(entitySlug)
                  : '#'
              }
              target="_blank"
              className="hover:underline"
            >
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                {entityName}
              </h4>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
              Organizador oficial del evento
            </p>

            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Contactar
              </Button>

              {/* Botón de Seguir Inteligente */}
              {institutionId && (
                <Button
                  size="sm"
                  onClick={handleFollowClick}
                  disabled={isPending}
                  className={`
                    border-none transition-all duration-200 min-w-[100px]
                    ${
                      isFollowing
                        ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }
                  `}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" /> Siguiendo
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1.5" /> Seguir
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        institutionName={entityName}
      />
    </>
  )
}
