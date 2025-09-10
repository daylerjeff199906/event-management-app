import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col mb-6 gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Eventos de la Institución
          </h1>
          <div>
            <Button>Crear nuevo evento</Button>
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar una institución" className="pl-10" />
          </div>
        </div>
      </div>
      {children}
    </>
  )
}
