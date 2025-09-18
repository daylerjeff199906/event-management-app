import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { del, list } from '@vercel/blob'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
  }

  // Si has añadido un folder "image" en Vercel, puedes guardar los archivos dentro de ese folder
  const folder = 'image'
  const fullPath = `${folder}/${filename}`

  // Buscar y eliminar el archivo existente con el mismo nombre en el folder
  const existingBlobs = await list({ prefix: fullPath })
  const existingBlob = existingBlobs.blobs.find(
    (blob) => blob.pathname === fullPath
  )
  if (existingBlob) {
    await del(fullPath)
  }

  if (!request.body) {
    return NextResponse.json(
      { error: 'No file data provided' },
      { status: 400 }
    )
  }
  const blob = await put(fullPath, request.body, {
    access: 'public'
  })

  return NextResponse.json(blob)
}
