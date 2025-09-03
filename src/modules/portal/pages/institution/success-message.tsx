'use client'

import { CheckCircle, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { InstitutionForm } from '../../lib/register.institution'

interface SuccessMessageProps {
  onStartOver: () => void
  dataInstitution?: InstitutionForm
}

export function SuccessMessage({
  onStartOver,
  dataInstitution
}: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-200 dark:text-green-100" />
        </div>
        <CardTitle className="text-xl text-green-700 dark:text-green-400 font-bold">
          ¡Solicitud Enviada!
        </CardTitle>
        <CardDescription className="text-balance">
          Tu solicitud de registro institucional ha sido recibida correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="border border-border rounded-md p-3 bg-secondary/50">
            <p className="font-medium text-foreground mb-2 text-xs">
              Datos de la Institución
            </p>
            <div className="flex flex-col gap-1">
              <span>
                <span className="font-semibold">Nombre: </span>
                {dataInstitution?.institution_name || (
                  <span className="text-muted-foreground ">
                    No especificado
                  </span>
                )}
              </span>
              <span>
                <span className="font-semibold">Tipo: </span>
                {dataInstitution?.institution_type || (
                  <span className="text-muted-foreground">No especificado</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium text-foreground">
                Confirmación por correo
              </p>
              <p>
                En las próximas horas recibirás un correo con la confirmación de
                tu solicitud.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-orange-500" />
            <div>
              <p className="font-medium text-foreground">Proceso de revisión</p>
              <p>
                Nuestro equipo revisará tu solicitud y te enviará las
                credenciales de acceso una vez aprobada.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={onStartOver}
            variant="outline"
            className="w-full bg-transparent"
          >
            Registrar Otra Institución
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
