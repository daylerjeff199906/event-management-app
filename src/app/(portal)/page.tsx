import { BG_CTA_EVENTS } from '@/assets/images'
import { APP_URL } from '@/data/config-app-url'
import {
  BannerCarousel,
  CategoryGrid,
  EventsCTA,
  EventsSection,
  ScrollMensageSection
} from '@/modules/portal/pages'
import { fetchCategories } from '@/services/categories.services'
import { getSupabase } from '@/services/core.supabase'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()
  if (user && user.user) {
    // Si no hay usuario, redirigir a la página de login
    redirect(APP_URL.DASHBOARD.BASE)
  }

  const categories = await fetchCategories()

  return (
    <>
      <BannerCarousel className="mx-auto max-w-7xl rounded-2xl lg:pt-8 p-4 lg:px-0" />
      <EventsSection />
      <EventsCTA urlImageBackground={BG_CTA_EVENTS.src} />
      <CategoryGrid
        categories={categories || []}
        className="py-12 md::py-16 lg:py-24"
      />
      <ScrollMensageSection
        message1="Tu Puerta a Eventos Emocionantes"
        message2="Bienvenido a VamoYa"
      />
      {/* <HeroSection /> */}
    </>
  )
}
