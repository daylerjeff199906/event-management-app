import { BG_CTA_EVENTS } from '@/assets/images'
import {
  BannerCarousel,
  CategoryGrid,
  EventsCTA,
  EventsSection,
  ScrollMensageSection
} from '@/modules/portal/pages'

export default function Page() {
  return (
    <>
      <BannerCarousel className="mx-auto max-w-7xl rounded-2xl lg:pt-8 p-4 lg:px-0" />
      <EventsSection />
      <EventsCTA urlImageBackground={BG_CTA_EVENTS.src} />
      <CategoryGrid className="py-12 md::py-16 lg:py-24" />
      <ScrollMensageSection
        message1="Tu Puerta a Eventos Emocionantes"
        message2="Bienvenido a VamoYa"
      />
      {/* <HeroSection /> */}
    </>
  )
}
