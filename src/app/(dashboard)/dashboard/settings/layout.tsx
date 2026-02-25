import { LayoutWrapper } from '@/components/layout-wrapper'

interface IProps {
  children: React.ReactNode
}

export default function Layout({ children }: IProps) {
  return <LayoutWrapper sectionTitle="Ajustes">{children}</LayoutWrapper>
}
