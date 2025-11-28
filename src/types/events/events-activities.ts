export interface EventActivity {
    id: string;
    event_id: string;
    parent_activity_id?: string | null;
    activity_name: string;
    description?: string | null;
    start_time: string; // ISO timestamp (o Date)
    end_time: string;   // ISO timestamp (o Date)
    duration?: number | null;
    meeting_url?: string | null;
    custom_location?: string | null;
    activity_mode?: string | null; // enum en BD, ajustar si conoces los valores
    status?: string | null;        // enum en BD, por defecto 'DRAFT'
    order_index?: number | null;
    created_at?: string | null;    // ISO timestamp (o Date)
    updated_at?: string | null;    // ISO timestamp (o Date)
}
