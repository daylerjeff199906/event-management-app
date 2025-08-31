import { BannerCarousel, CategoryGrid } from '@/modules/portal/pages'

export default function Page() {
  return (
    <>
      <BannerCarousel className="container mx-auto pt-6" />
      <CategoryGrid className="py-12 md::py-16 lg:py-24" />
      {/* <HeroSection /> */}
    </>
  )
}
