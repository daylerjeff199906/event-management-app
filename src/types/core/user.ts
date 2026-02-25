import { Pagination } from './pagination'

export type AccountType = 'basic' | 'premium' | 'institution'
export type GlobalRole = 'user' | 'admin' | 'super_admin'
export type InstitutionRole = 'member' | 'editor' | 'admin' | 'owner'

export interface IProfile {
  id: string
  first_name: string
  last_name: string
  profile_image: string | null
  country: string | null
  birth_date: string | null
  phone: string | null
  email: string | null
  gender: string | null
  username: string | null
  account_type: AccountType
  global_role: GlobalRole
  onboarding_completed: boolean
  onboarding_completed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface IProfileFull extends IProfile {
  institutions: IUserInstitution[]
  subscription: ISubscription | null
}

export interface IUserInstitution {
  institution_id: string
  role: InstitutionRole
  is_super_admin: boolean
  access_enabled: boolean
  institution: {
    id: string
    name: string
    type: string
    slug: string
    logo_url: string | null
    status: string | null
  }
}

export interface ISubscription {
  plan_type: string
  max_events: number
  events_created: number
  is_active: boolean
}

export interface IUserRole {
  id: string
  user_id: string
  institution_id: string | null
  role_type: InstitutionRole
  is_super_admin: boolean
  access_enabled: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface IUserRoleFull extends IUserRole {
  user: IProfile | null
}

export interface IProfileFilter extends Pagination {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  searchQuery?: string
  account_type?: AccountType
  global_role?: GlobalRole
  onboarding_completed?: boolean
}

export interface EventLimitCheck {
  allowed: boolean
  limit: number
  current: number
  remaining?: number
  reason: string
}
