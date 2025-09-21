'use server'
import { getSupabase } from './core.supabase'
import {
  InstitutionForm,
  RegistrationInstitutionForm
} from '@/modules/portal/lib/register.institution'
import { RegistrationRequestForm } from '@/modules/portal/lib/register.institution'
import { revalidatePath } from 'next/cache'

// Función de búsqueda combinada (por nombre o email)
export async function searchInstitutionFunction(query: string) {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .or(`institution_name.ilike.%${query}%,institution_email.eq.${query}`)
    .order('institution_name')
    .select()
    .single()

  if (error) {
    console.error('Error buscando institución:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createInstitution(institutionData: InstitutionForm) {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('institutions')
    .insert([institutionData])
    .select()
    .single()

  if (error) {
    console.error('Error creando institución:', error)
    throw new Error(`Error al crear institución: ${error.message}`)
  }

  return { data, error: null }
}

export async function registrationRequestFunction(
  institutionData: RegistrationRequestForm
) {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('registration_requests')
    .insert([institutionData])
    .select()
    .single()

  if (error) {
    console.error('Error creando solicitud de registro:', error)
    throw new Error(`Error al crear solicitud de registro: ${error.message}`)
  }

  return { data, error: null }
}

export async function createInstitutionWithRequest(
  formData: RegistrationInstitutionForm
) {
  const supabase = await getSupabase()

  let institutionId: string | null = null

  try {
    // 1. Primero verificar si ya existe una institución con el mismo email
    const { data: existingInstitution, error: checkError } = await supabase
      .from('institutions')
      .select('id')
      .eq('contact_email', formData.institution_email)
      .maybeSingle()

    if (checkError) {
      console.error('Error verificando institución existente:', checkError)
    }

    if (existingInstitution) {
      throw new Error(
        'Ya existe una institución registrada con este correo electrónico'
      )
    }

    // 2. Crear la institución
    const { data: institutionData, error: institutionError } = await supabase
      .from('institutions')
      .insert([
        {
          institution_name: formData.institution_name,
          institution_type: formData.institution_type,
          institution_email: formData.institution_email,
          contact_phone: formData.contact_phone,
          description: formData.description,
          validation_status: 'pending' // Estado por defecto para la institución
        }
      ])
      .select('id, institution_name, institution_type, institution_email')
      .single()

    if (institutionError) {
      // Manejar error de constraint única
      if (institutionError.code === '23505') {
        throw new Error(
          'Ya existe una institución registrada con este correo electrónico'
        )
      }
      throw new Error(`Error al crear institución: ${institutionError.message}`)
    }

    institutionId = institutionData.id

    // 3. Crear la solicitud de registro
    const { data: requestData, error: requestError } = await supabase
      .from('registration_requests')
      .insert([
        {
          institution_uuid: institutionData.id,
          institution_name: institutionData.institution_name,
          institution_type: institutionData.institution_type,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          contact_person: formData.contact_person,
          request_status: formData.request_status || 'pending' // Usar el status del form o 'pending' por defecto
        }
      ])
      .select()
      .single()

    if (requestError) {
      // Si falla la creación de la solicitud, eliminar la institución creada
      await supabase.from('institutions').delete().eq('id', institutionData.id)

      throw new Error(
        `Error al crear solicitud de registro: ${requestError.message}`
      )
    }

    return {
      success: true,
      institution: institutionData,
      request: requestData,
      error: null
    }
  } catch (error) {
    console.error('Error en proceso de registro:', error)

    // Limpieza adicional en caso de error inesperado
    if (institutionId) {
      await supabase.from('institutions').delete().eq('id', institutionId)
    }

    return {
      success: false,
      institution: null,
      request: null,
      error:
        error instanceof Error
          ? error.message
          : 'Error desconocido en el proceso de registro'
    }
  }
}

export async function getInstitutionById(id: string): Promise<{
  data: InstitutionForm | null
  error: string | null
}> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo institución por ID:', error)
    return { data: null, error: error.message }
  }
  return { data, error: null }
}

export async function updateInstitutionById(
  id: string,
  updates: Partial<InstitutionForm>
): Promise<{ data: InstitutionForm | null; error: string | null }> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('institutions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('Error actualizando institución:', error)
    return { data: null, error: error.message }
  }
  console.log('Revalidating path...')
  console.log(data)
  revalidatePath('/dashboard/organizations/[slug]/settings')
  return { data, error: null }
}

export async function upsertInstitutionById({
  id,
  updates
}: {
  id: string
  updates: Partial<InstitutionForm>
}): Promise<{ data: InstitutionForm | null; error: string | null }> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('institutions')
    .upsert({ id, ...updates })
    .eq('id', id)
    .select()
    .single()
  console.log('error', error, data)
  if (error) {
    console.error('Error actualizando institución:', error)
    return { data: null, error: error.message }
  }

  revalidatePath(`/dashboard/organizations/${id}/settings`)
  return { data, error: null }
}
