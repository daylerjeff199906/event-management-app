import { Footer } from '@/components/app/panel-admin/footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
