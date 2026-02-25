import { Button } from '@/components/ui/button'
import { APP_URL } from '@/data/config-app-url'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { LayoutWrapper } from '@/components/layout-wrapper'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <LayoutWrapper sectionTitle="Instituciones">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            Instituciones registradas
          </h1>
          <Button asChild>
            <Link
              href={APP_URL.ADMIN.INSTITUTIONS.ADD_INSTITUTION}
              className="no-underline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar nueva institución
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </LayoutWrapper>
  )
}
