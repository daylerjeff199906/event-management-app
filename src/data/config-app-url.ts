export const APP_URL = {
  PORTAL: {
    BASE: '/',
    EVENTS: '/events',
    INSTITUTION_REQUEST: '/institution-request'
  },
  PROFILE: {
    URL_BASE: '/profile',
    SETTINGS: '/profile/settings',
    ONBOARDING: '/onboarding'
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
    USERS: {
      BASE: '/organizations/users'
    },
    CONFIGURATIONS: {
      BASE: '/organizations/configurations'
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
    INSTITUTIONS: {
      BASE: '/admin/institutions',
      DETAIL: (id: string) => `/admin/institutions/${id}`,
      ADD_INSTITUTION: '/admin/institutions/add'
    },
    SETTINGS: '/admin/settings'
  },
  NOT_FOUND: '/404'
}
