import { Params } from '@/types'
import { fetchEventFullDetails } from '@/services/events.services'
import { EventDetailsPage } from '@/modules/events/page'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/siteConfig'
import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { MoreEventsSection } from '@/modules/portal/pages/events/more-events'

interface PageProps {
  params: Params
}

// Metadata estática para casos de fallback
const staticMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI'
  ],
  authors: [
    {
      name: 'shadcn',
      url: 'https://shadcn.com'
    }
  ],
  creator: 'shadcn',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

// Función para generar metadata dinámica
export async function generateMetadata({
  params
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const uuid = resolvedParams.uuid

    if (!uuid) {
      return staticMetadata
    }

    const response = await fetchEventFullDetails(uuid.toString())

    if (response.error || !response.data) {
      return staticMetadata
    }

    const event = response.data
    const eventUrl = `${siteConfig.url}/events/${uuid}`

    // Metadata dinámica basada en el evento
    const dynamicMetadata: Metadata = {
      title: event.event_name || 'Evento',
      description:
        event.description || `Descubre más sobre ${event.event_name}`,
      openGraph: {
        type: 'website',
        locale: 'es_ES', // Cambié a español
        url: eventUrl,
        title: event.event_name || 'Evento',
        description:
          event.description || `Descubre más sobre ${event.event_name}`,
        siteName: siteConfig.name,
        images: event.cover_image_url
          ? [
              {
                url: event.cover_image_url,
                width: 1200,
                height: 630,
                alt: event.event_name || 'Imagen del evento'
              }
            ]
          : [
              {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.ogImage
              }
            ]
      },
      twitter: {
        card: 'summary_large_image',
        title: event.event_name || 'Evento',
        description:
          event.description || `Descubre más sobre ${event.event_name}`,
        images: event.cover_image_url
          ? [event.cover_image_url]
          : [siteConfig.ogImage]
      }
    }

    return dynamicMetadata
  } catch (error) {
    console.error('Error generating metadata:', error)
    return staticMetadata
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const uuid = params.uuid

  const response = await fetchEventFullDetails(uuid?.toString() || '')

  if (response.error) {
    return <EmptyState title="Error" description={response.error.message} />
  }

  if (!response.data) {
    return (
      <EmptyState
        title="Evento no encontrado"
        description="Lo sentimos, no pudimos encontrar el evento que estás buscando."
      />
    )
  }

  return (
    <div className="min-h-screen">
      <EventDetailsPage event={response.data} isPortal />
      <MoreEventsSection uuid_event={response.data.id} />
    </div>
  )
}
