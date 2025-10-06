'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  notificationsSchema,
  Notifications
} from '@/modules/portal/lib/validations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Shield, Eye } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { updateNotifications } from '@/services/user.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

interface SettingsEditorProps {
  userId?: string
  initialData?: Partial<Notifications>
}

export function SettingsEditor({ initialData, userId }: SettingsEditorProps) {
  const form = useForm<Notifications>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      email_notifications: initialData?.email_notifications || false,
      push_notifications: initialData?.push_notifications || false,
      event_reminders: initialData?.event_reminders || false,
      weekly_digest: initialData?.weekly_digest || false,
      profile_visibility: initialData?.profile_visibility || 'public',
      show_location: initialData?.show_location || false
    }
  })

  const isDirty = form.formState.isDirty

  const onSubmit = async (data: Notifications) => {
    try {
      const response = await updateNotifications({
        id: String(userId),
        dataForm: data
      })
      if (response.data) {
        toast.success(
          <ToastCustom
            title="Configuraciones actualizadas"
            description="Tus configuraciones se han actualizado con éxito."
          />
        )
        form.reset(data) // Resetea el estado "sucio" del formulario
      } else {
        toast.error(
          <ToastCustom
            title="Error al actualizar configuraciones"
            description="No se pudieron actualizar las configuraciones."
          />
        )
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Error desconocido'
          : 'Error desconocido'
      toast.error(
        <ToastCustom
          title="Error al actualizar configuraciones"
          description={errorMessage}
        />
      )
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-foreground
        "
        >
          Configuraciones
        </h1>
      </div>

      <Card className="shadow-none bg-white dark:bg-slate-800 border">
        <CardHeader>
          <CardTitle className="text-xl text-slate-700 dark:text-slate-200">
            Preferencias de Notificaciones y Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Notifications Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Notificaciones</h3>
                </div>

                <div className="space-y-4 pl-7">
                  <FormField
                    control={form.control}
                    name="email_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificaciones por email
                          </FormLabel>
                          <FormDescription>
                            Recibe actualizaciones importantes por correo
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificaciones push
                          </FormLabel>
                          <FormDescription>
                            Recibe notificaciones en tiempo real
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event_reminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Recordatorios de eventos
                          </FormLabel>
                          <FormDescription>
                            Te recordaremos tus eventos próximos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weekly_digest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Resumen semanal
                          </FormLabel>
                          <FormDescription>
                            Recibe un resumen de actividad cada semana
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Privacy Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Privacidad</h3>
                </div>

                <div className="space-y-4 pl-7">
                  <FormField
                    control={form.control}
                    name="profile_visibility"
                    render={({ field }) => (
                      <FormItem className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <FormLabel>Visibilidad del perfil</FormLabel>
                        </div>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="pl-6 space-y-2"
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="show_location"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mostrar ubicación
                          </FormLabel>
                          <FormDescription>
                            Permite que otros usuarios vean tu ubicación
                            aproximada
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !isDirty}
                  className="w-full md:w-auto px-8"
                >
                  {form.formState.isSubmitting
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
