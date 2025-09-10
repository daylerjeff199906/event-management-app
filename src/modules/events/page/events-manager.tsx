// 'use client'

// import { useState, useEffect } from 'react'
// import type { Event, ResponsePagination } from '@/types'
// import { EventsList } from './events-list'
// import { Button } from '@/components/ui/button'
// import { Plus, Filter } from 'lucide-react'

// // Mock data para demostración - reemplaza con tu API real
// const mockEvents: Event[] = [
//   {
//     id: '1',
//     event_name: 'Conferencia de Tecnología 2024',
//     description:
//       'Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
//     start_date: '2024-03-15T09:00:00Z',
//     end_date: '2024-03-15T18:00:00Z',
//     location: 'Centro de Convenciones, Ciudad de México',
//     status: 'PUBLIC' as const,
//     cover_image_url: '/tech-conference.png',
//     created_at: '2024-01-15T10:00:00Z',
//     user_id: 'user1'
//   },
//   {
//     id: '2',
//     event_name: 'Workshop de Diseño UX/UI',
//     description:
//       'Aprende los fundamentos del diseño de experiencia de usuario y interfaces.',
//     start_date: '2024-03-20T14:00:00Z',
//     end_date: '2024-03-20T17:00:00Z',
//     location: 'Espacio Creativo, Guadalajara',
//     status: 'DRAFT' as const,
//     cover_image_url: '/collaborative-design-workshop.png',
//     created_at: '2024-01-20T15:00:00Z',
//     user_id: 'user1'
//   },
//   {
//     id: '3',
//     event_name: 'Hackathon Innovación 2024',
//     description:
//       'Evento de 48 horas para desarrollar soluciones innovadoras a problemas reales.',
//     start_date: '2024-04-05T18:00:00Z',
//     end_date: '2024-04-07T18:00:00Z',
//     location: 'Universidad Tecnológica, Monterrey',
//     status: 'PUBLIC' as const,
//     cover_image_url: '/hackathon-coding.jpg',
//     created_at: '2024-02-01T12:00:00Z',
//     user_id: 'user1'
//   },
//   {
//     id: '4',
//     event_name: 'Meetup de Desarrolladores',
//     description:
//       'Encuentro mensual de la comunidad de desarrolladores locales.',
//     start_date: '2024-03-25T19:00:00Z',
//     location: 'Café Tech, Ciudad de México',
//     status: 'PUBLIC' as const,
//     created_at: '2024-02-10T09:00:00Z',
//     user_id: 'user1'
//   }
// ]

// // Función mock para simular la API - reemplaza con tu API real
// const fetchEvents = async (
//   page = 1,
//   pageSize = 12
// ): Promise<ResponsePagination<Event>> => {
//   // Simular delay de red
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   const startIndex = (page - 1) * pageSize
//   const endIndex = startIndex + pageSize
//   const paginatedEvents = mockEvents.slice(startIndex, endIndex)

//   return {
//     data: paginatedEvents,
//     total: mockEvents.length,
//     page,
//     pageSize
//   }
// }

// export default function UserEventsPage() {
//   const [initialData, setInitialData] = useState<
//     ResponsePagination<Event> | undefined
//   >()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const data = await fetchEvents(1, 12)
//         setInitialData(data)
//       } catch (error) {
//         console.error('Error loading initial events:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadInitialData()
//   }, [])

//   const handleLoadMore = async (
//     page: number
//   ): Promise<ResponsePagination<Event>> => {
//     return await fetchEvents(page, 12)
//   }

//   const handleViewDetails = (eventId: string) => {
//     // Implementar navegación a página de detalles
//     console.log('Ver detalles del evento:', eventId)
//     // router.push(`/events/${eventId}`)
//   }

//   const handleCreateEvent = () => {
//     // Implementar navegación a página de creación
//     console.log('Crear nuevo evento')
//     // router.push('/events/create')
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Cargando eventos...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-balance">Mis Eventos</h1>
//           <p className="text-muted-foreground mt-2">
//             Gestiona y visualiza todos tus eventos creados
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <Button variant="outline" size="sm">
//             <Filter className="w-4 h-4 mr-2" />
//             Filtros
//           </Button>
//           <Button onClick={handleCreateEvent} size="sm">
//             <Plus className="w-4 h-4 mr-2" />
//             Nuevo Evento
//           </Button>
//         </div>
//       </div>

//       {/* Events List */}
//       <EventsList
//         initialData={initialData}
//         onLoadMore={handleLoadMore}
//         onViewDetails={handleViewDetails}
//       />
//     </div>
//   )
// }
