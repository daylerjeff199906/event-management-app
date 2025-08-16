'use client'

import type React from 'react'
import { useState } from 'react'
import { Search, X, Camera, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  showSmartButton?: boolean
  showCameraIcon?: boolean
  showSearchIcon?: boolean
  className?: string
  smartButtonText?: string
  disabled?: boolean
}

export function SearchBar({
  placeholder = 'Buscar...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  showSmartButton = true,
  showCameraIcon = true,
  showSearchIcon = true,
  className,
  smartButtonText = 'Smart',
  disabled = false
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')

  // Usar valor controlado si se proporciona, sino usar estado interno
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = controlledValue !== undefined ? onChange : setInternalValue

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue?.(newValue)
  }

  const handleClear = () => {
    setValue?.('')
    onClear?.()
  }

  const handleSearch = () => {
    onSearch?.(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div
      className={cn(
        'flex items-center bg-white border border-gray-200 rounded-full w-full transition-shadow duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Icono de búsqueda inicial */}
      <button
        onClick={handleSearch}
        disabled={disabled}
        className="flex items-center justify-center w-10 h-10 ml-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 disabled:hover:bg-black"
        aria-label="Buscar"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Botón Smart */}
      {showSmartButton && (
        <button
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 ml-2 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:hover:bg-transparent"
        >
          <Star className="w-3 h-3" />
          <span>{smartButtonText}</span>
        </button>
      )}

      {/* Campo de entrada */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-base disabled:cursor-not-allowed"
        />

        {/* Botón de limpiar */}
        {value && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:hover:text-gray-400"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Iconos adicionales */}
      <div className="flex items-center gap-2 mr-3">
        {showCameraIcon && (
          <button
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:hover:text-gray-400"
            aria-label="Búsqueda por imagen"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}

        {showSearchIcon && (
          <button
            onClick={handleSearch}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:hover:text-gray-400"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
