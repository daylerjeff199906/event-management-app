'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { APP_URL } from '@/data/config-app-url'
import {
  CategoryFormValues,
  categorySchema
} from '@/modules/admin/schemas/category-schema'
import { createCategory, updateCategory } from '@/services/categories.services'
import { Category } from '@/types'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

type CategoryFormProps = {
  category?: Category
  mode?: 'create' | 'edit'
}

const sanitizeOptionalField = (value?: string | null) =>
  value && value.trim().length > 0 ? value.trim() : null

export function CategoryForm({ category, mode = 'create' }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || ''
    }
  })

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name,
        description: sanitizeOptionalField(values.description),
        icon: sanitizeOptionalField(values.icon)
      }

      const response =
        mode === 'edit' && category?.id
          ? await updateCategory(category.id, payload)
          : await createCategory(payload)

      if (response.error) {
        toast.error(
          <ToastCustom
            title="Error"
            description={response.error || 'No se pudo guardar la categoria'}
          />
        )
        return
      }

      toast.success(
        <ToastCustom
          title="Listo"
          description={
            mode === 'edit'
              ? 'Categoria actualizada correctamente'
              : 'Categoria creada correctamente'
          }
        />
      )
      router.push(APP_URL.ADMIN.CATEGORIES.BASE)
    } catch (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description={
            error instanceof Error
              ? error.message
              : 'Ocurrio un error al guardar la categoria'
          }
        />
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nombre de la categoria"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Texto breve sobre la categoria"
                    className="min-h-[120px]"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icono (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Music, Calendar, Star"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_URL.ADMIN.CATEGORIES.BASE)}
            className="bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || (mode === 'edit' && !form.formState.isDirty)
            }
          >
            {isSubmitting
              ? 'Guardando...'
              : mode === 'edit'
              ? 'Guardar cambios'
              : 'Crear categoria'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
