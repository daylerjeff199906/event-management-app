'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { APP_URL } from '@/data/config-app-url'
import { AdvancedFilterHorizontal } from '@/components/app/miscellaneous/advanced-filter-horizontal'
interface InstitutionEventsHeaderProps {
  className?: string
  institutionId?: string
}

export const InstitutionEventsHeader = ({
  className,
  institutionId
}: InstitutionEventsHeaderProps) => {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-6 bg-muted/50 rounded-lg border',
        className
      )}
    >
      {/* Título y acciones principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">Eventos de la Institución</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona y visualiza todos los eventos de tu institución
          </p>
        </div>
        <div>
          <Button
            onClick={() =>
              router.push(
                APP_URL.ORGANIZATION.INSTITUTION.CREATE_EVENT(institutionId!)
              )
            }
            className="flex items-center gap-2"
          >
            Agregar Evento
          </Button>
        </div>
      </div>

      <AdvancedFilterHorizontal
        searchFields={[
          {
            key: 'query',
            label: '',
            placeholder: 'Buscar eventos...'
          }
        ]}
        filters={[]}
      />
    </div>
  )
}
