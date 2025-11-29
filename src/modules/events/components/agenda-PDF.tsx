/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useMemo, useEffect, useState } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer'
import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { EventActivity } from '@/types'

// --- 1. Estilos del PDF (Diseño Institucional) ---
Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf'
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf',
      fontWeight: 'bold'
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Oblique.ttf',
      fontStyle: 'italic'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 10,
    color: '#333333'
  },
  // Cabecera Institucional
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a', // Azul institucional
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    flexDirection: 'column'
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4
  },
  documentTitle: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerDate: {
    fontSize: 9,
    color: '#888888',
    marginTop: 4
  },

  // Agrupación por Día
  daySection: {
    marginTop: 15,
    marginBottom: 10
  },
  dayHeader: {
    backgroundColor: '#f3f4f6', // Gris muy claro
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a'
  },
  dayTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase'
  },

  // Fila de Actividad
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    minHeight: 30
  },
  timeCol: {
    width: '18%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb'
  },
  timeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  durationText: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2
  },
  contentCol: {
    width: '82%',
    paddingLeft: 10
  },
  activityTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2
  },
  activityDesc: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.4,
    marginBottom: 4,
    textAlign: 'justify'
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 2
  },
  metaItem: {
    fontSize: 8,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 6,
    borderRadius: 2
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af'
  }
})

// --- 2. Funciones de Ayuda (Duplicadas para no depender del contexto del navegador) ---
const formatPDFDate = (dateString: string) => {
  const date = parseISO(dateString)
  if (!isValid(date)) return 'Fecha inválida'
  return format(date, "EEEE, d 'de' MMMM yyyy", { locale: es }).toUpperCase()
}

const formatPDFTime = (dateString: string) => {
  const date = parseISO(dateString)
  if (!isValid(date)) return '--:--'
  return format(date, 'HH:mm')
}

// --- 3. Componente del Documento PDF ---
interface AgendaDocumentProps {
  activities: EventActivity[]
  institutionName?: string
  eventName?: string
}

const AgendaDocument = ({
  activities,
  institutionName = 'NOMBRE DE LA INSTITUCIÓN',
  eventName = 'Agenda de Actividades'
}: AgendaDocumentProps) => {
  // Agrupamos las actividades dentro del render del PDF
  const groupedData = useMemo(() => {
    if (!activities) return {}
    // 1. Ordenar
    const sorted = [...activities].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )
    // 2. Agrupar
    const groups: Record<string, EventActivity[]> = {}
    sorted.forEach((act) => {
      const dateKey = act.start_time.split('T')[0] + 'T00:00:00'
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(act)
    })
    return groups
  }, [activities])

  const groupKeys = Object.keys(groupedData)
  const generationDate = format(new Date(), 'd/MM/yyyy HH:mm', { locale: es })

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Text style={styles.institutionName}>{institutionName}</Text>
            <Text style={styles.documentTitle}>{eventName}</Text>
            <Text style={styles.headerDate}>Generado el: {generationDate}</Text>
          </View>
          {/* Aquí podrías poner un logo si tuvieras la URL */}
          {/* <PDFImage src="/logo.png" style={{ width: 50, height: 50 }} /> */}
        </View>

        {/* Content */}
        {groupKeys.map((dateKey) => (
          <View key={dateKey} style={styles.daySection} wrap={false}>
            {/* wrap={false} intenta mantener el título pegado a la primera actividad */}
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{formatPDFDate(dateKey)}</Text>
            </View>

            {groupedData[dateKey].map((act) => (
              <View key={act.id} style={styles.row} wrap={false}>
                {/* Columna Hora */}
                <View style={styles.timeCol}>
                  <Text style={styles.timeText}>
                    {formatPDFTime(act.start_time)} -{' '}
                    {formatPDFTime(act.end_time)}
                  </Text>
                  <Text style={styles.durationText}>
                    {act.activity_mode || 'Presencial'}
                  </Text>
                </View>

                {/* Columna Información */}
                <View style={styles.contentCol}>
                  <Text style={styles.activityTitle}>{act.activity_name}</Text>

                  {act.description && (
                    <Text style={styles.activityDesc}>{act.description}</Text>
                  )}

                  <View style={styles.metaRow}>
                    {act.custom_location && (
                      <Text style={styles.metaItem}>
                        📍 {act.custom_location}
                      </Text>
                    )}
                    {act.meeting_url && (
                      <Text style={styles.metaItem}>📹 Enlace disponible</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
          <Text>Documento oficial - Uso interno</Text>
        </View>
      </Page>
    </Document>
  )
}

// --- 4. Componente Botón de Descarga (Cliente) ---

interface AgendaDownloadButtonProps {
  activities: EventActivity[]
  institutionName?: string
  eventName?: string
  className?: string
}

export default function AgendaDownloadButton({
  activities,
  institutionName,
  eventName,
  className
}: AgendaDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)

  // Evitar hydration mismatch de Next.js con @react-pdf
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-gray-300 text-white rounded flex items-center gap-2 ${className}`}
      >
        Cargando PDF...
      </button>
    )
  }

  return (
    <PDFDownloadLink
      document={
        <AgendaDocument
          activities={activities}
          institutionName={institutionName}
          eventName={eventName}
        />
      }
      fileName={`agenda-${format(new Date(), 'dd-MM-yyyy')}.pdf`}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${className}`}
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          'Generando documento...'
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Descargar Agenda PDF
          </>
        )
      }
    </PDFDownloadLink>
  )
}
