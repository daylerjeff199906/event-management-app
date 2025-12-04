'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/app/miscellaneous/image-upload'

export default function CreateProfilePage() {
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí enviarías 'imageUrl' junto con el resto de tus datos a tu base de datos
    console.log('Guardando en BD:', imageUrl)
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Crear Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vista previa de la imagen */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Foto de perfil</label>

          {imageUrl ? (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white text-xs"
              >
                X
              </button>
            </div>
          ) : (
            // Aquí usamos nuestro componente
            <ImageUpload onUpload={(url) => setImageUrl(url)} preset="events" />
          )}
        </div>

        {/* Botón de guardar formulario */}
        <button
          type="submit"
          disabled={!imageUrl}
          className="w-full py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
