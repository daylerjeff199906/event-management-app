'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Mail,
  Phone,
  User,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { RegistrationRequestList } from '@/types'
import { createInstitutionAccount } from '@/services/accounts.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

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

  const handleApprove = async (request: RegistrationRequestList) => {
    setIsProcessing(true)
    try {
      // console.log('Aprobando solicitud:', request.id)
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      // alert('Solicitud aprobada exitosamente')
      const result = await createInstitutionAccount({
        email: request.contact_email,
        firstName: request.contact_person || 'Usuario',
        lastName: '',
        institutionId: request.institution_uuid || '',
        registrationRequestId: request.id
      })

      if (result.success) {
        toast.success(
          <ToastCustom
            title="Solicitud Aprobada"
            description="La cuenta ha sido creada y las credenciales enviadas al correo."
          />
        )
        router.back()
      } else {
        toast.error(
          <ToastCustom
            title="Error"
            description={result.message || 'No se pudo aprobar la solicitud.'}
          />
        )
      }
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
        </div>
      </div>

      <div className="space-y-8">
        <Card className="shadow-none border border-border bg-white">
          <CardHeader className="py-0">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <FileText className="h-5 w-5 text-foreground/70" />
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  Nombre de Institución
                </label>
                <p className="text-base font-medium text-foreground">
                  {itemData.institution_name}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  Tipo de Institución
                </label>
                <p className="text-base font-medium text-foreground capitalize">
                  {itemData.institution_type}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  Correo Institucional
                </label>
                <p className="text-base font-medium text-foreground">
                  {itemData.institution?.institution_email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  Teléfono Institucional
                </label>
                <p className="text-base font-medium text-foreground">
                  {itemData.institution?.contact_phone || 'N/A'}
                </p>
              </div>
            </div>

            {itemData?.institution?.description && (
              <>
                <div className="h-px bg-border"></div>
                <div className="space-y-2">
                  <h3 className="text-lg text-foreground">¿A qué se dedica?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {itemData.institution.description}
                  </p>
                </div>
              </>
            )}
            <div className="h-px bg-border"></div>

            <div className="space-y-6">
              <h3 className="text-lg text-foreground">
                Información de Contacto
              </h3>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <Mail className="h-4 w-4 text-foreground/50 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-medium text-foreground">
                      {itemData.contact_email}
                    </p>
                  </div>
                </div>

                {itemData.contact_phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="h-4 w-4 text-foreground/50 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                        Teléfono
                      </p>
                      <p className="font-medium text-foreground">
                        {itemData.contact_phone}
                      </p>
                    </div>
                  </div>
                )}

                {itemData.contact_person && (
                  <div className="flex items-center gap-4">
                    <User className="h-4 w-4 text-foreground/50 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                        Persona de Contacto
                      </p>
                      <p className="font-medium text-foreground">
                        {itemData.contact_person}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-border"></div>
            <div className="space-y-2">
              <h3 className="text-lg text-foreground">
                Estado de la Solicitud
              </h3>
              {getStatusBadge(itemData.request_status)}
            </div>
          </CardContent>
        </Card>

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
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>
                    Se creará un usuario con el correo {itemData.contact_email}{' '}
                    como <strong>owner</strong> y se le enviarán todas las
                    indicaciones al correo proporcionado.
                  </li>
                  <li>
                    La institución será asignada a este usuario y podrá ingresar
                    desde su apartado. Si la persona ya tiene cuenta, se le
                    asignará esta institución y la institución quedará activa.
                  </li>
                </ul>

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
      </div>
    </div>
  )
}
