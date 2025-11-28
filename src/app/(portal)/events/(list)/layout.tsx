import { EventBannerCarousel } from '@/modules/portal/components'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <EventBannerCarousel banners={[]} />
      {children}
    </>
  )
}
