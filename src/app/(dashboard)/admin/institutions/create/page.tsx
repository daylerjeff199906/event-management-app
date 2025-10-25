import { APP_URL } from '@/data/config-app-url'
import { InstitutionSettings } from '@/modules/admin'

export default async function Page() {
  return (
    <>
      <InstitutionSettings urlRedirect={APP_URL.ADMIN.INSTITUTIONS.BASE} />
    </>
  )
}
