import {
  Heart,
  Music,
  Camera,
  Gamepad2,
  Utensils,
  Plane,
  BookOpen,
  Dumbbell
} from 'lucide-react'

export const interestOptions = [
  { id: 'music', label: 'Música', icon: Music },
  { id: 'photography', label: 'Fotografía', icon: Camera },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'food', label: 'Gastronomía', icon: Utensils },
  { id: 'travel', label: 'Viajes', icon: Plane },
  { id: 'books', label: 'Lectura', icon: BookOpen },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'art', label: 'Arte', icon: Heart }
]

export const eventTypeOptions = [
  { id: 'concerts', label: 'Conciertos' },
  { id: 'workshops', label: 'Talleres' },
  { id: 'networking', label: 'Networking' },
  { id: 'sports', label: 'Deportes' },
  { id: 'cultural', label: 'Eventos Culturales' },
  { id: 'tech', label: 'Tecnología' },
  { id: 'food-events', label: 'Eventos Gastronómicos' },
  { id: 'outdoor', label: 'Actividades al Aire Libre' }
]
