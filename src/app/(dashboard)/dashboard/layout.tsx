import AdminPanelLayout from '@/components/app/panel-admin/admin-panel-layout'

interface IProps {
  children: React.ReactNode
}

export default function Layout(props: IProps) {
  const { children } = props
  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
