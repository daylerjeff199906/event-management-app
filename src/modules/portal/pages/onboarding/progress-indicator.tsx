import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitles
}: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent &&
                      'bg-accent text-accent-foreground ring-4 ring-accent/20',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-20',
                    isCompleted && 'text-primary',
                    !isCompleted && !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {stepTitles[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-all duration-300',
                    stepNumber < currentStep ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
