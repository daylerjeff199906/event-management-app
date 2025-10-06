import { APP_CONFIG } from '@/data/config.app'
import { configImages } from '@/data/config.images'
import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  subTitle?: string
  backgroundImage?: string
  gradientOpacity?: number // Valor entre 0 y 1
  logoUrl?: string
  logoAlt?: string
  logoSize?: number
  homeUrl?: string
  systemName?: string
  hiddenName?: boolean
  hiddenApp?: boolean
  title?: string
}

const TITLE = '¡Bienvenido a tu panel de administración!'
const DESCRIPTION =
  'Administra tus solicitudes, consulta convocatorias y realiza seguimiento a tus postulaciones desde este panel.'

export function AuthLayout({
  children,
  subTitle = DESCRIPTION,
  backgroundImage = configImages.BACKGROUND_DEFAULT.src,
  gradientOpacity = 1,
  logoUrl = APP_CONFIG.logos.logoHorizontalDefault,
  logoAlt = 'Eventify',
  logoSize = 35,
  homeUrl = '#',
  systemName = 'Eventify',
  hiddenName,
  hiddenApp,
  title = TITLE
}: AuthLayoutProps) {
  // Validar que la opacidad esté entre 0 y 1
  const safeGradientOpacity = Math.min(1, Math.max(0, gradientOpacity))

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form content */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
      {/* Rigth side - Background with gradient overlay */}
      <div className="hidden lg:flex w-2/3 relative flex-col p-8 justify-between">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          {backgroundImage && (
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              quality={100}
              priority
            />
          )}
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 -z-10 bg-black/65 dark:bg-black/80"
          style={{ opacity: safeGradientOpacity }}
        />

        {/* Background pattern (optional) */}
        <div
          className="absolute inset-0 opacity-20 -z-10 justify-between"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0c50 0 50 100 100 100V0H0z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E\")",
            backgroundSize: 'cover',
            mixBlendMode: 'overlay'
          }}
        />

        {/* Logo and system name */}
        {!hiddenApp && (
          <Link href={homeUrl} className="hover:cursor-pointer z-10">
            <div className="flex items-center gap-2 text-white dark:text-gray-100">
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={logoSize}
                height={logoSize}
                className="object-contain"
                style={{
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                  minWidth: `${logoSize}px`,
                  minHeight: `${logoSize}px`
                }}
              />
              {!hiddenName && (
                <span className="text-xl font-semibold">{systemName}</span>
              )}
            </div>
          </Link>
        )}

        {/* Content */}
        <div className="fixed bottom-8 right-8 text-white max-w-xl z-10">
          <h1 className="text-3xl mb-4 text-white dark:text-gray-100">
            {title}
          </h1>
          {subTitle ? (
            <p className="text-lg text-gray-300">{subTitle}</p>
          ) : (
            <p className="text-lg text-gray-300">{DESCRIPTION}</p>
          )}
        </div>
      </div>
    </div>
  )
}
