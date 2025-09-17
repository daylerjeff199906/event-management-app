'use server'
import { getSupabase } from './core.supabase'
import {
  RegistrationRequestList,
  ResponsePagination,
  RegistrationRequestFilter,
  InstitutionEvent,
  RegistrationRequest
} from '@/types'

// export async function fetchRegistrationRequestsByInstitution(
//   filter: RegistrationRequestFilter
// ): Promise<{
//   data: ResponsePagination<RegistrationRequestList> | null
//   error: Error | null
// }> {
//   const supabase = await getSupabase()
//   const {
//     searchQuery = '',
//     page = 1,
//     pageSize = 10,
//     institution_id,
//     user_id,
//     status
//   } = filter

//   try {
//     const from = (page - 1) * pageSize
//     const to = from + pageSize - 1

//     // Primero obtenemos las solicitudes de registro
//     let query = supabase
//       .from('registration_requests')
//       .select('*', { count: 'exact' })
//       .order('created_at', { ascending: false })
//       .range(from, to)

//     // Filtro de búsqueda
//     if (searchQuery) {
//       query = query.or(
//         `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
//       )
//     }

//     // Filtro por institución
//     if (institution_id) {
//       query = query.eq('institution_id', institution_id)
//     }

//     // Filtro por usuario
//     if (user_id) {
//       query = query.eq('user_id', user_id)
//     }

//     // Filtro por estado
//     if (status) {
//       query = query.eq('status', status)
//     }

//     const { data: requests, error, count } = await query

//     if (error) {
//       console.error('Error fetching registration requests:', error)
//       return { data: null, error }
//     }

//     if (!requests || requests.length === 0) {
//       const response: ResponsePagination<RegistrationRequestList> = {
//         data: [],
//         total: count ?? 0,
//         page,
//         pageSize
//       }
//       return { data: response, error: null }
//     }

//     // Obtenemos los UUIDs de las instituciones para hacer la segunda consulta
//     const institutionUuids = requests
//       .map((request) => request.institution_uuid)
//       .filter((uuid): uuid is string => uuid !== null && uuid !== undefined)

//     let institutionsData: InstitutionEvent[] = []

//     if (institutionUuids.length > 0) {
//       // Consultamos las instituciones por sus UUIDs
//       const { data: institutions, error: institutionsError } = await supabase
//         .from('institutions')
//         .select('*')
//         .in('id', institutionUuids)

//       if (institutionsError) {
//         console.error('Error fetching institutions:', institutionsError)
//         // Aún así retornamos los datos, pero sin la información de instituciones
//       } else {
//         institutionsData = institutions || []
//       }
//     }

//     // Combinamos los datos
//     const combinedData = requests.map((request) => {
//       const institution = institutionsData.find(
//         (inst) => inst.id === request.institution_uuid
//       )
//       return {
//         ...request,
//         institution: institution || null
//       }
//     }) as RegistrationRequestList[]

//     const response: ResponsePagination<RegistrationRequestList> = {
//       data: combinedData,
//       total: count ?? 0,
//       page,
//       pageSize
//     }

//     return { data: response, error: null }
//   } catch (err) {
//     console.error('Unexpected error fetching registration requests:', err)
//     return { data: null, error: err as Error }
//   }
// }

export async function fetchRegistrationRequests(
  filter: RegistrationRequestFilter
): Promise<{
  data: ResponsePagination<RegistrationRequest> | null
  error: Error | null
}> {
  const supabase = await getSupabase()
  const {
    searchQuery = '',
    page = 1,
    pageSize = 10,
    institution_id,
    user_id,
    status
  } = filter

  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Primero obtenemos las solicitudes de registro
    let query = supabase
      .from('registration_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filtro de búsqueda
    if (searchQuery) {
      query = query.or(
        `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
      )
    }

    // Filtro por institución
    if (institution_id) {
      query = query.eq('institution_id', institution_id)
    }

    // Filtro por usuario
    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    // Filtro por estado
    if (status) {
      query = query.eq('status', status)
    }

    const { data: requests, error, count } = await query

    if (error) {
      console.error('Error fetching registration requests:', error)
      return { data: null, error }
    }

    if (!requests || requests.length === 0) {
      const response: ResponsePagination<RegistrationRequest> = {
        data: [],
        total: count ?? 0,
        page,
        pageSize
      }
      return { data: response, error: null }
    }

    const response: ResponsePagination<RegistrationRequest> = {
      data: requests as RegistrationRequest[],
      total: count ?? 0,
      page,
      pageSize
    }

    return { data: response, error: null }
  } catch (err) {
    console.error('Unexpected error fetching registration requests:', err)
    return { data: null, error: err as Error }
  }
}

export async function fetchRegistrationRequestsByInstitution({
  id_request
}: {
  id_request: string
}): Promise<{ data: RegistrationRequestList | null; error: Error | null }> {
  const supabase = await getSupabase()

  try {
    // Obtenemos la solicitud de registro por su ID
    const { data: request, error } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', id_request)
      .maybeSingle()

    if (error) {
      console.error('Error fetching registration request:', error)
      return { data: null, error }
    }
    if (!request) {
      return { data: null, error: null }
    }

    let institution: InstitutionEvent | null = null
    if (request.institution_uuid) {
      const { data: institutionData, error: institutionError } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', request.institution_uuid)
        .maybeSingle()

      if (institutionError) {
        console.error('Error fetching institution:', institutionError)
      } else {
        institution = institutionData as InstitutionEvent
      }
    }

    return { data: { ...request, institution }, error: null }
  } catch (err) {
    console.error('Unexpected error fetching registration request:', err)
    return { data: null, error: err as Error }
  }
}

export async function updateRegistrationRequestStatus(
  id_request: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<{ data: RegistrationRequest | null; error: Error | null }> {
  const supabase = await getSupabase()
  try {
    const { data, error } = await supabase
      .from('registration_requests')
      .update({ status })
      .eq('id', id_request)
      .single()
    if (error) {
      console.error('Error updating registration request status:', error)
      return { data: null, error }
    }

    return { data: data as RegistrationRequest, error: null }
  } catch (err) {
    console.error('Unexpected error updating registration request status:', err)
    return { data: null, error: err as Error }
  }
}
