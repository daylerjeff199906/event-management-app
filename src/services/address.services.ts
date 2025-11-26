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
  id: string,
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

export async function getAddressList(
 {
  search,
  limit = 20
 }:{
  search?: string
  limit?: number
 }
): Promise<{ data: Address[] | null; error: Error | null }> { 
  try {
    const supabase = await getSupabase()
    let query = supabase
      .from('addresses')
      .select('*')
      .limit(limit)

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      const orFilter = [
        `address_line1.ilike.${term}`,
        `address_line2.ilike.${term}`,
        `city.ilike.${term}`,
        `state.ilike.${term}`,
        `postal_code.ilike.${term}`,
        `country.ilike.${term}`
      ].join(',')
      query = query.or(orFilter)
    }

    const { data, error } = await query
    if (error) throw error
    return { data, error: null }
  }
  catch (error) {
    return { data: null, error: error as Error }
  }
}


export async function getAddressById(
  id: string
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

export async function upsertAddress({
  id,
  address,
  eventId
}: {
  id: string | null
  address: Address
  eventId?: string // Add eventId as optional parameter
}): Promise<{ data: Address | null; error: Error | null }> {
  try {
    if (id) {
      return await updateAddress(id, address)
    } else {
      const result = await createAddress(address)
      if (result.data && eventId) {
        const supabase = await getSupabase()
        const { error: eventError } = await supabase
          .from('events')
          .update({
            address_uuid: result.data.id,
            location: address.address_line1
          })
          .eq('id', eventId)
        if (eventError) throw eventError
      }
      return result
    }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
