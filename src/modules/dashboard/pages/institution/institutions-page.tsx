import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, Mail, Phone } from 'lucide-react'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'
import Link from 'next/link'
import { APP_URL } from '@/data/config-app-url'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

interface InstitutionPageProps {
  institutionsList: InstitutionForm[]
}

export default function InstitutionsPage({
  institutionsList
}: InstitutionPageProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {institutionsList.map((institution) => (
          <Link
            key={institution.id}
            href={APP_URL.ORGANIZATION.INSTITUTION.DETAIL(
              String(institution.id)
            )}
          >
            <Card className="shadow-none border border-border relative group hover:bg-accent/50 transition-colors hover:cursor-pointer bg-white">
              <CardContent className="p-3">
                <div className="flex items-start gap-4">
                  {/* Avatar cuando no hay brand/logo */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                      {institution.institution_name
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute right-4 top-4 p-1 rounded-full group-hover:bg-accent/50 transition-colors group-hover:scale-150 duration-200 ease-in-out ">
                    <ChevronRight className="h-4 w-4" />
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                      {institution.institution_name}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="text-xs rounded-full"
                      >
                        {institution.institution_type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs rounded-full ${getStatusColor(
                          institution.validation_status as
                            | 'pending'
                            | 'approved'
                            | 'rejected'
                        )}`}
                      >
                        {institution.validation_status === 'pending'
                          ? 'Pendiente'
                          : institution.validation_status === 'approved'
                          ? 'Aprobado'
                          : 'Rechazado'}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">
                          {institution.institution_email}
                        </span>
                      </div>
                      {institution.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{institution.contact_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Estado vacío si no hay instituciones */}
      {institutionsList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay instituciones registradas
          </p>
        </div>
      )}
    </>
  )
}
