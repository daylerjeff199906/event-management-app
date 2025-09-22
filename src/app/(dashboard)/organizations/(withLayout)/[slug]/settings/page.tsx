import { InstitutionSettings } from '@/modules/admin'
import { Params } from '@/types'
import { getInstitutionById } from '@/services/institution.services'

interface PageProps {
  params: Params
}

export default async function Page(props: PageProps) {
  const params = await props.params

  const institutionId = params?.slug?.toString() || null

  if (!institutionId) {
    return <div>No institution ID provided</div>
  }
  const { data: institutionData, error } = await getInstitutionById(
    institutionId
  )

  if (error) {
    return <div>Error loading institution data: {error}</div>
  }

  if (!institutionData) {
    return <div>No institution data found</div>
  }

  return (
    <>
      <InstitutionSettings institutionData={institutionData} />
    </>
  )
}
