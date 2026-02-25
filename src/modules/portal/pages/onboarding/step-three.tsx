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
  disableNext: boolean
}

export function StepThree({
  data,
  onNext,
  onBack,
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          ¡Casi terminamos!
        </h1>
        <p className="text-slate-500 font-medium tracking-tight">
          Personaliza tus notificaciones y privacidad para empezar.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-8">
          {/* Notificaciones Group */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Notificaciones</h3>
            </div>

            <div className="grid gap-4">
              {[
                { id: 'email_notifications', title: 'Emails importantes', desc: 'Alertas y actualizaciones directas a tu bandeja.' },
                { id: 'push_notifications', title: 'Notificaciones Push', desc: 'Avisos instantáneos en tu navegador o móvil.' },
                { id: 'event_reminders', title: 'Recordatorios', desc: 'Te avisamos antes de que tus eventos comiencen.' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="space-y-1">
                    <Label htmlFor={item.id} className="text-sm font-bold text-slate-700 cursor-pointer">
                      {item.title}
                    </Label>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">
                      {item.desc}
                    </p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={form.watch(item.id as any)}
                    onCheckedChange={(checked) =>
                      form.setValue(item.id as any, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacidad Group */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Privacidad y Visibilidad</h3>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
              <RadioGroup
                value={form.watch('profile_visibility')}
                onValueChange={(value) =>
                  form.setValue(
                    'profile_visibility',
                    value as 'public' | 'friends' | 'private'
                  )
                }
                className="grid gap-4"
              >
                {[
                  { id: 'public', title: 'Público', desc: 'Cualquiera puede encontrar tu perfil.' },
                  { id: 'friends', title: 'Solo Seguidores', desc: 'Solo personas que te siguen pueden verte.' },
                  { id: 'private', title: 'Privado', desc: 'Tu perfil es totalmente invisible.' }
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-colors">
                    <RadioGroupItem value={opt.id} id={opt.id} className="w-5 h-5" />
                    <Label htmlFor={opt.id} className="flex flex-col cursor-pointer">
                      <span className="text-sm font-bold text-slate-700">{opt.title}</span>
                      <span className="text-xs text-slate-500 font-medium tracking-tight">{opt.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Regresar
          </Button>

          <Button
            type="submit"
            className="flex-[2] h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            disabled={disableNext}
          >
            ¡Empezar ahora!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
