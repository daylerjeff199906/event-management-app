'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventContext {
  titulo?: string
  fechaInicio?: string
  categoria?: string
}

interface AITextareaProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
  eventContext?: EventContext
  name?: string
}

// Función que simula sugerencias de IA basadas en el contexto del evento
const generateSuggestions = (
  context: EventContext,
  currentText: string
): string[] => {
  const { titulo, fechaInicio, categoria } = context

  const suggestions: string[] = []

  // Sugerencias basadas en la categoría
  if (categoria) {
    const categorySuggestions: Record<string, string[]> = {
      conferencia: [
        'Únete a expertos de la industria en esta conferencia exclusiva donde compartiremos las últimas tendencias y mejores prácticas.',
        'Una oportunidad única para hacer networking con profesionales destacados y expandir tu conocimiento.',
        'Conferencias magistrales, talleres interactivos y sesiones de Q&A con líderes del sector.'
      ],
      taller: [
        'Aprende de forma práctica con ejercicios hands-on y casos reales de la industria.',
        'Taller intensivo donde desarrollarás habilidades aplicables inmediatamente en tu trabajo.',
        'Sesión práctica con herramientas y técnicas que podrás implementar desde el primer día.'
      ],
      networking: [
        'Conecta con profesionales de tu área y expande tu red de contactos en un ambiente relajado.',
        'Oportunidad perfecta para conocer personas con intereses similares y crear colaboraciones futuras.',
        'Evento diseñado para facilitar conexiones significativas y oportunidades de negocio.'
      ],
      webinar: [
        'Sesión online interactiva donde podrás participar desde la comodidad de tu hogar u oficina.',
        'Webinar en vivo con sesión de preguntas y respuestas al final para resolver todas tus dudas.',
        'Contenido exclusivo que será grabado y estará disponible para los asistentes registrados.'
      ]
    }

    const categoryKey = categoria.toLowerCase()
    if (categorySuggestions[categoryKey]) {
      suggestions.push(...categorySuggestions[categoryKey])
    }
  }

  // Sugerencias basadas en el título
  if (titulo) {
    suggestions.push(
      `Descubre todo lo que necesitas saber sobre "${titulo}" en esta experiencia única.`,
      `"${titulo}" te espera con contenido de alta calidad y speakers reconocidos.`,
      `No te pierdas "${titulo}", un evento que transformará tu perspectiva profesional.`
    )
  }

  // Sugerencias basadas en la fecha
  if (fechaInicio) {
    const fecha = new Date(fechaInicio)
    const mes = fecha.toLocaleDateString('es-ES', { month: 'long' })
    suggestions.push(
      `Marca tu calendario para este ${mes} y prepárate para una experiencia inolvidable.`,
      `Reserva la fecha y asegura tu lugar en este evento imperdible de ${mes}.`
    )
  }

  // Sugerencias generales
  suggestions.push(
    'Una experiencia de aprendizaje diseñada para profesionales que buscan destacar en su campo.',
    'Contenido actualizado, networking de calidad y oportunidades de crecimiento profesional.',
    'Inversión en tu desarrollo profesional con retorno inmediato en conocimientos y contactos.',
    'Certificado de participación incluido para validar tu compromiso con el aprendizaje continuo.'
  )

  // Filtrar sugerencias que no estén ya en el texto actual
  return suggestions
    .filter(
      (suggestion) =>
        !currentText
          .toLowerCase()
          .includes(suggestion.toLowerCase().substring(0, 20))
    )
    .slice(0, 3)
}

export function AITextarea({
  placeholder = 'Describe tu evento...',
  className,
  value = '',
  onChange,
  eventContext = {},
  name,
  ...props
}: AITextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)

    // Simular delay de IA
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newSuggestions = generateSuggestions(eventContext, value)
    setSuggestions(newSuggestions)
    setShowSuggestions(true)
    setIsGenerating(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const newValue = value ? `${value}\n\n${suggestion}` : suggestion
    onChange?.(newValue)
    setShowSuggestions(false)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          className={cn('min-h-[100px] pr-12', className)}
          value={value}
          onChange={handleTextareaChange}
          name={name}
          {...props}
        />

        {/* Botón de IA */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-primary/10"
          onClick={handleGenerateSuggestions}
          disabled={isGenerating}
        >
          <Sparkles
            className={cn(
              'h-4 w-4 text-primary',
              isGenerating && 'animate-spin'
            )}
          />
        </Button>
      </div>

      {/* Panel de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="p-4 space-y-3 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Sugerencias de IA
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowSuggestions(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left p-3 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm leading-relaxed"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Haz clic en cualquier sugerencia para agregarla a tu descripción
          </p>
        </Card>
      )}
    </div>
  )
}
