'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { toast } from 'react-toastify' // O usa tu ToastCustom
import { generateEventDescriptionAction } from '@/services/google-services'
import { UseFormReturn } from 'react-hook-form'
import { EventFormData } from '@/modules/events/schemas'
import { Category } from '@/types'

interface AiDescriptionGeneratorProps {
  form: UseFormReturn<EventFormData>
  categories?: Category[]
}

export const AiDescriptionGenerator = ({
  form,
  categories
}: AiDescriptionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    // 1. Validar que al menos haya un título
    const title = form.getValues('event_name')
    if (!title || title.length < 3) {
      toast.warning(
        'Escribe al menos el nombre del evento para generar la descripción.'
      )
      return
    }

    setIsGenerating(true)

    // 2. Recopilar datos del formulario
    const startDate = form.getValues('start_date')
    const timeValue = form.getValues('time')
    const categoryId = form.getValues('category')
    const categoryName = categories?.find(
      (c) => Number(c.id) === categoryId
    )?.name

    // Convertir time Date a string legible si existe
    const timeString = timeValue
      ? new Date(timeValue).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : undefined

    try {
      // 3. Llamar a la Server Action
      const result = await generateEventDescriptionAction({
        title,
        date: startDate,
        time: timeString,
        categoryName,
        locationType: form.getValues('event_mode')
      })

      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else if (result.data) {
        // 4. Escribir en el formulario (con efecto de máquina de escribir opcional o directo)
        form.setValue('full_description', result.data, {
          shouldDirty: true,
          shouldValidate: true
        })
        toast.success('¡Descripción generada con éxito!')
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Ocurrió un error inesperado al generar la descripción.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex justify-end mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando magia...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar con IA
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Genera una descripción automática basada en el título y fecha</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
