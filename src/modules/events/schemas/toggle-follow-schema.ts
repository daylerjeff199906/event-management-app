import { z } from 'zod'

// Schema para validar el input de seguir/dejar de seguir
export const ToggleFollowSchema = z.object({
  institutionId: z.string().uuid({ message: 'ID de institución inválido' }),
  path: z.string().optional() // Para revalidar la ruta correcta después
})

export type ToggleFollowInput = z.infer<typeof ToggleFollowSchema>
