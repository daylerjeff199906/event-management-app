interface LoadingAbsoluteProps {
  show?: boolean
  blurAmount?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

export const LoadingAbsolute = ({
  show,
  blurAmount = 'xl',
  label = 'Loading...'
}: LoadingAbsoluteProps) => {
  if (!show) return null

  const blurClass = `backdrop-blur-${blurAmount}`

  return (
    <div
      className={`absolute flex items-center justify-center z-50 bg-orange-50 ${blurClass} top-0 bottom-0 right-0 left-0`}
      style={{
        position: 'fixed',
        top: -32,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-8 w-8 text-primary mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-primary font-bold text-lg animate-pulse">
          {label}
        </span>
      </div>
    </div>
  )
}
