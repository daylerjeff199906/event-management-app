-- Migration to add support for multiple event images
CREATE TABLE IF NOT EXISTS public.event_images (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    is_main boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON public.event_images(event_id);

-- Ensure only one main image per event (optional but recommended)
-- One way is a partial unique index, but it's complex for "only one is true".
-- A trigger is better to handle the "setting a new main image" logic.

CREATE OR REPLACE FUNCTION public.handle_event_main_image()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If the new image is set as main, unset any other main images for this event
    IF NEW.is_main = true THEN
        UPDATE public.event_images
        SET is_main = false
        WHERE event_id = NEW.event_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_event_main_image
    BEFORE INSERT OR UPDATE OF is_main ON public.event_images
    FOR EACH ROW
    WHEN (NEW.is_main = true)
    EXECUTE FUNCTION public.handle_event_main_image();

-- Drop the deprecated cover_image_url field
ALTER TABLE public.events DROP COLUMN IF EXISTS cover_image_url;
