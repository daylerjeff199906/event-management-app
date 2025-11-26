import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import BG_DEFAULT from '@/assets/images/bg-default.webp'
import { cardBackgrounds } from '@/assets/card-backgrounds'

interface eventCard {
  title: string
  description: string
  image?: string
  category: string
  color: string
  textColor: string
}

const eventCards: eventCard[] = [
  {
    title: 'Descubre eventos musicales',
    description: 'Encuentra conciertos y festivales cerca de ti',
    image: cardBackgrounds.Music.src,
    category: 'Música',
    color: 'bg-gradient-to-br from-pink-400 to-rose-500',
    textColor: 'text-white'
  },
  {
    title: 'Eventos gastronómicos',
    description: 'Degustaciones, cenas temáticas y festivales de comida',
    image: cardBackgrounds.Gastronomy.src,
    category: 'Gastronomía',
    color: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    textColor: 'text-white'
  },
  {
    title: 'Eventos deportivos',
    description: 'Partidos, competencias y actividades deportivas',
    image: cardBackgrounds.Sports.src,
    category: 'Deportes',
    color: 'bg-gradient-to-br from-gray-800 to-gray-900',
    textColor: 'text-white'
  },
  {
    title: 'Arte y cultura',
    description: 'Exposiciones, teatro y eventos culturales',
    image: cardBackgrounds.Art.src,
    category: 'Arte',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    textColor: 'text-white'
  }
]

export function EventCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {eventCards.map((card, index) => (
        <Card
          key={index}
          className={`${card.color} ${card.textColor} overflow-hidden cursor-pointer border-0 transition-all duration-300 shadow-lg hover:shadow-xl py-0 group`}
        >
          <div className="p-6 h-80 flex flex-col justify-between relative">
            {/* Imagen de fondo con overlay */}
            <div className="absolute inset-0">
              <img
                src={card.image || BG_DEFAULT.src}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay oscuro que cambia al hacer hover */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
              {/* Overlay del gradiente */}
              <div className="absolute inset-0 opacity-50 mix-blend-multiply group-hover:opacity-70 transition-all duration-300">
                <div className={`w-full h-full ${card.color}`} />
              </div>
            </div>

            <div className="relative z-10">
              <Badge
                variant="secondary"
                className="mb-3 bg-white/20 text-white border-white/30 rounded-full hover:bg-white/30 transition-all"
              >
                {card.category}
              </Badge>
              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm opacity-90">{card.description}</p>
            </div>

            <div className="relative z-10 flex items-center gap-4 text-sm opacity-80">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Hoy</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Cerca</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>50+</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
