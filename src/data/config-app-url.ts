export const APP_URL = {
  PORTAL: {
    BASE: '/',
    ONBOARDING: '/onboarding',
    EVENTS: {
      BASE: '/events',
      DETAIL: (uuid: string) => `/events/${uuid}`
    },
    INSTITUTION_REQUEST: '/institution-request'
  },
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    REGISTER: '/sign-up'
  },
  DASHBOARD: {
    BASE: '/dashboard',
    EVENTS: {
      BASE: '/dashboard/events',
      DETAIL: (uuid: string) => `/dashboard/events/${uuid}`
    },
    FAVORITES: '/dashboard/favorites',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
    TICKETS: '/dashboard/tickets'
  },
  ORGANIZATION: {
    BASE: '/organizations',
    INSTITUTION: {
      BASE: '/organizations',
      DETAIL: (id: string) => `/organizations/${id}`,
      CONFIG: (id: string) => `/organizations/${id}/config`,
      CREATE_EVENT: (id: string) => `/organizations/${id}/create-event`,
      EDIT_EVENT: (id: string, eventId: string) =>
        `/organizations/${id}/events/${eventId}`,
      ADD_SCHEDULE: (id: string, eventId: string) =>
        `/organizations/${id}/events/${eventId}/schedule`,
      ADD_TICKET: (id: string, eventId: string) =>
        `/organizations/${id}/events/${eventId}/ticket`,
      EVENT_INFO: (id: string, eventId: string) =>
        `/organizations/${id}/events/${eventId}/info`,
      EVENTS: (id: string) => `/organizations/${id}/events`
    },
    EVENTS: {
      EVENTS_INSTITUTION: (idInstitution: string) =>
        `/organizations/${idInstitution}/events`
    },
    USERS: {
      BASE: '/organizations/users',
      USER_INSTITUTION: (idInstitution: string) =>
        `/organizations/${idInstitution}/users`,
      ADD_USER: (idInstitution: string) =>
        `/organizations/${idInstitution}/users/add`
    },
    CONFIGURATIONS: {
      BASE: '/organizations/configurations',
      CONFIG_INSTITUTION: (idInstitution: string) =>
        `/organizations/${idInstitution}/settings`
    }
  },
  ADMIN: {
    BASE: '/admin',
    REQUESTS_APPROVAL: {
      BASE: '/admin/requests-approval',
      DETAILS: (id: string) => `/admin/requests-approval/${id}`
    },
    USERS: {
      BASE: '/admin/users',
      DETAIL: (id: string) => `/admin/users/${id}`,
      ADD_USER: '/admin/users/add'
    },
    CATEGORIES: {
      BASE: '/admin/categories',
      ADD_CATEGORY: '/admin/categories/create',
      EDIT: (id: string | number) => `/admin/categories/${id}`
    },
    INSTITUTIONS: {
      BASE: '/admin/institutions',
      EDIT: (id: string) => `/admin/institutions/${id}`,
      DETAIL: (id: string) => `/admin/institutions/${id}/details`,
      ADD_INSTITUTION: '/admin/institutions/create',
      ADD_USERS: (id: string) => `/admin/institutions/${id}/users`
    },
    SETTINGS: '/admin/settings'
  },
  NOT_FOUND: '/404'
}
