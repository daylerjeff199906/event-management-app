'use server'
import { getSupabase } from './core.supabase'
import { Address } from '@/types'
import { addressSchemaForm } from '@/modules/events/schemas'

export async function createAddress(
  address: Address
): Promise<{ data: Address | null; error: Error | null }> {
  try {
    const supabase = await getSupabase()
    const validated = addressSchemaForm.safeParse(address)
    if (!validated.success) {
      throw new Error('Invalid address data')
    }
    const { data, error } = await supabase
      .from('addresses')
      .insert([validated.data])
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function updateAddress(
  id: number,
  address: Partial<Address>
): Promise<{ data: Address | null; error: Error | null }> {
  try {
    const supabase = await getSupabase()
    const validated = addressSchemaForm.partial().safeParse(address)
    if (!validated.success) {
      throw new Error('Invalid address data')
    }
    const { data, error } = await supabase
      .from('addresses')
      .update(validated.data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getAddressById(
  id: number
): Promise<{ data: Address | null; error: Error | null }> {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function upsertAddress(
  id: number,
  address: Address
): Promise<{ data: Address | null; error: Error | null }> {
  try {
    const existing = await getAddressById(id)
    if (existing.data) {
      return await updateAddress(id, address)
    } else {
      return await createAddress(address)
    }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
