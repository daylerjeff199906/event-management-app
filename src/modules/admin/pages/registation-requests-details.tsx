'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  MapPin,
  Globe,
  ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { RegistrationRequestList } from '@/types'
import { useState } from 'react'

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

interface RequestDetailsPageProps {
  itemData: RegistrationRequestList | null
}

export default function RequestDetailsPage({
  itemData
}: RequestDetailsPageProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

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

  const handleApprove = async (request: RegistrationRequestList) => {
    setIsProcessing(true)
    try {
      console.log('Aprobando solicitud:', request.id)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Solicitud aprobada exitosamente')
    } catch {
      alert('Error al aprobar la solicitud')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (request: RegistrationRequestList) => {
    setIsProcessing(true)
    try {
      console.log('Rechazando solicitud:', request.id)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Solicitud rechazada')
    } catch {
      alert('Error al rechazar la solicitud')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!itemData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a solicitudes
        </Button>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No se encontró la información de la solicitud.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a solicitudes
        </Button>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Detalles de Solicitud de Registro
            </h1>
            <p className="text-muted-foreground text-lg">
              Revisa toda la información antes de tomar una decisión
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>ID de Solicitud:</strong> {itemData.id}
              <br />
              <strong>Estado actual:</strong>{' '}
              {getStatusBadge(itemData.request_status)}
              {itemData.request_status === 'pending' && (
                <span className="block mt-2 text-sm">
                  💡 Esta solicitud está pendiente de revisión. Puedes aprobarla
                  o rechazarla usando los botones de acción.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-8">
        {itemData.request_status === 'pending' && (
          <Card className="border-2 border-dashed border-primary/20 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                Acciones Requeridas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Revisa cuidadosamente toda la información antes de tomar una
                  decisión. Esta acción no se puede deshacer fácilmente.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Procesando...' : 'Aprobar Solicitud'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Aprobar esta solicitud?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de aprobar la solicitud de registro para{' '}
                          <strong>{itemData.institution_name}</strong>. Esta
                          acción permitirá que la institución acceda al sistema.
                          <br />
                          <br />
                          ¿Estás seguro de que quieres continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleApprove(itemData)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Sí, Aprobar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Procesando...' : 'Rechazar Solicitud'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Rechazar esta solicitud?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de rechazar la solicitud de registro
                          para <strong>{itemData.institution_name}</strong>. La
                          institución será notificada del rechazo.
                          <br />
                          <br />
                          ¿Estás seguro de que quieres continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleReject(itemData)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sí, Rechazar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Nombre de Institución
                </label>
                <p className="text-lg font-medium">
                  {itemData.institution_name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Tipo de Institución
                </label>
                <p className="text-lg font-medium capitalize">
                  {itemData.institution_type}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información de Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="font-medium">{itemData.contact_email}</p>
                  </div>
                </div>

                {itemData.contact_phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Teléfono
                      </p>
                      <p className="font-medium">{itemData.contact_phone}</p>
                    </div>
                  </div>
                )}

                {itemData.contact_person && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Persona de Contacto
                      </p>
                      <p className="font-medium">{itemData.contact_person}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Fechas Importantes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </p>
                  <p className="font-medium">
                    {formatDate(itemData.created_at)}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Última Actualización
                  </p>
                  <p className="font-medium">
                    {formatDate(itemData.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {itemData.institution && (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Detallada de la Institución
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Estado de Validación
                  </p>
                  {getStatusBadge(itemData.institution.validation_status)}
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Estado General
                  </p>
                  <Badge
                    variant={
                      itemData.institution.status === 'ACTIVE'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {itemData.institution.status || 'N/A'}
                  </Badge>
                </div>
              </div>

              {itemData.institution.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {itemData.institution.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  Contacto Institucional
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email Institucional
                      </p>
                      <p className="font-medium">
                        {itemData.institution.institution_email}
                      </p>
                    </div>
                  </div>

                  {itemData.institution.contact_phone && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Teléfono
                        </p>
                        <p className="font-medium">
                          {itemData.institution.contact_phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {itemData.institution.address && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dirección
                        </p>
                        <p className="font-medium">
                          {itemData.institution.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(itemData.institution.document_number ||
                itemData.institution.acronym ||
                itemData.institution.brand) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Información Adicional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itemData.institution.document_number && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">
                            Número de Documento
                          </p>
                          <p className="font-medium">
                            {itemData.institution.document_number}
                          </p>
                        </div>
                      )}
                      {itemData.institution.acronym && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">
                            Acrónimo
                          </p>
                          <p className="font-medium">
                            {itemData.institution.acronym}
                          </p>
                        </div>
                      )}
                      {itemData.institution.brand && (
                        <div className="p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Marca
                          </p>
                          <p className="font-medium">
                            {itemData.institution.brand}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {(itemData.institution.cover_image_url ||
                itemData.institution.map_iframe_url) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Enlaces y Recursos
                    </h3>
                    <div className="space-y-3">
                      {itemData.institution.cover_image_url && (
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Imagen de Portada
                            </p>
                            <a
                              href={itemData.institution.cover_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Ver imagen de portada →
                            </a>
                          </div>
                        </div>
                      )}
                      {itemData.institution.map_iframe_url && (
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <Globe className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Ubicación
                            </p>
                            <a
                              href={itemData.institution.map_iframe_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Ver ubicación en mapa →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
