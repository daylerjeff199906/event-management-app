import { Metadata } from 'next'

export const metadataBase: Metadata = {
  title: 'VamoYa | Eventos cerca de ti',
  description:
    'Descubre qué habrá en tu ciudad y disfruta de los mejores eventos con VamoYa. Encuentra, registra y vive experiencias únicas cerca de ti.',
  openGraph: {
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/coniap-iiap.appspot.com/o/EPG%2Fsigae-background.webp?alt=media&token=16abc6dc-337b-497f-a605-d92d7e61899f',
        width: 1000,
        height: 630,
        alt: 'Template EPG - UNAP'
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
