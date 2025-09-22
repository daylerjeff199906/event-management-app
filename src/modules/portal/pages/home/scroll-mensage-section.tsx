import {
  ScrollVelocityContainer,
  ScrollVelocityRow
} from '@/components/ui/scroll-based-velocity'

interface ScrollMensageSectionProps {
  message1?: string
  message2?: string
}

export const ScrollMensageSection = ({
  message1 = 'Welcome to Eventify',
  message2 = 'Your Gateway to Exciting Events'
}: ScrollMensageSectionProps) => {
  return (
    <div className="w-full bg-gray-100 py-12 md:py-20 overflow-hidden">
      <ScrollVelocityContainer className="text-4xl md:text-7xl font-bold">
        <ScrollVelocityRow baseVelocity={20} direction={1}>
          {message1}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={20} direction={-1}>
          {message2}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  )
}
