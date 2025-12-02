'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkCreateEventActivities } from '@/services/bulk-events'
import { EventActivityForm, EventMode } from '@/modules/events/schemas'
import { EventStatus } from '@/types'

interface Props {
  eventId: string
}

export default function BulkEventUploader({ eventId }: Props) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<{
    success: number
    skipped: number
    errors: string[]
  } | null>(null)

  // 1. ACTUALIZADO: Cabeceras estandarizadas (sin espacios, sin tildes, snake_case)
  const handleDownloadTemplate = () => {
    const headers = [
      {
        nombre_actividad: 'Taller de React',
        descripcion: 'Introducción a Hooks',
        ubicacion: 'Sala 1',
        fecha: '25/12/2024',
        fecha_fin: '26/12/2024',
        hora_inicio: '14:30',
        hora_fin: '15:30',
        modalidad: 'PRESENCIAL'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(headers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Actividades')
    XLSX.writeFile(wb, 'plantilla_actividades.xlsx')
  }

  // Utilidad: Parsear Fecha Excel a JS Date
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

    return new Date(
      date_info.getUTCFullYear(),
      date_info.getUTCMonth(),
      date_info.getUTCDate()
    )
  }

  // Utilidad: Combinar Fecha Base con Hora
  const combineDateAndTime = (
    baseDate: Date,
    timeInput: string | number
  ): Date => {
    const newDate = new Date(baseDate)

    if (typeof timeInput === 'number') {
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

        // Iterar filas del Excel usando las nuevas keys
        for (const row of data as {
          [key: string]: string | number | undefined
        }[]) {
          // 2. ACTUALIZADO: Lectura usando las nuevas claves estandarizadas
          const rawName = row['nombre_actividad']
          const rawDate = row['fecha']
          const rawEndDate = row['fecha_fin']
          const rawTimeStart = row['hora_inicio']
          const rawTimeEnd = row['hora_fin']

          const rawDescription = row['descripcion']
          const rawLocation = row['ubicacion']
          const rawMode = row['modalidad']

          // Validaciones básicas de fila (Campos obligatorios)
          if (!rawName || !rawDate || !rawTimeStart) continue

          // --- Lógica de procesamiento de fechas (Igual que antes) ---
          const baseDate = excelDateToJSDate(rawDate) || new Date()
          const startTime = combineDateAndTime(baseDate, rawTimeStart)
          let durationHours: number | null = null
          // Calcular duración solo si existe hora de inicio y hora de fin en la fila
          if (rawTimeStart && rawTimeEnd) {
            const computedEnd = combineDateAndTime(baseDate, rawTimeEnd)
            const diffMs = computedEnd.getTime() - startTime.getTime()
            const hours = diffMs / (1000 * 60 * 60)
            // Redondea a 2 decimales y evita valores negativos
            durationHours = Math.max(0, Math.round(hours * 100) / 100)
          }

          let endTime: Date
          if (rawTimeEnd) {
            endTime = combineDateAndTime(baseDate, rawTimeEnd)
          } else {
            endTime = new Date(startTime)
            endTime.setHours(endTime.getHours() + 1)
          }

          let mode = EventMode.PRESENCIAL
          const modeString = rawMode?.toString().toUpperCase()
          if (
            modeString &&
            Object.values(EventMode).includes(modeString as EventMode)
          ) {
            mode = modeString as EventMode
          }

          // Construir Objeto
          const activityObj: Partial<EventActivityForm> = {
            activity_name: String(rawName),
            description: rawDescription ? String(rawDescription) : '',
            custom_location: rawLocation ? String(rawLocation) : null,
            start_date: baseDate,
            end_date: rawEndDate ? excelDateToJSDate(rawEndDate) : null,
            duration: durationHours || null,
            start_time: startTime,
            end_time: endTime,
            activity_mode: mode,
            meeting_url: null,
            status: EventStatus.PUBLIC // O el estado que prefieras por defecto
          }

          activitiesToUpload.push(activityObj)
        }

        if (activitiesToUpload.length === 0) {
          alert(
            'No se encontraron actividades válidas en el archivo. Revisa que las cabeceras sean correctas (ej: nombre_actividad, fecha, etc).'
          )
          setLoading(false)
          return
        }

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
            <p className="text-xs text-gray-500">
              Formato estandarizado (sin tildes ni espacios).
            </p>
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
