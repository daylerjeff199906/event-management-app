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
import { Trash } from 'lucide-react'
import { upsertAccessEnabled } from '@/services/user.roles.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { APP_URL } from '@/data/config-app-url'

// Esquema de validación con Zod
const removeAccessSchema = z.object({
  confirm: z.literal('true', {
    message: 'Debes confirmar la eliminación del acceso'
  })
})

type RemoveAccessFormValues = z.infer<typeof removeAccessSchema>

interface IProps {
  userId: string
  institutionId: string
  userName: string
  userEmail: string
}

export const RemoveAccessModal = (props: IProps) => {
  const { userId, institutionId, userName, userEmail } = props
  const [open, setOpen] = useState(false)

  const form = useForm<RemoveAccessFormValues>({
    resolver: zodResolver(removeAccessSchema),
    defaultValues: {
      confirm: 'true' as const
    },
    mode: 'onChange'
  })

  const {
    reset,
    formState: { isSubmitting }
  } = form

  // Función para manejar el envío del formulario
  const onSubmit = async (data: RemoveAccessFormValues) => {
    try {
      // Llamar al servicio para deshabilitar el acceso
      const { error } = await upsertAccessEnabled({
        userId,
        institutionId,
        access_enabled: data.confirm === 'true' ? false : true,
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
          description={`El acceso de ${userName} ha sido removido correctamente`}
        />
      )

      setOpen(false)
      reset()
    } catch (error) {
      console.error('Error al remover el acceso:', error)
      toast.error(
        <ToastCustom
          title="Error"
          description="Ocurrió un error al remover el acceso"
        />
      )
    }
  }

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
              className="text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="bg-gray-50">
              <DialogTitle>
                Confirmar que deseas eliminar este miembro
              </DialogTitle>
            </DialogHeader>

            <div>
              <p className="text-sm text-muted-foregrounds">
                Una vez eliminado, {userName} ({userEmail}) ya no tendrá acceso
                directo a esta institución. Sin embargo, aún podría tener acceso
                si es miembro de un equipo que tenga permisos concedidos.
              </p>
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
                          id="confirm-remove"
                          checked={field.value === 'true'}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? 'true' : '')
                          }
                          className="h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive"
                        />
                        <label
                          htmlFor="confirm-remove"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Entiendo que esta acción no se puede deshacer
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
                  variant="destructive"
                  disabled={isSubmitting || !form.watch('confirm')}
                  className="w-full"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {isSubmitting ? 'Eliminando...' : `Remover a ${userName}`}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
