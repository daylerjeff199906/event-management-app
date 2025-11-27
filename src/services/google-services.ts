'use server'

import { GoogleGenAI } from "@google/genai";

const ai  = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
})

interface EventDetails {
  title: string
  date?: Date
  time?: string
  categoryName?: string
  locationType?: string
}

export async function generateEventDescriptionAction(details: EventDetails) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'API Key no configurada' }
  }

const prompt = `
    Actúa como un copywriter experto en marketing de eventos.
    Crea una descripción atractiva, persuasiva y con formato enriquecido (Markdown) para el siguiente evento.
    
    Detalles del evento:
    - Título: ${details.title}
    - Fecha: ${details.date ? details.date.toDateString() : 'Por definir'}
    - Hora: ${details.time || 'Por definir'}
    - Categoría: ${details.categoryName || 'General'}
    - Modalidad: ${details.locationType || 'General'}

    Requisitos del texto generado:
    1. Usa emojis relevantes para hacerlo visual.
    2. Usa negritas (**texto**) para resaltar puntos clave.
    3. Estructura: Gancho inicial atractivo -> Detalles de valor -> Llamada a la acción clara.
    4. Idioma: Español.
    5. Tono: Profesional pero entusiasta.
    6. Longitud: Entre 300 y 350 palabras.

    Instrucciones importantes (obligatorias):
    - Devuelve únicamente la descripción solicitada en formato Markdown.
    - NO incluyas ningún prefacio, saludo, explicación, encabezado adicional ni texto tipo "Respuesta de Gemini AI:", "¡Absolutamente!" o separadores (---).
    - Empieza directamente con la descripción; no añadas metadatos ni comentarios.
 `

  try {
   const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
   
  const resJson = await response.text
  const description = resJson?.trim()
  
    return { success: true, data: description }
  } catch (error) {
    console.error('Error generando descripción con IA:', error)
    return { error: 'Error al conectar con el servicio de IA' }
  }
}