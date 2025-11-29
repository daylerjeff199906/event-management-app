'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkCreateEventActivities } from '@/services/bulk-events' // Ajusta ruta
import { EventActivityForm, EventMode } from '@/modules/events/schemas' // Ajusta ruta
import { EventStatus } from '@/types'

interface Props {
  eventId: string // OBLIGATORIO: Necesitamos saber a qué evento pertenecen estas actividades
}

export default function BulkEventUploader({ eventId }: Props) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<{
    success: number
    skipped: number
    errors: string[]
  } | null>(null)

  // 1. Plantilla Actualizada con campos necesarios para calcular Start/End Time
  const handleDownloadTemplate = () => {
    const headers = [
      {
        'Nombre Actividad (Obligatorio)': 'Taller de React',
        Descripción: 'Introducción a Hooks',
        'Ubicación (Opcional)': 'Sala 1',
        'Fecha (DD/MM/AAAA) (Obligatorio)': '25/12/2024',
        'Hora Inicio (HH:MM) (Obligatorio)': '14:30',
        'Hora Fin (HH:MM) (Opcional)': '15:30', // Si no se pone, se calcula +1h
        'Modalidad (PRESENCIAL, VIRTUAL, HIBRIDO)': 'VIRTUAL'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(headers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Actividades')
    XLSX.writeFile(wb, 'plantilla_actividades.xlsx')
  }

  // Utilidad: Parsear Fecha Excel a JS Date (Solo día/mes/año)
  const excelDateToJSDate = (serial: number | string): Date | null => {
    if (!serial) return null
    if (typeof serial === 'string') {
      const parts = serial.split('/')
      if (parts.length === 3)
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`)
      return new Date(serial)
    }
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    // Ajuste por zona horaria Excel
    return new Date(
      date_info.getUTCFullYear(),
      date_info.getUTCMonth(),
      date_info.getUTCDate()
    )
  }

  // Utilidad: Combinar Fecha Base con Hora (HH:MM)
  const combineDateAndTime = (
    baseDate: Date,
    timeInput: string | number
  ): Date => {
    const newDate = new Date(baseDate)

    if (typeof timeInput === 'number') {
      // Decimal Excel (0.5 = 12:00 PM)
      const totalSeconds = Math.floor(timeInput * 86400)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      newDate.setHours(hours, minutes, 0, 0)
    } else if (typeof timeInput === 'string' && timeInput.includes(':')) {
      const [hours, minutes] = timeInput.split(':').map(Number)
      newDate.setHours(hours, minutes, 0, 0)
    }

    return newDate
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!eventId) {
      alert('Error: No se ha detectado el ID del evento padre.')
      return
    }

    setLoading(true)
    setReport(null)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        const activitiesToUpload: Partial<EventActivityForm>[] = []

        // Iterar filas del Excel
        for (const row of data as {
          [key: string]: string | number | undefined
        }[]) {
          const rawName = row['Nombre Actividad (Obligatorio)']
          const rawDate = row['Fecha (DD/MM/AAAA) (Obligatorio)']
          const rawTimeStart = row['Hora Inicio (HH:MM) (Obligatorio)']
          const rawTimeEnd = row['Hora Fin (HH:MM) (Opcional)'] // Opcional en Excel, pero obligatorio en DB

          // Validaciones básicas de fila
          if (!rawName || !rawDate || !rawTimeStart) continue

          // 1. Obtener fecha base
          const baseDate = excelDateToJSDate(rawDate) || new Date()

          // 2. Calcular Start Time (Fecha + Hora)
          const startTime = combineDateAndTime(baseDate, rawTimeStart)

          // 3. Calcular End Time
          // Si el usuario puso hora fin, la usamos. Si no, sumamos 1 hora al inicio.
          let endTime: Date
          if (rawTimeEnd) {
            endTime = combineDateAndTime(baseDate, rawTimeEnd)
          } else {
            endTime = new Date(startTime)
            endTime.setHours(endTime.getHours() + 1) // Default 1 hora duración
          }

          // 4. Modalidad
          let mode = EventMode.PRESENCIAL
          const rawMode = row['Modalidad (PRESENCIAL, VIRTUAL, HIBRIDO)']
            ?.toString()
            .toUpperCase()
          if (
            rawMode &&
            Object.values(EventMode).includes(rawMode as EventMode)
          ) {
            mode = rawMode as EventMode
          }

          // 5. Construir Objeto
          // Nota: No incluimos event_id aquí, se inyecta en el server action o se podría poner aquí.
          // Como usamos Partial<EventActivityForm>, typescript no se queja si falta event_id aun.
          const activityObj: Partial<EventActivityForm> = {
            activity_name: String(rawName),
            description: row['Descripción'] ? String(row['Descripción']) : '',
            custom_location: row['Ubicación (Opcional)']
              ? String(row['Ubicación (Opcional)'])
              : null,
            start_time: startTime,
            end_time: endTime,
            activity_mode: mode,
            // Datos que el usuario no llena en excel:
            meeting_url: null,
            status: EventStatus.PUBLIC
          }

          activitiesToUpload.push(activityObj)
        }

        if (activitiesToUpload.length === 0) {
          alert('No se encontraron actividades válidas en el archivo')
          setLoading(false)
          return
        }

        // Llamada al Server Action pasando el ID
        const response = await bulkCreateEventActivities(
          eventId,
          activitiesToUpload
        )

        if (response.data) {
          setReport({
            success: response.data.successCount,
            skipped: response.data.skippedCount,
            errors: response.data.errors
          })
        } else {
          alert('Error: ' + response.error)
        }
      } catch (error) {
        console.error(error)
        alert('Error procesando el archivo Excel')
      } finally {
        setLoading(false)
        e.target.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Carga Masiva de Actividades
      </h3>

      <div className="flex flex-col gap-4">
        {/* Paso 1 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-700">
              1. Descarga la plantilla
            </p>
            <p className="text-xs text-gray-500">Usa este formato exacto.</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Descargar Excel
          </button>
        </div>

        {/* Paso 2 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-700">
              2. Sube tu archivo
            </p>
            <p className="text-xs text-gray-500">
              Se asignarán al evento actual.
            </p>
          </div>
          <label
            className={`cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Procesando...' : 'Seleccionar Archivo'}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>

        {/* Reporte */}
        {report && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2 text-sm">Resultados:</h4>
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="bg-green-100 p-2 rounded text-green-800">
                <span className="block text-2xl font-bold">
                  {report.success}
                </span>
                <span className="text-xs">Creados</span>
              </div>
              <div className="bg-yellow-100 p-2 rounded text-yellow-800">
                <span className="block text-2xl font-bold">
                  {report.skipped}
                </span>
                <span className="text-xs">Duplicados</span>
              </div>
              <div className="bg-red-100 p-2 rounded text-red-800">
                <span className="block text-2xl font-bold">
                  {report.errors.length}
                </span>
                <span className="text-xs">Errores</span>
              </div>
            </div>

            {report.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto text-xs text-red-600 bg-red-50 p-2 rounded">
                <ul className="list-disc pl-4">
                  {report.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
