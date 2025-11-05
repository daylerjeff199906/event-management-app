import { APP_URL } from '@/data/config-app-url'
import { MetricCard, UsersTable } from '@/modules/admin'
import { getDashboardStats } from '@/services/admin.service'

export default async function Page() {
  const { data, error } = await getDashboardStats()

  console.log('Dashboard Stats:', data, 'Error:', error)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          value={data?.totalEvents.toString() || '0'}
          label="Total de eventos"
          sublabel="Eventos publicados"
          icon="PartyPopper"
          iconBg="bg-blue-500"
          href={'#'}
        />
        <MetricCard
          value={data?.totalUsers.toString() || '0'}
          label="Total de usuarios"
          sublabel="Usuarios registrados"
          icon="Users"
          iconBg="bg-green-500"
          href={APP_URL.ADMIN.USERS.BASE}
        />
        <MetricCard
          value={data?.totalActiveInstitutions.toString() || '0'}
          label="Instituciones activas"
          sublabel="Instituciones activas"
          icon="Building"
          iconBg="bg-yellow-500"
          href={APP_URL.ADMIN.INSTITUTIONS.BASE}
        />
        <MetricCard
          value={data?.totalRegistrationRequests.toString() || '0'}
          label="Solicitudes pendientes"
          sublabel="Solicitudes pendientes"
          icon="Files"
          iconBg="bg-red-500"
          href={APP_URL.ADMIN.REQUESTS_APPROVAL.BASE}
        />
      </div>
      <UsersTable users={data?.recentUsers || []} />
    </div>
  )
}
