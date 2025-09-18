'use server'

import { createServiceRoleSupabase } from '@/utils/supabase/core.supabase-admin'
import { getSupabase } from './core.supabase'

interface RegistrationRequest {
  id: string
  institution_name: string
  contact_email: string
  request_status?: string | null
  institution_uuid?: string | null
}

interface CreateAccountResult {
  success: boolean
  message: string
  userId?: string
  institutionId?: string
  roleId?: string
  requestId?: string
}

interface CreateInstitutionAccountParams {
  email: string
  institutionId: string
  registrationRequestId: string
  firstName: string
  lastName: string
}

export async function createInstitutionAccount({
  email,
  institutionId,
  registrationRequestId,
  firstName,
  lastName
}: CreateInstitutionAccountParams): Promise<CreateAccountResult> {
  const supabase = await getSupabase()
  const supabaseAdmin = createServiceRoleSupabase()

  try {
    // 1. Verificar si el usuario ya existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    let userId: string

    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`Error al verificar usuario: ${userError.message}`)
    }

    if (existingUser) {
      userId = existingUser.id
      console.log(`Usuario existente encontrado: ${userId}`)
    } else {
      // 2. Crear usuario con contraseña por defecto
      const defaultPassword = 'TempPassword123!'

      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            is_institution_owner: true,
            created_via_admin: true
          }
        })

      console.log(authData, authError)

      if (authError) {
        throw new Error(`Error al crear usuario en Auth: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario en Auth')
      }

      userId = authData.user.id

      // 3. Crear registro en la tabla users
      const { error: userCreateError } = await supabase.from('users').insert([
        {
          id: userId,
          email: email,
          first_name: firstName,
          last_name: lastName
        }
      ])

      if (userCreateError) {
        throw new Error(`Error al crear usuario: ${userCreateError.message}`)
      }

      console.log(`Usuario creado exitosamente: ${userId}`)
    }

    // 4. Obtener la solicitud de registro antes de usarla
    const { data: registrationRequest, error: requestError } = await supabase
      .from('registration_requests')
      .select(
        'id, institution_name, contact_email, request_status, institution_uuid'
      )
      .eq('id', registrationRequestId)
      .single()

    if (requestError) {
      throw new Error(
        `Error al verificar solicitud de registro: ${requestError.message}`
      )
    }

    if (!registrationRequest) {
      throw new Error('Solicitud de registro no encontrada')
    }

    // 5. Verificar y activar la institución
    let institution = null
    let institutionError = null

    // Buscar la institución
    const { data: foundInstitution, error: findInstitutionError } =
      await supabase
        .from('institutions')
        .select(
          'id, institution_name, institution_email, status, validation_status'
        )
        .eq('id', institutionId)
        .single()

    institution = foundInstitution
    institutionError = findInstitutionError

    if (institutionError && institutionError.code !== 'PGRST116') {
      throw new Error(
        `Error al verificar institución: ${institutionError.message}`
      )
    }

    if (!institution) {
      // Si no existe, crear la institución
      const { data: newInstitution, error: createInstitutionError } =
        await supabase
          .from('institutions')
          .insert([
            {
              id: institutionId,
              institution_name:
                registrationRequest.institution_name || 'Nueva Institución',
              institution_email: email,
              status: 'active'
            }
          ])
          .select('id, institution_name, institution_email, status')
          .single()

      if (createInstitutionError) {
        throw new Error(
          `Error al crear institución: ${createInstitutionError.message}`
        )
      }

      institution = newInstitution
      console.log(`Institución creada exitosamente: ${institutionId}`)
    } else {
      // Si existe, actualizar estado a activa
      const { error: updateInstitutionError } = await supabase
        .from('institutions')
        .update({
          status: 'active',
          validation_status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', institutionId)

      if (updateInstitutionError) {
        throw new Error(
          `Error al activar institución: ${updateInstitutionError.message}`
        )
      }
    }

    if (requestError) {
      const { message } = requestError
      throw new Error(`Error al verificar solicitud de registro: ${message}`)
    }

    if (!registrationRequest) {
      throw new Error('Solicitud de registro no encontrada')
    }

    // 7. Actualizar estado de la solicitud a aprobada
    const { error: updateRequestError } = await supabase
      .from('registration_requests')
      .update({
        request_status: 'approved',
        institution_uuid: institutionId, // Vincular la institución creada
        updated_at: new Date().toISOString()
      })
      .eq('id', registrationRequestId)

    if (updateRequestError) {
      throw new Error(
        `Error al actualizar solicitud de registro: ${updateRequestError.message}`
      )
    }

    console.log(`Solicitud de registro aprobada: ${registrationRequestId}`)

    // 8. Verificar si ya existe un rol para este usuario e institución
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('institution_id', institutionId)
      .single()

    let roleId: string | undefined

    if (roleCheckError && roleCheckError.code !== 'PGRST116') {
      throw new Error(`Error al verificar roles: ${roleCheckError.message}`)
    }

    if (!existingRole) {
      // 9. Crear rol de institution_owner
      const { data: newRole, error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: userId,
            role: 'institution_owner',
            institution_id: institutionId,
            access_enabled: true,
            role_action: []
          }
        ])
        .select('id')
        .single()

      if (roleError) {
        throw new Error(`Error al crear rol: ${roleError.message}`)
      }

      roleId = newRole.id
      console.log(`Rol creado exitosamente: ${roleId}`)
    } else {
      roleId = existingRole.id
      console.log(`Rol existente encontrado: ${roleId}`)
    }

    return {
      success: true,
      message: 'Cuenta creada y configurada exitosamente',
      userId,
      institutionId,
      roleId,
      requestId: registrationRequestId
    }
  } catch (error) {
    console.error('Error en createInstitutionAccount:', error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error desconocido al crear la cuenta'
    }
  }
}

// Función auxiliar para obtener información de la solicitud de registro
export async function getRegistrationRequest(
  requestId: string
): Promise<RegistrationRequest | null> {
  const supabase = await getSupabase()

  try {
    const { data, error } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Error al obtener solicitud: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error en getRegistrationRequest:', error)
    throw error
  }
}

// Función para aprobar una solicitud de registro (función separada por si se necesita usar individualmente)
export async function approveRegistrationRequest(
  requestId: string,
  institutionId: string
): Promise<boolean> {
  const supabase = await getSupabase()

  try {
    const { error } = await supabase
      .from('registration_requests')
      .update({
        request_status: 'approved',
        institution_uuid: institutionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) {
      throw new Error(`Error al aprobar solicitud: ${error.message}`)
    }

    console.log(`Solicitud ${requestId} aprobada exitosamente`)
    return true
  } catch (error) {
    console.error('Error en approveRegistrationRequest:', error)
    return false
  }
}
