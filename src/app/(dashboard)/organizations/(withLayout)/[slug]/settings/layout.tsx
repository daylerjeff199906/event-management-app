interface IProps {
  children: React.ReactNode
}

export default function Layout(props: IProps) {
  const { children } = props

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Configuración de la organización
        </h1>
        {children}
      </div>
    </div>
  )
}
