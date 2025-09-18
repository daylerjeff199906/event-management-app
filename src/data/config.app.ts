import LOGO_BETA from '@/assets/brands/logo-beta.svg'
import LOGO_BETA_DARK from '@/assets/brands/logo-beta-dark.svg'
export const APP_CONFIG = {
  // Nombre de la aplicación
  appName: 'VamoYa',
  description:
    'VamoYa es la plataforma líder para crear, gestionar y potenciar eventos exitosos. Impulsa tu marca, conecta con tu audiencia y lleva tus experiencias al siguiente nivel.',
  logos: {
    small: '/assets/logo-small.png', // Ruta del logo pequeño
    large: '/assets/logo-large.png', // Ruta del logo grande
    logoHorizontalDefault: LOGO_BETA,
    logoHorizontalDark: LOGO_BETA_DARK
  },
  icons: {
    favicon: '/assets/favicon.ico', // Ruta del favicon
    appleTouchIcon: '/assets/apple-touch-icon.png' // Ruta para iOS
  }
}
