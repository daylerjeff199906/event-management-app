'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Eye, Bell } from 'lucide-react'
import type { CompleteOnboarding } from '../../lib/validations'

interface ProfilePreviewProps {
  data: Partial<CompleteOnboarding>
}

const interestLabels: Record<string, string> = {
  music: 'Música',
  photography: 'Fotografía',
  gaming: 'Gaming',
  food: 'Gastronomía',
  travel: 'Viajes',
  books: 'Lectura',
  fitness: 'Fitness',
  art: 'Arte'
}

const eventTypeLabels: Record<string, string> = {
  concerts: 'Conciertos',
  workshops: 'Talleres',
  networking: 'Networking',
  sports: 'Deportes',
  cultural: 'Eventos Culturales',
  tech: 'Tecnología',
  'food-events': 'Eventos Gastronómicos',
  outdoor: 'Actividades al Aire Libre'
}

const visibilityLabels: Record<string, string> = {
  public: 'Público',
  friends: 'Solo amigos',
  private: 'Privado'
}

export function ProfilePreview({ data }: ProfilePreviewProps) {
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
  const initials = `${data.firstName?.[0] || ''}${
    data.lastName?.[0] || ''
  }`.toUpperCase()

  return (
    <Card className="w-full max-w-sm mx-auto animate-fade-in-up">
      <CardHeader className="text-center pb-4">
        <h3 className="text-lg font-semibold mb-4">Vista previa del perfil</h3>
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={data.profileImage || '/placeholder.svg'}
              alt={fullName}
            />
            <AvatarFallback className="text-lg">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.interests && data.interests.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">Intereses</h5>
            <div className="flex flex-wrap gap-1">
              {data.interests.slice(0, 4).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interestLabels[interest] || interest}
                </Badge>
              ))}
              {data.interests.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{data.interests.length - 4} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {data.eventTypes && data.eventTypes.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">Eventos favoritos</h5>
            <div className="flex flex-wrap gap-1">
              {data.eventTypes.slice(0, 3).map((eventType) => (
                <Badge key={eventType} variant="outline" className="text-xs">
                  {eventTypeLabels[eventType] || eventType}
                </Badge>
              ))}
              {data.eventTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{data.eventTypes.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>
              {data.profileVisibility
                ? visibilityLabels[data.profileVisibility]
                : 'Público'}
            </span>
          </div>
          {data.showLocation && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Ubicación visible</span>
            </div>
          )}
          {(data.emailNotifications || data.pushNotifications) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bell className="w-3 h-3" />
              <span>Notificaciones activas</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
