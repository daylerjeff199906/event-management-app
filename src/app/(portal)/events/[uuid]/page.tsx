import { Params } from '@/types'
import { fetchEventFullDetails } from '@/services/events.services'
import { EventDetailsPage } from '@/modules/events/page'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/siteConfig'
import { EmptyState } from '@/components/app/miscellaneous/empty-state'

interface PageProps {
  params: Params
}

export const metadata: Metadata = {
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
    // creator: '@shadcn'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
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
    <>
      <EventDetailsPage event={response.data} />
    </>
  )
}
