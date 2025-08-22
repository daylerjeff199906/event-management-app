'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Settings, Bell, Shield, Eye, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { notificationsSchema, type Notifications } from '../../lib/validations'

interface StepThreeProps {
  data: Notifications
  onNext: (data: Notifications) => void
  onBack: () => void
  onSkip: () => void
}

export function StepThree({ data, onNext, onBack, onSkip }: StepThreeProps) {
  const form = useForm<Notifications>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: data
  })

  const onSubmit = (data: Notifications) => {
    onNext(data)
  }

  return (
    <div className="animate-slide-in-right">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Configuración final
          </CardTitle>
          <CardDescription className="text-lg">
            Personaliza tus notificaciones y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Notificaciones</h3>
                </div>

                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Notificaciones por email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones importantes por correo
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={form.watch('emailNotifications')}
                      onCheckedChange={(checked) =>
                        form.setValue('emailNotifications', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">
                        Notificaciones push
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={form.watch('pushNotifications')}
                      onCheckedChange={(checked) =>
                        form.setValue('pushNotifications', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="event-reminders">
                        Recordatorios de eventos
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Te recordaremos tus eventos próximos
                      </p>
                    </div>
                    <Switch
                      id="event-reminders"
                      checked={form.watch('eventReminders')}
                      onCheckedChange={(checked) =>
                        form.setValue('eventReminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">Resumen semanal</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe un resumen de eventos cada semana
                      </p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={form.watch('weeklyDigest')}
                      onCheckedChange={(checked) =>
                        form.setValue('weeklyDigest', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Privacidad</h3>
                </div>

                <div className="space-y-4 pl-7">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <Label>Visibilidad del perfil</Label>
                    </div>
                    <RadioGroup
                      value={form.watch('profileVisibility')}
                      onValueChange={(value) =>
                        form.setValue(
                          'profileVisibility',
                          value as 'public' | 'friends' | 'private'
                        )
                      }
                      className="pl-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="font-normal">
                          Público - Cualquiera puede ver tu perfil
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friends" id="friends" />
                        <Label htmlFor="friends" className="font-normal">
                          Solo amigos - Solo tus conexiones pueden verte
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="font-normal">
                          Privado - Tu perfil está oculto
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <Label htmlFor="show-location">Mostrar ubicación</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros vean tu ciudad
                      </p>
                    </div>
                    <Switch
                      id="show-location"
                      checked={form.watch('showLocation')}
                      onCheckedChange={(checked) =>
                        form.setValue('showLocation', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-transparent"
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                className="flex-1 bg-transparent"
              >
                Omitir
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                ¡Comenzar a usar Eventify!
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
