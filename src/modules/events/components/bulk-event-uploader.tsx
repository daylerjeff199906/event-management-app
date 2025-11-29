'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkCreateEventActivities } from '@/services/bulk-events'
import { EventMode } from '../schemas'
import { EventFormData } from '@/modules/events/schemas'

export default function BulkEventUploader() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<{
    success: number
    skipped: number
    errors: string[]
  } | null>(null)

  // Función para descargar la plantilla
  const handleDownloadTemplate = () => {
    const headers = [
      {
        'Nombre del Evento (Obligatorio)': 'Taller de React',
        Descripción: 'Introducción a Hooks',
        'Fecha Inicio (DD/MM/AAAA) (Obligatorio)': '25/12/2024',
        'Hora Inicio (HH:MM) (Obligatorio)': '14:30',
        'Fecha Fin (DD/MM/AAAA)': '25/12/2024',
        'Modalidad (PRESENCIAL, VIRTUAL, HIBRIDO)': 'VIRTUAL'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(headers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Eventos')
    XLSX.writeFile(wb, 'plantilla_carga_eventos.xlsx')
  }

  // Convertir fecha Excel a JS Date
  const excelDateToJSDate = (serial: number | string): Date | null => {
    if (!serial) return null
    // Si es string tipo '25/12/2024'
    if (typeof serial === 'string') {
      const parts = serial.split('/')
      if (parts.length === 3)
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      return new Date(serial)
    }
    // Si es numero serial de Excel
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate() + 1
    )
  }

  // Parsear hora texto "14:30" o decimal excel
  const parseTime = (baseDate: Date, timeInput: string | number): Date => {
    const newDate = new Date(baseDate)

    if (typeof timeInput === 'number') {
      // Excel time decimal (fraction of day)
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

        const eventsToUpload: EventFormData[] = []

        // Mapeo de columnas Excel a Schema
        for (const row of data as {
          [key: string]: string | number | undefined
        }[]) {
          const rawName = row['Nombre del Evento (Obligatorio)']
          const rawDate = row['Fecha Inicio (DD/MM/AAAA) (Obligatorio)']
          const rawTime = row['Hora Inicio (HH:MM) (Obligatorio)']

          if (!rawName || !rawDate) continue // Saltar filas vacías obligatorias

          let startDate = excelDateToJSDate(rawDate) || new Date()
          if (rawTime) {
            startDate = parseTime(startDate, rawTime)
          }

          // Manejo fecha fin opcional
          let endDate = null
          if (row['Fecha Fin (DD/MM/AAAA)']) {
            endDate = excelDateToJSDate(row['Fecha Fin (DD/MM/AAAA)'])
          }

          // Validar Enum de Modo
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

          // Construir objeto alineado al Schema
          const eventObj: EventFormData = {
            event_name: String(rawName),
            start_date: startDate,
            end_date: endDate,
            description: row['Descripción'] ? String(row['Descripción']) : '',
            event_mode: mode,
            // Valores por defecto requeridos por TS pero opcionales en logica
            status: undefined
          }

          eventsToUpload.push(eventObj)
        }

        if (eventsToUpload.length === 0) {
          alert('No se encontraron eventos válidos en el archivo')
          setLoading(false)
          return
        }

        // Enviar al server action
        const response = await bulkCreateEventActivities(eventsToUpload)

        if (response.data) {
          setReport({
            success: response.data.successCount,
            skipped: response.data.skippedCount,
            errors: response.data.errors
          })
        } else {
          alert('Error al procesar: ' + response.error)
        }
      } catch (error) {
        console.error(error)
        alert('Error leyendo el archivo Excel')
      } finally {
        setLoading(false)
        // Limpiar input
        e.target.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Carga Masiva de Eventos
      </h3>

      <div className="flex flex-col gap-4">
        {/* Paso 1: Descargar Plantilla */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-700">
              1. Descarga la plantilla
            </p>
            <p className="text-xs text-gray-500">
              Usa este formato para llenar tus datos.
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Descargar Excel
          </button>
        </div>

        {/* Paso 2: Subir Archivo */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-700">
              2. Sube tu archivo lleno
            </p>
            <p className="text-xs text-gray-500">
              Solo se procesarán los eventos válidos.
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

        {/* Reporte de Resultados */}
        {report && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Resultados de la carga:</h4>
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
                <span className="text-xs">Duplicados (Omitidos)</span>
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
