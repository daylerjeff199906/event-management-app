interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <div>
      <div></div>
      {children}
    </div>
  )
}
