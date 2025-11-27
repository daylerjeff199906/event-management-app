import { CategoriesPage } from '@/modules/admin'
import { fetchCategories } from '@/services/categories.services'

export default async function Page() {
  const categories = await fetchCategories()

  return <CategoriesPage categories={categories || []} />
}
