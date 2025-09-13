import { BG_CTA_EVENTS } from '@/assets/images'
import {
  BannerCarousel,
  CategoryGrid,
  EventsCTA,
  EventsSection
} from '@/modules/portal/pages'

export default function Page() {
  return (
    <>
      <BannerCarousel className="mx-auto max-w-7xl rounded-2xl lg:pt-8" />
      <EventsSection />
      <CategoryGrid className="py-12 md::py-16 lg:py-24" />
      <EventsCTA urlImageBackground={BG_CTA_EVENTS.src} />
      {/* <HeroSection /> */}
    </>
  )
}
