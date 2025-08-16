export interface IPerson {
  uuid: string
  document_number: string
  names: string
  last_name1: string
  last_name2: string
  photo: string
  document_type: number
  person_type: number
  gender: string | null
  marital_status: number | null
  ubigeo_birth_uuid: string | null
  birthdate: string | null
  comunity_indigenous: string | null
  disability: string | null
  country: string | null
}
