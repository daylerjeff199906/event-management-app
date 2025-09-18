import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { del, list } from '@vercel/blob'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
  }

  // Buscar y eliminar el archivo existente con el mismo nombre

  const existingBlobs = await list({ prefix: filename })
  const existingBlob = existingBlobs.blobs.find(
    (blob) => blob.pathname === filename
  )
  if (existingBlob) {
    await del(filename)
  }

  // ⚠️ The below code is for App Router Route Handlers only
  if (!request.body) {
    return NextResponse.json(
      { error: 'No file data provided' },
      { status: 400 }
    )
  }
  const blob = await put(filename, request.body, {
    access: 'public'
  })

  return NextResponse.json(blob)
}
