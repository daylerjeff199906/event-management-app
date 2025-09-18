import {
  ScrollVelocityContainer,
  ScrollVelocityRow
} from '@/components/ui/scroll-based-velocity'

interface ScrollMensageSectionProps {
  messsage1?: string
  messsage2?: string
}

export const ScrollMensageSection = ({
  messsage1 = 'Welcome to Eventify',
  messsage2 = 'Your Gateway to Exciting Events'
}: ScrollMensageSectionProps) => {
  return (
    <div className="w-full bg-gray-100 py-12 md:py-20 overflow-hidden">
      <ScrollVelocityContainer className="text-4xl md:text-7xl font-bold">
        <ScrollVelocityRow baseVelocity={20} direction={1}>
          {messsage1}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={20} direction={-1}>
          {messsage2}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  )
}
