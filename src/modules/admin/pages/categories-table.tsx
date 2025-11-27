'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { APP_URL } from '@/data/config-app-url'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { Category } from '@/types'
import { toast } from 'react-toastify'
import { deleteCategory } from '@/services/categories.services'
import { Edit, Trash2, Loader2 } from 'lucide-react'

type CategoriesTableProps = {
  categories: Category[]
}

const formatDate = (value?: string | null) => {
  if (!value) return 'N/D'
  const parsedDate = new Date(value)
  return Number.isNaN(parsedDate.getTime())
    ? 'N/D'
    : parsedDate.toLocaleDateString('es-ES')
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [items, setItems] = useState<Category[]>(categories)
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      const { success, error } = await deleteCategory(pendingDelete.id)
      if (!success || error) {
        toast.error(
          <ToastCustom
            title="Error"
            description={
              error || 'No se pudo eliminar la categoria seleccionada'
            }
          />
        )
        return
      }

      setItems((prev) =>
        prev.filter((category) => category.id !== pendingDelete.id)
      )
      toast.success(
        <ToastCustom
          title="Listo"
          description="Categoria eliminada correctamente"
        />
      )
      setPendingDelete(null)
    } catch (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description={
            error instanceof Error
              ? error.message
              : 'Ocurrio un error al eliminar la categoria'
          }
        />
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Nombre</TableHead>
              <TableHead className="font-medium hidden sm:table-cell">
                Descripcion
              </TableHead>
              <TableHead className="font-medium hidden md:table-cell">
                Icono
              </TableHead>
              <TableHead className="font-medium hidden lg:table-cell">
                Creada
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay categorias registradas
                </TableCell>
              </TableRow>
            ) : (
              items.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description || 'Sin descripcion'}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {category.icon || 'Sin icono'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(category.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Editar"
                        asChild
                      >
                        <Link
                          href={APP_URL.ADMIN.CATEGORIES.EDIT(category.id)}
                          className="no-underline"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        onClick={() => setPendingDelete(category)}
                        disabled={isDeleting}
                      >
                        {isDeleting && pendingDelete?.id === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setPendingDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              {`Se eliminara "${pendingDelete?.name || 'esta categoria'}". Esta accion no se puede deshacer.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
