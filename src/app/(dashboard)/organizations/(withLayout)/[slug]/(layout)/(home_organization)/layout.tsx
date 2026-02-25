import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getInstitutionById } from '@/services/institution.services'
import { Params } from '@/types'
import { LayoutWrapper } from '@/components/layout-wrapper'

interface LayoutProps {
  children: React.ReactNode
  params: Params
}

export default async function Layout(props: LayoutProps) {
  const { children } = props
  const params = await props.params
  const uuid = await params.slug
  const InstitutionData = await getInstitutionById(uuid as string)

  return (
    <LayoutWrapper sectionTitle={InstitutionData.data?.institution_name || 'Organización'}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col mb-6 gap-2">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            {InstitutionData.data?.institution_name}
            <Badge
              className={cn(
                'ml-4 rounded-full',
                InstitutionData.data?.status?.toUpperCase() === 'ACTIVE'
                  ? 'bg-emerald-500 text-emerald-100'
                  : 'bg-yellow-500 text-yellow-100 '
              )}
            >
              {InstitutionData.data?.status ? 'Activa' : 'Inactiva'}
            </Badge>
          </h1>
        </div>
        <hr className="mb-4 border border-gray-200" />
      </div>
      {children}
    </LayoutWrapper>
  )
}
