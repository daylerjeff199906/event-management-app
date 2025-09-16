'use client'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Eye } from 'lucide-react'
import type { RegistrationRequest } from '@/types'

interface RegistrationRequestsTableProps {
  requests: RegistrationRequest[]
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

const getInstitutionTypeBadge = (type: string) => {
  const typeMap: Record<string, string> = {
    empresa: 'Empresa',
    ong: 'ONG',
    gobierno: 'Gobierno',
    educacion: 'Educación'
  }

  return (
    <Badge variant="secondary" className="text-xs">
      {typeMap[type] || type}
    </Badge>
  )
}

export function RegistrationRequestsTable({
  requests
}: RegistrationRequestsTableProps) {
  const router = useRouter()

  const handleViewDetails = (request: RegistrationRequest) => {
    router.push(`/solicitudes/${request.id}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Estado</TableHead>
              <TableHead className="font-medium">Institución</TableHead>
              <TableHead className="font-medium hidden md:table-cell">
                Tipo
              </TableHead>
              <TableHead className="font-medium hidden lg:table-cell">
                Contacto
              </TableHead>
              <TableHead className="font-medium hidden sm:table-cell">
                Fecha
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron solicitudes
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} className="hover:bg-muted/50">
                  <TableCell>
                    {getStatusBadge(request.request_status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {request.institution_name}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {request.contact_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getInstitutionTypeBadge(request.institution_type)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <p className="text-sm">
                        {request.contact_person || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.contact_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm">
                      {request.created_at
                        ? new Date(request.created_at).toLocaleDateString(
                            'es-ES'
                          )
                        : 'N/A'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(request)}
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Información de resultados */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <p>
          Mostrando {requests.length} de {requests.length} solicitudes
        </p>
      </div>
    </>
  )
}
