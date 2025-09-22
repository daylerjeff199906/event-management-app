import { Metadata } from 'next'

export const metadataBase: Metadata = {
  title: 'VamoYa | Eventos cerca de ti',
  description:
    'Descubre qué habrá en tu ciudad y disfruta de los mejores eventos con VamoYa. Encuentra, registra y vive experiencias únicas cerca de ti.',
  openGraph: {
    images: [
      {
        url: 'https://jfarspcvbclqkotzddhc.supabase.co/storage/v1/object/public/events-app/brands/meta_bg.webp',
        width: 1000,
        height: 630,
        alt: 'VamoYa | Eventos cerca de ti'
      }
    ]
  }
}

export const metadataTemplate: Metadata = {
  title: {
    default: 'Eventos | VamoYa',
    template: '%s | Eventos | VamoYa'
  },
  description:
    'Explora y descubre eventos únicos cerca de ti con VamoYa. Encuentra información detallada de cada evento y vive nuevas experiencias.'
}
