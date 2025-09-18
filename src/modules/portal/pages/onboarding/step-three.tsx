'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Settings,
  Bell,
  Shield,
  Eye,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
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
  disableNext: boolean
}

export function StepThree({
  data,
  onNext,
  onBack,
  onSkip,
  disableNext
}: StepThreeProps) {
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
                      checked={form.watch('email_notifications')}
                      onCheckedChange={(checked) =>
                        form.setValue('email_notifications', checked)
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
                      checked={form.watch('push_notifications')}
                      onCheckedChange={(checked) =>
                        form.setValue('push_notifications', checked)
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
                      checked={form.watch('event_reminders')}
                      onCheckedChange={(checked) =>
                        form.setValue('event_reminders', checked)
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
                      value={form.watch('profile_visibility')}
                      onValueChange={(value) =>
                        form.setValue(
                          'profile_visibility',
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
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 bg-transparent h-12 rounded-full"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Anterior
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-full font-bold"
                  disabled={disableNext}
                >
                  ¡Comenzar a usar!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <Button
                type="button"
                onClick={onSkip}
                variant="ghost"
                className="flex-1 bg-transparent"
              >
                Omitir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
