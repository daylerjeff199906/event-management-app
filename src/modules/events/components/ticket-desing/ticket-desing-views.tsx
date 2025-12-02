import React from 'react'
import { EventTicketform, EventMapZone } from '@/modules/events/schemas'
import { GRID_SIZE, mapZoneToCanvasItem } from '../../data/types'

interface EventMapViewerProps {
  tickets: EventTicketform[]
  zones: EventMapZone[]
  width?: string | number
  height?: string | number
}

export const EventMapViewer: React.FC<EventMapViewerProps> = ({
  tickets,
  zones,
  width = '100%',
  height = '600px'
}) => {
  // Convertir a items visuales
  const rawItems = zones.map((z) => mapZoneToCanvasItem(z, tickets))

  // Recalcular capacidades visuales (igual que en el designer)
  const counts: Record<string, number> = {}
  rawItems.forEach((item) => {
    if (item.type === 'TICKET_ZONE' && item.ticketId) {
      counts[item.ticketId] = (counts[item.ticketId] || 0) + 1
    }
  })

  const visualItems = rawItems.map((item) => {
    if (item.type === 'TICKET_ZONE' && item.ticketId) {
      const ticket = tickets.find((t) => t.id === item.ticketId)
      if (ticket && counts[item.ticketId] > 0) {
        return {
          ...item,
          capacity: Math.floor(ticket.quantity_total / counts[item.ticketId]),
          name: ticket.name,
          color: item.color || '#3b82f6'
        }
      }
    }
    return item
  })

  return (
    <div
      className="relative bg-[#e5e5e5] overflow-hidden select-none rounded-lg border border-gray-200"
      style={{ width, height }}
    >
      {/* Fondo cuadriculado */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
      />

      <div className="relative w-full h-full">
        {visualItems.map((item) => {
          const isVertical = item.height > item.width
          return (
            <div
              key={item.id}
              className="absolute shadow-lg"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                backgroundColor: item.type === 'STAGE' ? '#000000' : item.color
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
                {item.type === 'STAGE' ? (
                  <>
                    <div className="absolute top-0 w-1/3 h-2 bg-gray-800"></div>
                    <h3 className="text-white font-black text-xl tracking-[0.2em] z-10 text-center leading-none">
                      ESCENARIO
                    </h3>
                    <div className="w-full h-1 bg-gray-800 mt-2"></div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        transform: isVertical ? 'rotate(-90deg)' : 'none',
                        width: isVertical ? item.height - 10 : '100%',
                        maxWidth: isVertical ? item.height : item.width
                      }}
                    >
                      <h3
                        className={`text-white font-black tracking-wide text-center uppercase drop-shadow-md leading-none wrap-break-words ${
                          isVertical ? 'text-sm' : 'text-xl'
                        }`}
                      >
                        {item.name}
                      </h3>
                    </div>
                    {/* Tooltip o Badge opcional en el Viewer */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                      <div className="bg-black/20 px-2 py-0.5 rounded text-white text-[9px] font-mono font-bold tracking-widest backdrop-blur-sm">
                        CAP: {item.capacity}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
