export const APP_URL = {
  PORTAL: {
    BASE: '/',
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
      BASE: '/dashboard/events'
    },
    FAVORITES: '/dashboard/favorites',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
    TICKETS: '/dashboard/tickets'
  },
  ORGANIZATION: {
    BASE: '/organizations',
    INSTITUTION: {
      BASE: '/organizations/institutions',
      DETAIL: (id: string) => `/organizations/institutions/${id}`,
      CONFIG: (id: string) => `/organizations/institutions/${id}/config`,
      CREATE_EVENT: (id: string) =>
        `/organizations/institutions/${id}/create-event`,
      EDIT_EVENT: (id: string, eventId: string) =>
        `/organizations/institutions/${id}/events/${eventId}`,
      EVENTS: (id: string) => `/organizations/institutions/${id}/events`
    }
  }
}
