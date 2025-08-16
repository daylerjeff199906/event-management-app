'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbCustomProps {
  hiddenContainer?: boolean
}

export const BreadcrumbCustom = (props: BreadcrumbCustomProps) => {
  const { hiddenContainer } = props
  const pathname = usePathname()

  const generatePaths = (pathname: string) => {
    const paths = pathname.split('/').filter((path) => path !== '')

    const breadcrumbPaths = paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      let pathReplace = index === 0 ? 'Inicio' : path.replace(/-/g, ' ')

      // Si el path es solo números, reemplazar por "Detalles"
      if (/^\d+$/.test(path)) {
        pathReplace = 'Detalles'
      }

      return (
        <div
          key={path}
          className=" items-center gap-1 hidden md:flex"
        >
          <BreadcrumbItem>
            {index < paths.length - 1 ? (
              <BreadcrumbLink
                className="capitalize text-xs"
                asChild
              >
                <Link href={href}>{pathReplace}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="capitalize text-xs">
                {pathReplace}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {index < paths.length - 1 && <BreadcrumbSeparator />}
        </div>
      )
    })

    return breadcrumbPaths
  }

  return (
    <div className={`w-full ${!hiddenContainer && 'container'}`}>
      <Breadcrumb>
        <BreadcrumbList>{generatePaths(pathname)}</BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
