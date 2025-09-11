import { z } from 'zod'

// Addresses schema based on the provided SQL table
export const addressSchemaForm = z.object({
  created_at: z.string(), // ISO timestamp
  address_line1: z.string().nullable(),
  address_line2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable()
})

export type Address = z.infer<typeof addressSchemaForm>
