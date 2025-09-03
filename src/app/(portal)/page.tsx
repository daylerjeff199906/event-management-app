import { BannerCarousel, CategoryGrid, EventsCTA } from '@/modules/portal/pages'

export default function Page() {
  return (
    <>
      <BannerCarousel className="container mx-auto" />
      <CategoryGrid className="py-12 md::py-16 lg:py-24" />
      <EventsCTA />
      {/* <HeroSection /> */}
    </>
  )
}
