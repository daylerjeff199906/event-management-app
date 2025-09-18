interface ToastProps {
  title: string
  description: string
  variant?: string
  icon?: React.ReactNode
}

export const ToastCustom = (props: ToastProps) => {
  const { title, description } = props

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm font-medium text-gray-200 flex flex-col">
        <h2 className="font-semibold text-sm">{title}</h2>
        <p className="text-xs text-gray-300">{description}</p>
      </div>
    </div>
  )
}
