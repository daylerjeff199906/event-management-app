'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { UserCog } from 'lucide-react'
import { upsertUserRole } from '@/services/user.roles.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const roles = [
  {
    key: 'institution_owner',
    label: 'Propietario de la institución',
    description: 'Acceso total a todas las configuraciones y datos.'
  },
  {
    key: 'editor',
    label: 'Editor',
    description: 'Puede editar contenido pero no cambiar configuraciones.'
  }
]

// Esquema de validación con Zod
const roleSchema = z.object({
  role: z.enum(['institution_owner', 'editor'], {
    error: 'Por favor selecciona un rol'
  })
})

type RoleFormValues = z.infer<typeof roleSchema>

interface IProps {
  idRole: string
  value?: string
  userId: string
  institutionId: string
}

export const EditRoleUserModal = (props: IProps) => {
  const { value, userId, institutionId, idRole } = props
  const [open, setOpen] = useState(false)

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: value as 'institution_owner' | 'editor' | undefined
    },
    mode: 'onChange'
  })

  const {
    reset,
    formState: { isSubmitting, isDirty, isValid }
  } = form

  // Función para manejar el envío del formulario
  const onSubmit = async (data: RoleFormValues) => {
    if (!isDirty) {
      toast.info(
        <ToastCustom title="Info" description="No hay cambios para guardar" />
      )
      return
    }

    try {
      // Llamar al servicio para actualizar el rol
      const { error } = await upsertUserRole({
        idRole,
        institutionId,
        userId,
        role: data.role,
        urlRevalidate: '/portal/institution/users'
      })

      // Mostrar mensaje de éxito
      if (error) {
        toast.error(<ToastCustom title="Error" description={error.message} />)
        return
      }

      toast.success(
        <ToastCustom
          title="Éxito"
          description={`Rol actualizado a ${
            roles.find((r) => r.key === data.role)?.label || data.role
          }`}
        />
      )
      setOpen(false)
      // Resetear el estado "dirty" después de guardar exitosamente
      reset({ role: data.role })
    } catch (error) {
      console.error('Error al actualizar el rol:', error)
      toast.error(
        <ToastCustom
          title="Error"
          description="Ocurrió un error al actualizar el rol"
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
            <Button variant="outline" size="icon">
              <UserCog className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Rol</DialogTitle>
              <DialogDescription>
                Modifica el rol y los permisos del usuario aquí. Haz clic en
                guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full text-left">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.key} value={role.key}>
                            <div className="">
                              <div>{role.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isDirty && (
                <span className="text-amber-500">Hay cambios sin guardar</span>
              )}
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
              <div className="text-sm text-muted-foreground"></div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty || !isValid}
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
