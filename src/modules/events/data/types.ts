import { EventMapZone, EventTicketform } from "@/modules/events/schemas"; // Asume esta ruta según tu proyecto

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
}

// --- Tipos de la UI (Frontend) ---
export interface CanvasItem {
  id: string; // ID temporal o de BD
  dbId?: string; // ID real de la base de datos (si existe)
  type: 'STAGE' | 'TICKET_ZONE' | 'OBJECT';
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Propiedades específicas de zonas de tickets
  ticketId?: string; 
  name?: string;     // Nombre del ticket (para visualización)
  color?: string;    // Color (para visualización)
  price?: number;    // Precio (para visualización)
  capacity?: number; // Aforo asignado a esta zona específica
  
  // Metadatos para control de cambios
  isDeleted?: boolean;
  isNew?: boolean;
  isDirty?: boolean; // Si ha cambiado posición/tamaño
}

// --- Mappers (Adaptadores) ---

/**
 * Convierte un registro de BD (EventMapZone) a un objeto utilizable por el Canvas
 */
export const mapZoneToCanvasItem = (
  zone: EventMapZone, 
  tickets: EventTicketform[]
): CanvasItem => {
  const geometry = zone.geometry_data;
  
  // Buscar información del ticket asociado si existe
  const ticket = zone.ticket_id 
    ? tickets.find(t => t.id === zone.ticket_id) 
    : undefined;

  // Calcular capacidad basada en la lógica de negocio o guardada
  // NOTA: Tu esquema de Zone no tiene 'capacity' explícito fuera de geometry,
  // asumiremos que la capacidad de la zona se calcula o se guarda en geometry si fuera necesario.
  // Por ahora mostramos la total del ticket como referencia o un cálculo simple.
  
  return {
    id: zone.id || generateId(), // Usa el ID de la BD
    dbId: zone.id,
    type: zone.element_type as 'STAGE' | 'TICKET_ZONE' | 'OBJECT',
    x: geometry.x,
    y: geometry.y,
    width: geometry.width,
    height: geometry.height,
    ticketId: zone.ticket_id || undefined,
    name: zone.label || ticket?.name || 'Sin Nombre',
    color: geometry.color || '#9ca3af',
    price: ticket?.price || 0,
    capacity: 0, // En un caso real, deberías guardar la capacidad específica por zona en la BD
    isDirty: false,
    isNew: false
  };
};

/**
 * Convierte un objeto del Canvas al formato de la BD para guardar
 */
export const mapCanvasItemToZonePayload = (
  item: CanvasItem, 
  mapId: string
): Partial<EventMapZone> => {
  return {
    id: item.dbId, // Si existe, es update. Si no, upsert lo manejará o se crea nuevo
    map_id: mapId,
    ticket_id: item.ticketId || null,
    element_type: item.type as 'STAGE' | 'SEATING_AREA' | 'OBJECT',
    label: item.name,
    geometry_data: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      rotation: 0,
      shape: 'rect', // Por defecto
      color: item.color
    }
  };
};

// Constantes de diseño
export const GRID_SIZE = 20;
export const PRESET_COLORS = [
  '#f59e0b', '#ec4899', '#14b8a6', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6'
];

export const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;