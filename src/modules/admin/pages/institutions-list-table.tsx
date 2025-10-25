'use client'
// import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Eye, Edit, Settings } from 'lucide-react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
// import { APP_URL } from '@/data/config-app-url'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { APP_URL } from '@/data/config-app-url'

interface RegistrationRequestsTableProps {
  institutions: InstitutionForm[]
}

const getStatusBadge = (status?: string) => {
  // type BadgeVariant = React.ComponentProps<typeof Badge>['variant']

  const statusConfig: Record<string, { label: string; className: string }> = {
    ACTIVE: {
      label: 'Activo',
      className:
        'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    },
    INACTIVE: {
      label: 'Inactivo',
      className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    }
  }

  const config =
    status && statusConfig[status.toUpperCase()]
      ? statusConfig[status.toUpperCase()]
      : { label: 'N/A', className: 'bg-gray-50 text-gray-700 border-gray-200' }

  return (
    <Badge className={cn('rounded-full', config.className)}>
      {config.label}
    </Badge>
  )
}

export function InstitutionsListTable({
  institutions
}: RegistrationRequestsTableProps) {
  // const router = useRouter()

  //   const handleViewDetails = (request: RegistrationRequest) => {
  //     router.push(APP_URL.ADMIN.REQUESTS_APPROVAL.DETAILS(request.id))
  //   }

  //   const handleStatusChange = (institutionId, newStatus) => {
  //     // Lógica para cambiar estado
  //     console.log('Cambiar estado:', institutionId, newStatus)
  //   }

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
                F. Creación
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron instituciones
                </TableCell>
              </TableRow>
            ) : (
              institutions.map((institution) => (
                <TableRow key={institution.id} className="hover:bg-muted/50">
                  <TableCell>{getStatusBadge(institution.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {institution.institution_name}
                      </p>
                      {institution.acronym && (
                        <p className="text-xs text-muted-foreground">
                          {institution.acronym}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground md:hidden">
                        {institution.institution_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="rounded-full">
                      {institution.institution_type || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <p className="text-sm">{institution.institution_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {institution.contact_phone || 'N/A'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm">
                      {institution.created_at
                        ? new Date(institution.created_at).toLocaleDateString(
                            'es-ES'
                          )
                        : 'N/A'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* <Button
                        variant="outline"
                        onClick={() => handleViewDetails(institution)}
                        size="icon"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="outline"
                        size="icon"
                        title="Editar"
                        asChild
                      >
                        <Link
                          href={APP_URL.ADMIN.INSTITUTIONS.EDIT(
                            String(institution.id)
                          )}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Cambiar estado"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(institution.id, 'active')
                            }
                            className={
                              institution.status === 'active' ? 'bg-muted' : ''
                            }
                          >
                            Activo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(institution.id, 'inactive')
                            }
                            className={
                              institution.status === 'inactive'
                                ? 'bg-muted'
                                : ''
                            }
                          >
                            Inactivo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(institution.id, 'suspended')
                            }
                            className={
                              institution.status === 'suspended'
                                ? 'bg-muted'
                                : ''
                            }
                          >
                            Suspendido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Información de resultados */}
      {/* <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <p>
          Mostrando {requests.length} de {requests.length} solicitudes
        </p>
      </div> */}
    </>
  )
}
