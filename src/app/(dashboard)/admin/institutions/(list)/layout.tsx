interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        Instituciones registradas
      </h1>
      {children}
    </div>
  )
}
