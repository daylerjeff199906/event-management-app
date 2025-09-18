'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
// import { google } from '@ai-sdk/google'
// import { generateText } from 'ai'

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

// Función para obtener sugerencias de la API de Gemini
const generateSuggestions = async (
  context: EventContext,
  currentText: string
): Promise<string[]> => {
  try {
    const { titulo, fechaInicio, categoria } = context

    // Verificar que la API Key esté disponible
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('API Key no configurada')
    }

    // Construir el prompt
    const prompt = `Como asistente de redacción, genera 3 sugerencias concisas para la descripción de un evento.
    
Contexto del evento:
- Título: ${titulo || 'No especificado'}
- Fecha: ${fechaInicio || 'No especificada'}
- Categoría: ${categoria || 'No especificada'}

Texto actual: "${currentText.substring(0, 100)}${
      currentText.length > 100 ? '...' : ''
    }"

Genera 3 sugerencias variadas, atractivas y relevantes en español.`

    // Llamar a la API con el formato correcto de autenticación
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error detallado:', errorData)
      throw new Error(
        `Error en la API: ${response.status} - ${errorData.message}`
      )
    }

    const data = await response.json()
    const responseText = data.candidates[0].content.parts[0].text

    // Procesar las sugerencias
    const suggestions = responseText
      .split('\n')
      .map((line: string) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((line: string) => line.length > 0)

    return suggestions.slice(0, 3)
  } catch (error) {
    console.error('Error al generar sugerencias:', error)

    // Sugerencias de respaldo
    return [
      'Una experiencia de aprendizaje diseñada para profesionales que buscan destacar en su campo.',
      'Contenido actualizado, networking de calidad y oportunidades de crecimiento profesional.',
      'Inversión en tu desarrollo profesional con retorno inmediato en conocimientos y contactos.'
    ]
  }
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
  const [previousValue, setPreviousValue] = useState(value)

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)
    setShowSuggestions(false)

    try {
      const newSuggestions = await generateSuggestions(eventContext, value)
      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error al generar sugerencias:', error)
      // Puedes mostrar un mensaje de error al usuario si lo deseas
    } finally {
      setIsGenerating(false)
    }
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
        {/* Tabs */}
        <div className="flex mb-2 space-x-2">
          <button
            type="button"
            className={cn(
              'px-3 py-1 rounded-t text-sm font-medium transition-colors',
              !showSuggestions && 'text-primary border-b-2 border-primary',
              showSuggestions && 'text-foreground'
            )}
            onClick={() => setShowSuggestions(false)}
          >
            Editar
          </button>
          <button
            type="button"
            className={cn(
              'px-3 py-1 rounded-t text-sm font-medium transition-colors',
              showSuggestions && 'text-primary border-b-2 border-primary',
              !showSuggestions && 'text-foreground'
            )}
            onClick={() => setShowSuggestions(true)}
          >
            Vista previa
          </button>
        </div>

        {/* Editor o Vista previa */}
        {!showSuggestions ? (
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
        ) : (
          <div className="min-h-[100px] p-3 border rounded bg-background text-foreground whitespace-pre-wrap break-words text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: (value || '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br />')
              }}
            />
          </div>
        )}
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
                dangerouslySetInnerHTML={{
                  __html: suggestion.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>'
                  )
                }}
              />
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
