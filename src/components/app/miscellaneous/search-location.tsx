'use client'
import { cn } from '@/lib/utils'
import { MapIcon } from 'lucide-react'
import React, { useState } from 'react'

interface Suggestion {
  id: string
  place_name: string
  center: [number, number] // [lon, lat]
}

interface Props {
  placeholder?: string
  className?: string
  onSelect: (address: string, lat: number, lon: number) => void
}

export default function SearchLocation({
  onSelect,
  className,
  placeholder
}: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const fetchSuggestions = async (value: string) => {
    setQuery(value)

    if (value.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        }&autocomplete=true&limit=5&language=es`
      )
      const data = await res.json()
      setSuggestions(data.features || [])
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    }
  }

  const handleSelect = (s: Suggestion) => {
    onSelect(s.place_name, s.center[1], s.center[0]) // lat, lon
    setQuery(s.place_name)
    setSuggestions([])
  }

  return (
    <div className={cn('w-full', className)}>
      <MapIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => fetchSuggestions(e.target.value)}
        placeholder={placeholder || 'Buscar ubicación...'}
        className="w-full p-2 border rounded pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {suggestions.length > 0 && (
        <ul className="border mt-2 rounded bg-white shadow">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
