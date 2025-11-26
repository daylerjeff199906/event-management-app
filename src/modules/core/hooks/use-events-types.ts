import { useEffect, useState } from "react";
import { fetchEventTypes } from "@/services/events.services";
import { EventType } from "@/types";

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
    async function loadEventTypes() {
      setLoading(true);
        try {
        const response = await fetchEventTypes();
        if (response.error) {   
            setError(response.error);
            setEventTypes([]);
        } else if (response.data) {
            setEventTypes(response.data);
            setError(null);
        }
        } catch (err) {
        setError(err as Error);
        setEventTypes([]);
        } finally {
        setLoading(false);
        }
    }
    loadEventTypes();
  }
    , []);
    return { eventTypes, loading, error };
}

