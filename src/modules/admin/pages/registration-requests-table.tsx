'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Search, Filter } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.institution_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || request.request_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (request: RegistrationRequest) => {
    router.push(`/solicitudes/${request.id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Solicitudes de Registro
        </CardTitle>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por institución, email o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Estado: {statusFilter === 'all' ? 'Todos' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pendiente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                Aprobada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                Rechazada
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
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
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron solicitudes
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          {request.request_status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                // onClick={() => onApprove(request)}
                                className="text-green-600"
                              >
                                Aprobar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                // onClick={() => onReject(request)}
                                className="text-red-600"
                              >
                                Rechazar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            Mostrando {filteredRequests.length} de {requests.length} solicitudes
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
