import { z } from 'zod'

// Addresses schema updated to match the interface semantically
export const addressSchemaForm = z.object({
  id: z.string().optional(),
  created_at: z.string().optional(),
  street: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  place_name: z.string().nullable().optional(),
  access_code: z.string().nullable().optional()
})

export type Address = z.infer<typeof addressSchemaForm>
