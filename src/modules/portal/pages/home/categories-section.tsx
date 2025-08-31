'use client'
import type { LucideIcon } from 'lucide-react'
import { Gamepad2, Globe, Heart, Music, Palette, Sun } from 'lucide-react'
import { useState } from 'react'

const categoriesData: Category[] = [
  {
    id: 'music',
    name: 'Música',
    icon: Music,
    description: 'Eventos y experiencias musicales'
  },
  {
    id: 'nightlife',
    name: 'Vida Nocturna',
    icon: Globe,
    description: 'Bares, clubs y fiestas'
  },
  {
    id: 'performing-visual-arts',
    name: 'Artes Escénicas y Visuales',
    icon: Palette,
    description: 'Teatro, exposiciones y galerías'
  },
  {
    id: 'holidays',
    name: 'Festividades',
    icon: Sun,
    description: 'Celebraciones y eventos especiales'
  },
  {
    id: 'dating',
    name: 'Citas',
    icon: Heart,
    description: 'Encuentros y actividades románticas'
  },
  {
    id: 'hobbies',
    name: 'Pasatiempos',
    icon: Gamepad2,
    description: 'Actividades recreativas y talleres'
  }
]

export interface Category {
  id: string
  name: string
  icon: LucideIcon
  description?: string
}

interface CategoryGridProps {
  categories?: Category[]
  onCategoryClick?: (category: Category) => void
  className?: string
  title?: string
  subtitle?: string
}

export function CategoryGrid({
  categories = categoriesData,
  onCategoryClick,
  className = '',
  title = 'Explora por categorías',
  subtitle = 'Descubre experiencias que se adapten a tus intereses'
}: CategoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.id)
    setTimeout(() => setSelectedCategory(null), 300) // Reset after animation
    onCategoryClick?.(category)
  }

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 justify-center">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </section>
  )
}

interface CategoryItemProps {
  category: Category
  onClick?: () => void
  isSelected?: boolean
}

function CategoryItem({ category, onClick, isSelected }: CategoryItemProps) {
  const IconComponent = category.icon

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`
        relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
        rounded-full flex items-center justify-center 
        transition-all duration-300 ease-in-out
        ${
          isSelected
            ? 'bg-gray-200 scale-105 shadow-sm'
            : 'bg-gray-50 group-hover:bg-gray-100'
        }
        shadow-xs group-hover:shadow-md
      `}
      >
        <IconComponent
          className={`
            w-5 h-5 sm:w-6 sm:h-6 
            transition-colors duration-200
            ${isSelected ? 'text-gray-800' : 'text-gray-600'}
          `}
          strokeWidth={1.5}
        />
      </div>
      <span className="mt-3 text-xs sm:text-sm font-medium text-gray-900 text-center group-hover:text-gray-700 transition-colors">
        {category.name}
      </span>
      {category.description && (
        <p className="mt-1 text-xs text-gray-500 text-center hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
          {category.description}
        </p>
      )}
    </div>
  )
}
