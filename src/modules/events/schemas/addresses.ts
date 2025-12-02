import { z } from 'zod'

// Addresses schema updated to match the interface
export const addressSchemaForm = z.object({
  id: z.string().optional(),
  created_at: z.string().optional(),
  address_line1: z.string().nullable().optional(),
  address_line2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  place_name: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
  access_code: z.string().nullable().optional()
})

export type Address = z.infer<typeof addressSchemaForm>
