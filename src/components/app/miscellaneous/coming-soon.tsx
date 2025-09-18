'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Mail, HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { APP_URL } from '@/data/config-app-url'

interface ComingSoonProps {
  title?: string
  subtitle?: string
  description?: string
  estimatedDate?: string
  showNotifyButton?: boolean
  showBackButton?: boolean
  onNotifyClick?: () => void
}

export default function ComingSoon({
  title = 'Próximamente',
  subtitle = 'Estamos trabajando en algo increíble',
  description = 'Esta sección estará disponible muy pronto. Mientras tanto, explora otras áreas de nuestra plataforma.',
  estimatedDate = 'Q2 2024',
  showNotifyButton = true,
  showBackButton = true,
  onNotifyClick
}: ComingSoonProps) {
  return (
    <div className="min-h-svh bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Badge de estado */}
        <Badge variant="secondary" className="mx-auto">
          <Clock className="w-3 h-3 mr-1" />
          En desarrollo
        </Badge>

        {/* Contenido principal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            {subtitle}
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card con información adicional */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Badge variant="outline">{estimatedDate}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showNotifyButton && (
            <Button onClick={onNotifyClick} className="gap-2">
              <Mail className="w-4 h-4" />
              Notificarme cuando esté listo
            </Button>
          )}

          {showBackButton && (
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href={APP_URL.DASHBOARD.BASE}>
                <HomeIcon className="w-4 h-4" />
                Ir a inicio
              </Link>
            </Button>
          )}
        </div>

        {/* Elemento decorativo sutil */}
        <div className="pt-8">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-border to-transparent mx-auto rounded-full" />
        </div>
      </div>
    </div>
  )
}
