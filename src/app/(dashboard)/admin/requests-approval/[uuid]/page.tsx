'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  MapPin,
  Globe,
  ImageIcon,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RegistrationRequestList } from '@/types'

const mockRequests: RegistrationRequestList[] = [
  {
    id: '5b656930-4339-4e95-b3d5-964ed4984128',
    institution_name: 'Universidad Tecnológica Nacional',
    institution_type: 'educacion',
    contact_email: 'admin@utn.edu.ar',
    contact_phone: '+54 11 4867-7500',
    contact_person: 'Dr. María González',
    documents: null,
    request_status: 'pending',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    institution_uuid: 'inst_001',
    institution: {
      id: 'inst_001',
      institution_name: 'Universidad Tecnológica Nacional',
      institution_type: 'educacion',
      description:
        'Universidad pública argentina especializada en ingeniería y tecnología',
      institution_email: 'info@utn.edu.ar',
      contact_phone: '+54 11 4867-7500',
      address: 'Av. Medrano 951, C1179AAQ CABA, Argentina',
      documents: null,
      validation_status: 'pending',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      information_external: 'Universidad reconocida por CONEAU',
      document_number: '30-54667834-9',
      brand: 'UTN',
      cover_image_url: 'https://example.com/utn-cover.jpg',
      map_iframe_url: 'https://maps.google.com/embed?pb=!1m18!1m12...',
      acronym: 'UTN',
      status: 'ACTIVE'
    }
  }
]

interface PageProps {
  params: {
    uuid: string
  }
}

const getStatusBadge = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pendiente
        </Badge>
      )
    case 'approved':
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Aprobada
        </Badge>
      )
    case 'rejected':
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Rechazada
        </Badge>
      )
    default:
      return <Badge variant="outline">Sin estado</Badge>
  }
}

export default function RequestDetailsPage({ params }: PageProps) {
  const router = useRouter()

  const request = mockRequests.find((req) => req.id === params.uuid)

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Solicitud no encontrada
          </h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleApprove = (request: RegistrationRequestList) => {
    console.log('Aprobando solicitud:', request.id)
    // Aquí iría la lógica de aprobación
  }

  const handleReject = (request: RegistrationRequestList) => {
    console.log('Rechazando solicitud:', request.id)
    // Aquí iría la lógica de rechazo
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header con navegación */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a solicitudes
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Detalles de Solicitud</h1>
            <p className="text-muted-foreground">ID: {request.id}</p>
          </div>

          {/* Estado y acciones */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado:</span>
              {getStatusBadge(request.request_status)}
            </div>

            {request.request_status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(request)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Aprobar Solicitud
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(request)}
                >
                  Rechazar Solicitud
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de la Solicitud */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre de Institución
                </label>
                <p className="text-sm mt-1">{request.institution_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <p className="text-sm mt-1 capitalize">
                  {request.institution_type}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{request.contact_email}</span>
              </div>

              {request.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.contact_phone}</span>
                </div>
              )}

              {request.contact_person && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.contact_person}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="mt-1">{formatDate(request.created_at)}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">
                  Última Actualización
                </label>
                <p className="mt-1">{formatDate(request.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Institución */}
        {request.institution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Institución
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado de Validación
                  </label>
                  <p className="text-sm mt-1">
                    <Badge
                      variant={
                        request.institution.validation_status === 'pending'
                          ? 'outline'
                          : 'default'
                      }
                    >
                      {request.institution.validation_status || 'N/A'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado General
                  </label>
                  <p className="text-sm mt-1">
                    <Badge
                      variant={
                        request.institution.status === 'ACTIVE'
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {request.institution.status || 'N/A'}
                    </Badge>
                  </p>
                </div>
              </div>

              {request.institution.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Descripción
                    </label>
                    <p className="text-sm mt-1">
                      {request.institution.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {request.institution.institution_email}
                  </span>
                </div>

                {request.institution.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {request.institution.contact_phone}
                    </span>
                  </div>
                )}

                {request.institution.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {request.institution.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              {(request.institution.document_number ||
                request.institution.acronym ||
                request.institution.brand) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {request.institution.document_number && (
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Número de Documento
                        </label>
                        <p className="mt-1">
                          {request.institution.document_number}
                        </p>
                      </div>
                    )}
                    {request.institution.acronym && (
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Acrónimo
                        </label>
                        <p className="mt-1">{request.institution.acronym}</p>
                      </div>
                    )}
                    {request.institution.brand && (
                      <div className="sm:col-span-2">
                        <label className="font-medium text-muted-foreground">
                          Marca
                        </label>
                        <p className="mt-1">{request.institution.brand}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* URLs */}
              {(request.institution.cover_image_url ||
                request.institution.map_iframe_url) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {request.institution.cover_image_url && (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={request.institution.cover_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ver imagen de portada
                        </a>
                      </div>
                    )}
                    {request.institution.map_iframe_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={request.institution.map_iframe_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ver ubicación en mapa
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
