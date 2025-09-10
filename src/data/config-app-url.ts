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
    TICKETS: '/dashboard/tickets',
    INSTITUTION: {
      BASE: '/dashboard/institutions',
      DETAIL: (id: string) => `/dashboard/institutions/${id}`,
      CONFIG: (id: string) => `/dashboard/institutions/${id}/config`,
      CREATE_EVENT: (id: string) =>
        `/dashboard/institutions/${id}/create-event`,
      EDIT_EVENT: (id: string, eventId: string) =>
        `/dashboard/institutions/${id}/events/${eventId}/edit`,
      EVENTS: (id: string) => `/dashboard/institutions/${id}/events`
    }
  }
}
