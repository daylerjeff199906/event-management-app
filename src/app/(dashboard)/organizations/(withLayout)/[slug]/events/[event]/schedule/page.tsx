'use client'

import { useEffect, useState, useCallback } from 'react'
import { CustomScheduler } from '@/modules/events/components/custom-scheduler'
import {
  fetchAllEventActivities,
  createEventActivity,
  updateEventActivity,
  deleteEventActivity
} from '@/services/events.activities.service'
import { EventActivity } from '@/types'
import { EventActivityForm } from '@/modules/events/schemas'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export default function SchedulerPage({
  params
}: {
  params: { event: string }
}) {
  const [activities, setActivities] = useState<EventActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      const { data, error } = await fetchAllEventActivities({
        event_id: params.event
      })
      if (error) throw error
      if (data) setActivities(data)
    } catch {
      toast.error('Error cargando actividades')
    } finally {
      setLoading(false)
    }
  }, [params.event])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handlers para el Scheduler
  const handleCreate = async (formData: EventActivityForm) => {
    const { error } = await createEventActivity(formData)
    if (error) {
      toast.error('Error al crear')
      return
    }
    toast.success('Actividad creada')
    await loadData() // Refrescar
  }

  const handleUpdate = async (
    id: string,
    formData: Partial<EventActivityForm>
  ) => {
    // Optimistic UI (opcional): Actualizar estado local antes
    const { error } = await updateEventActivity(id, formData)
    if (error) {
      toast.error('Error al actualizar')
      return
    }
    // toast.success("Actividad actualizada") // Puede ser molesto en drag&drop
    await loadData()
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteEventActivity(id)
    if (error) {
      toast.error('Error al eliminar')
      return
    }
    toast.success('Eliminado')
    await loadData()
  }

  if (loading)
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cronograma</h1>
          <p className="text-muted-foreground">
            Arrastra y suelta para organizar las actividades.
          </p>
        </div>
      </div>

      <CustomScheduler
        eventId={params.event}
        activities={activities}
        onCreateEvent={handleCreate}
        onUpdateEvent={handleUpdate}
        onDeleteEvent={handleDelete}
      />
    </div>
  )
}
