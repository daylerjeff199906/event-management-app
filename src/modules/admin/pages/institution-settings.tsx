'use client'
import { InstitutionFormData } from '@/modules/admin'
import { InstitutionForm } from '@/modules/portal/lib/register.institution'

interface InstitutionSettingsProps {
  institutionData?: InstitutionForm
}

export const InstitutionSettings = (props: InstitutionSettingsProps) => {
  const { institutionData } = props
  return (
    <>
      <InstitutionFormData initialData={institutionData} onSubmit={() => {}} />
    </>
  )
}
