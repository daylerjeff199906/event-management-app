interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        Solicitudes de aprobación
      </h1>
      {children}
    </div>
  )
}
