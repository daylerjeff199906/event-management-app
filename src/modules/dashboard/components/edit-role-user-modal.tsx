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
import { UserCheck } from 'lucide-react'

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

interface IProps {
  value?: string
}

export const EditRoleUserModal = (props: IProps) => {
  const { value } = props
  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <UserCheck className="h-4 w-4" />
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
              <Select defaultValue={value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}
