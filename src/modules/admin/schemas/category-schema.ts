import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre debe tener menos de 80 caracteres'),
  description: z
    .string()
    .trim()
    .max(200, 'La descripcion debe tener menos de 200 caracteres')
    .optional()
    .nullable(),
  icon: z
    .string()
    .trim()
    .max(60, 'El identificador del icono debe tener menos de 60 caracteres')
    .optional()
    .nullable()
})

export type CategoryFormValues = z.infer<typeof categorySchema>
