import { APP_URL } from '@/data/config-app-url'
import { EventManageLayout } from '@/modules/events'
import { Params } from '@/types'

interface LayoutProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: LayoutProps) {
  const { children } = props
  const params = await props.params
  const institutionId = params?.slug?.toString()
  const eventId = params?.event?.toString()

  return (
    <EventManageLayout
      backLabel="Volver a eventos"
      menuItems={[
        {
          id: APP_URL.ORGANIZATION.INSTITUTION.EDIT_EVENT(
            institutionId || '',
            eventId || ''
          ),
          label: 'Detalles',
          description: 'Información básica del evento',
          href: APP_URL.ORGANIZATION.INSTITUTION.EDIT_EVENT(
            institutionId || '',
            eventId || ''
          )
        },
        {
          id: APP_URL.ORGANIZATION.INSTITUTION.EVENT_INFO(
            institutionId || '',
            eventId || ''
          ),
          label: 'Más información',
          description: 'Información adicional del evento',
          href: APP_URL.ORGANIZATION.INSTITUTION.EVENT_INFO(
            institutionId || '',
            eventId || ''
          )
        },
        {
          id: APP_URL.ORGANIZATION.INSTITUTION.ADD_SCHEDULE(
            institutionId || '',
            eventId || ''
          ),
          label: 'Agregar agenda',
          description: 'Agregar un nuevo horario para el evento',
          href: APP_URL.ORGANIZATION.INSTITUTION.ADD_SCHEDULE(
            institutionId || '',
            eventId || ''
          ),
          disabled: true
        },
        {
          id: APP_URL.ORGANIZATION.INSTITUTION.ADD_TICKET(
            institutionId || '',
            eventId || ''
          ),
          label: 'Agregar entradas',
          description: 'Agregar entradas para el evento',
          href: APP_URL.ORGANIZATION.INSTITUTION.ADD_TICKET(
            institutionId || '',
            eventId || ''
          ),
          disabled: true
        }
      ]}
      urlBack={APP_URL.ORGANIZATION.INSTITUTION.EVENTS(institutionId || '')}
    >
      {children}
    </EventManageLayout>
  )
}
