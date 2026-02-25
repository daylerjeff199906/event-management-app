import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({
  currentStep,
  totalSteps
}: ProgressIndicatorProps) {
  // We add +1 to totalSteps if we want to show the completion step (Eden shows 4 steps)
  const displaySteps = totalSteps + 1

  return (
    <div className="w-full max-w-xs mx-auto mb-16 px-4">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0" />

        {/* Active Line Progress */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-500 ease-in-out z-0"
          style={{ width: `${((currentStep - 1) / (displaySteps - 1)) * 100}%` }}
        />

        {Array.from({ length: displaySteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber <= currentStep

          return (
            <div key={stepNumber} className="relative z-10">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 shadow-sm border',
                  isActive
                    ? 'bg-primary border-primary text-white scale-110'
                    : 'bg-white border-slate-200 text-slate-400'
                )}
              >
                {stepNumber}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
