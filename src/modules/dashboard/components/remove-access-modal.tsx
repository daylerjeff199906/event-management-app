'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { RefreshCw, Trash } from 'lucide-react'
import { upsertAccessEnabled } from '@/services/user.roles.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { APP_URL } from '@/data/config-app-url'
import { InstitutionRole } from '@/types'

// Esquema de validación con Zod
const accessSchema = z.object({
  confirm: z.literal('true', {
    message: 'Debes confirmar la acción'
  })
})

type AccessFormValues = z.infer<typeof accessSchema>

interface IProps {
  idUserRole?: string
  userId: string
  institutionId: string
  userName: string
  userEmail: string
  role: InstitutionRole
  accessEnabled: boolean // Nuevo prop para saber el estado actual del acceso
}

export const ToggleAccessModal = (props: IProps) => {
  const {
    userId,
    institutionId,
    userName,
    userEmail,
    role,
    idUserRole,
    accessEnabled
  } = props
  const [open, setOpen] = useState(false)

  const form = useForm<AccessFormValues>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      confirm: 'true' as const
    },
    mode: 'onChange'
  })

  const {
    reset,
    formState: { isSubmitting }
  } = form

  // Determinar textos y estilos según el estado del acceso
  const isActive = accessEnabled
  const modalTitle = isActive
    ? `Desactivar acceso de ${userName}`
    : `Restaurar acceso de ${userName}`

  const description = isActive
    ? `Una vez desactivado, ${userName} (${userEmail}) ya no tendrá acceso directo a esta institución. Sin embargo, aún podría tener acceso si es miembro de un equipo que tenga permisos concedidos.`
    : `Al restaurar el acceso, ${userName} (${userEmail}) volverá a tener permisos de ${role} en esta institución.`

  const buttonText = isSubmitting
    ? isActive
      ? 'Desactivando...'
      : 'Restaurando...'
    : isActive
      ? `Desactivar a ${userName}`
      : `Restaurar a ${userName}`

  const buttonVariant = isActive ? 'destructive' : 'outline'
  const icon = isActive ? Trash : RefreshCw

  // Función para manejar el envío del formulario
  const onSubmit = async (data: AccessFormValues) => {
    try {
      // Invertir el estado del acceso: si está activo lo desactivamos, si está inactivo lo activamos
      const newAccessState = !isActive

      // Llamar al servicio para cambiar el estado del acceso
      const { error } = await upsertAccessEnabled({
        userRoleId: idUserRole,
        userId,
        institutionId,
        role,
        access_enabled: data.confirm === 'true' ? newAccessState : isActive,
        urlRevalidate: APP_URL.ORGANIZATION.USERS.USER_INSTITUTION(
          institutionId.toString()
        )
      })

      // Mostrar mensaje de error si existe
      if (error) {
        toast.error(<ToastCustom title="Error" description={error.message} />)
        return
      }

      toast.success(
        <ToastCustom
          title="Éxito"
          description={`El acceso de ${userName} ha sido ${newAccessState ? 'restaurado' : 'desactivado'
            } correctamente`}
        />
      )

      setOpen(false)
      reset()
    } catch (error) {
      console.error('Error al cambiar el estado del acceso:', error)
      toast.error(
        <ToastCustom
          title="Error"
          description={`Ocurrió un error al ${isActive ? 'desactivar' : 'restaurar'
            } el acceso`}
        />
      )
    }
  }

  const IconComponent = icon

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          reset() // Resetear el formulario al cerrar el modal
        }
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={
                isActive
                  ? 'text-destructive hover:text-destructive'
                  : 'text-green-600 hover:text-green-700'
              }
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>

            <div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="confirm-action"
                          checked={field.value === 'true'}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? 'true' : '')
                          }
                          className={`h-4 w-4 rounded border-gray-300 ${isActive
                            ? 'text-destructive focus:ring-destructive'
                            : 'text-green-600 focus:ring-green-600'
                            }`}
                        />
                        <label
                          htmlFor="confirm-action"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {isActive
                            ? 'Entiendo que esta acción limitará el acceso del usuario'
                            : 'Confirmo que deseo restaurar el acceso del usuario'}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col">
              <div className="flex gap-2 flex-col w-full">
                <Button
                  type="submit"
                  variant={buttonVariant}
                  disabled={isSubmitting || !form.watch('confirm')}
                  className="w-full"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {buttonText}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
