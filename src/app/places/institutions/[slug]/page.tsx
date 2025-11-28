import { Params } from '@/types'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/siteConfig'
import { EmptyState } from '@/components/app/miscellaneous/empty-state'
import { getInstitutionBySlug } from '@/services/institution.services'
import { InstitutionLandingPage } from '@/modules/places'

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
    const slug = resolvedParams.slug

    if (!slug) {
      return staticMetadata
    }

    const response = await getInstitutionBySlug(slug.toString())

    if (response.error || !response.data) {
      return staticMetadata
    }

    const institution = response.data
    const institutionUrl = `${siteConfig.url}/institutions/${slug}`

    // Metadata dinámica basada en la institución
    const dynamicMetadata: Metadata = {
      title: institution.institution_name || 'Institución',
      description:
        institution.description ||
        `Descubre más sobre ${institution.institution_name}`,
      openGraph: {
        type: 'website',
        locale: 'es_ES', // Cambié a español
        url: institutionUrl,
        title: institution.institution_name || 'Institución',
        description:
          institution.description ||
          `Descubre más sobre ${institution.institution_name}`,
        siteName: siteConfig.name,
        images: institution.logo_url
          ? [
              {
                url: institution.logo_url,
                width: 1200,
                height: 630,
                alt: institution.institution_name || 'Imagen de la institución'
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
        title: institution.institution_name || 'Institución',
        description:
          institution.description ||
          `Descubre más sobre ${institution.institution_name}`,
        images: institution.cover_image_url
          ? [institution.cover_image_url]
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
  const slug = params.slug

  const response = await getInstitutionBySlug(slug?.toString() || '')

  if (response.error) {
    return <EmptyState title="Error" description={response.error} />
  }

  if (!response.data) {
    return (
      <EmptyState
        title="Institución no encontrada"
        description="Lo sentimos, no pudimos encontrar la institución que estás buscando."
      />
    )
  }

  const institution = response.data

  return <InstitutionLandingPage data={institution} />
}
