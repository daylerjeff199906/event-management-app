-- =============================================================================
-- REFACTORIZACIÓN COMPLETA DE BASE DE DATOS
-- Event Management App - Supabase
-- =============================================================================

-- =============================================================================
-- 1. CREAR ENUMS Y TIPOS
-- =============================================================================

-- Enum para tipos de cuenta
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('basic', 'premium', 'institution');
    END IF;
END $$;

-- Enum para roles globales
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'global_role') THEN
        CREATE TYPE global_role AS ENUM ('user', 'admin', 'super_admin');
    END IF;
END $$;

-- Enum para roles por institución
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'institution_role') THEN
        CREATE TYPE institution_role AS ENUM ('member', 'editor', 'admin', 'owner');
    END IF;
END $$;

-- =============================================================================
-- 2. COPIAR DATOS DE users A profiles (SIN PÉRDIDA DE DATOS)
-- =============================================================================

-- Crear tabla profiles con estructura mejorada
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name text NOT NULL DEFAULT '',
    last_name text NOT NULL DEFAULT '',
    profile_image text,
    country text,
    birth_date date,
    phone text,
    email text,
    gender text,
    username text UNIQUE,
    account_type account_type DEFAULT 'basic'::account_type,
    global_role global_role DEFAULT 'user'::global_role,
    onboarding_completed boolean DEFAULT false,
    onboarding_completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Copiar datos existentes de users a profiles
INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    profile_image,
    country,
    birth_date,
    phone,
    email,
    gender,
    username,
    created_at,
    updated_at
)
SELECT 
    id,
    COALESCE(first_name, ''),
    COALESCE(last_name, ''),
    profile_image,
    country,
    birth_date,
    phone,
    email,
    gender,
    username,
    COALESCE(created_at, now()),
    COALESCE(updated_at, now())
FROM public.users
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. MODIFICAR user_roles PARA MEJOR GESTIÓN DE ROLES
-- =============================================================================

-- Agregar nueva columna role_type con el enum
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS role_type institution_role DEFAULT 'member'::institution_role;

-- Migrar datos existentes: mapear roles antiguos a nuevos
UPDATE public.user_roles 
SET role_type = 
    CASE 
        WHEN role = 'institution_owner' THEN 'owner'::institution_role
        WHEN role = 'editor' THEN 'editor'::institution_role
        WHEN role = 'member' THEN 'member'::institution_role
        ELSE 'member'::institution_role
    END
WHERE role_type IS NULL;

-- Eliminar columna role antigua (opcional, comentar si necesitas conservarla)
-- ALTER TABLE public.user_roles DROP COLUMN IF EXISTS role;

-- Agregar columna para manejar acceso de super admin
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS is_super_admin boolean DEFAULT false;

-- =============================================================================
-- 4. CREAR TABLA DE SUSCRIPCIONES (PARA LÍMITES DE EVENTOS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type text NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise')),
    max_events integer NOT NULL DEFAULT 3,
    events_created_count integer NOT NULL DEFAULT 0,
    events_limit_per_month integer,
    start_date timestamp with time zone NOT NULL DEFAULT now(),
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Crear suscripción para usuarios existentes (limite 3 eventos)
INSERT INTO public.user_subscriptions (user_id, plan_type, max_events, events_created_count)
SELECT id, 'free', 3, 0
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- 5. CREAR TABLA DE RELACIÓN users-institutions (MANY TO MANY MEJORADA)
-- =============================================================================

-- Ya existe user_roles, pero，我们可以 mejorarla con campos adicionales
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS invitation_token text,
ADD COLUMN IF NOT EXISTS invitation_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS invitation_status text DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'accepted', 'rejected', 'expired'));

-- =============================================================================
-- 6. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_institution ON public.user_roles(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_user ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_institution ON public.events(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- =============================================================================
-- 7. CREAR FUNCIONES RPC PARA LÓGICA DE NEGOCIO
-- =============================================================================

-- Función para verificar si el onboarding está completo
CREATE OR REPLACE FUNCTION public.check_onboarding_completed(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    completed boolean;
BEGIN
    SELECT onboarding_completed INTO completed
    FROM public.profiles
    WHERE id = p_user_id;
    
    RETURN COALESCE(completed, false);
END;
$$;

-- Función para marcar onboarding como completado
CREATE OR REPLACE FUNCTION public.complete_onboarding(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET 
        onboarding_completed = true,
        onboarding_completed_at = now(),
        updated_at = now()
    WHERE id = p_user_id;
    
    RETURN true;
END;
$$;

-- Función para verificar límite de eventos por usuario
CREATE OR REPLACE FUNCTION public.check_event_limit(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    subscription_record record;
    events_count integer;
    user_account_type account_type;
BEGIN
    -- Obtener tipo de cuenta del usuario
    SELECT account_type INTO user_account_type
    FROM public.profiles
    WHERE id = p_user_id;
    
    -- Si es institution, no tiene límite
    IF user_account_type = 'institution'::account_type THEN
        RETURN jsonb_build_object(
            'allowed', true,
            'limit', -1,
            'current', 0,
            'reason', 'Institución sin límite de eventos'
        );
    END IF;
    
    -- Obtener suscripción
    SELECT * INTO subscription_record
    FROM public.user_subscriptions
    WHERE user_id = p_user_id AND is_active = true;
    
    -- Contar eventos publicados del usuario
    SELECT COUNT(*) INTO events_count
    FROM public.events
    WHERE user_id = p_user_id AND status != 'DELETE'::event_status;
    
    -- Verificar límite
    IF subscription_record.max_events IS NULL OR subscription_record.max_events < 0 THEN
        -- Es institution o tiene límite ilimitado
        RETURN jsonb_build_object(
            'allowed', true,
            'limit', subscription_record.max_events,
            'current', events_count,
            'reason', 'Sin límite'
        );
    END IF;
    
    IF events_count >= subscription_record.max_events THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'limit', subscription_record.max_events,
            'current', events_count,
            'reason', 'Has alcanzado el límite de eventos permitidos. Actualiza tu plan para crear más.'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'limit', subscription_record.max_events,
        'current', events_count,
        'remaining', subscription_record.max_events - events_count,
        'reason', 'OK'
    );
END;
$$;

-- Función para obtener el rol del usuario en una institución
CREATE OR REPLACE FUNCTION public.get_user_institution_role(p_user_id uuid, p_institution_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    user_role record;
BEGIN
    SELECT * INTO user_role
    FROM public.user_roles
    WHERE user_id = p_user_id 
      AND institution_id = p_institution_id
      AND (access_enabled = true OR access_enabled IS NULL);
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'has_access', false,
            'role', null,
            'is_super_admin', false
        );
    END IF;
    
    RETURN jsonb_build_object(
        'has_access', true,
        'role', user_role.role_type::text,
        'is_super_admin', COALESCE(user_role.is_super_admin, false),
        'access_enabled', user_role.access_enabled
    );
END;
$$;

-- Función para obtener todas las instituciones de un usuario con sus roles
CREATE OR REPLACE FUNCTION public.get_user_institutions(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'institution_id', ur.institution_id,
                'role', ur.role_type::text,
                'is_super_admin', ur.is_super_admin,
                'access_enabled', ur.access_enabled,
                'institution', (
                    SELECT jsonb_build_object(
                        'id', i.id,
                        'name', i.institution_name,
                        'type', i.institution_type,
                        'slug', i.slug,
                        'logo_url', i.logo_url,
                        'status', i.status
                    )
                    FROM public.institutions i
                    WHERE i.id = ur.institution_id
                )
            )
        )
        FROM public.user_roles ur
        WHERE ur.user_id = p_user_id
          AND (ur.access_enabled = true OR ur.access_enabled IS NULL)
    );
END;
$$;

-- =============================================================================
-- 8. ACTUALIZAR POLÍTICAS RLS
-- =============================================================================

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Política: usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política: solo admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
              AND role_type IN ('admin'::institution_role, 'owner'::institution_role)
              AND is_super_admin = true
        )
    );

-- =============================================================================
-- 9. ACTUALIZAR TABLA events PARA MEJORAR RELACIÓN CON institutions
-- =============================================================================

-- La tabla events ya tiene institution_id y user_id
-- Agregar índice compuesto para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_events_user_status ON public.events(user_id, status);
CREATE INDEX IF NOT EXISTS idx_events_institution_status ON public.events(institution_id, status);

-- =============================================================================
-- 10. CREAR VIEW PARA PERFIL COMPLETO (CON INSTITUCIONES)
-- =============================================================================

CREATE OR REPLACE VIEW public.user_profile_with_institutions AS
SELECT 
    p.*,
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'institution_id', ur.institution_id,
                'role', ur.role_type::text,
                'institution_name', i.institution_name,
                'institution_slug', i.slug
            )
        )
        FROM public.user_roles ur
        JOIN public.institutions i ON i.id = ur.institution_id
        WHERE ur.user_id = p.id AND (ur.access_enabled = true OR ur.access_enabled IS NULL)
    ) as institutions,
    (
        SELECT jsonb_build_object(
            'plan_type', us.plan_type,
            'max_events', us.max_events,
            'events_created', us.events_created_count,
            'is_active', us.is_active
        )
        FROM public.user_subscriptions us
        WHERE us.user_id = p.id AND us.is_active = true
    ) as subscription
FROM public.profiles p;

-- =============================================================================
-- 11. FUNCIONES DE MIGRACIÓN ADICIONALES
-- =============================================================================

-- Función para migrar automáticamente el rol desde auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Crear perfil automáticamente
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (new.id, new.email, now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Crear suscripción gratuita
    INSERT INTO public.user_subscriptions (user_id, plan_type, max_events, events_created_count)
    VALUES (new.id, 'free', 3, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN new;
END;
$$;

-- Trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar conteo de eventos (trigger)
CREATE OR REPLACE FUNCTION public.update_events_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' AND new.status != 'DELETE'::event_status AND new.institution_id IS NULL THEN
        UPDATE public.user_subscriptions 
        SET events_created_count = events_created_count + 1
        WHERE user_id = new.user_id;
    END IF;
    
    IF TG_OP = 'DELETE' AND old.status != 'DELETE'::event_status AND old.institution_id IS NULL THEN
        UPDATE public.user_subscriptions 
        SET events_created_count = events_created_count - 1
        WHERE user_id = old.user_id;
    END IF;
    
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_events_count ON public.events;
CREATE TRIGGER trigger_update_events_count
    AFTER INSERT OR DELETE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_events_count();

-- =============================================================================
-- 12. ACTUALIZAR NOTIFICATIONS PARA USAR profiles
-- =============================================================================

-- La tabla notifications ya tiene user_id que referencia users
-- Actualizar FK para que reference profiles
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- =============================================================================
-- 13. ACTUALIZAR INTERESTS PARA USAR profiles
-- =============================================================================

ALTER TABLE public.interests 
DROP CONSTRAINT IF EXISTS interests_user_id_fkey;

ALTER TABLE public.interests 
ADD CONSTRAINT interests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- =============================================================================
-- 14. ACTUALIZAR USER_FAVORITES PARA USAR profiles
-- =============================================================================

ALTER TABLE public.user_favorites 
DROP CONSTRAINT IF EXISTS user_favorites_user_fkey;

ALTER TABLE public.user_favorites 
ADD CONSTRAINT user_favorites_user_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- =============================================================================
-- 15. ACTUALIZAR USER_ROLES PARA USAR profiles
-- =============================================================================

ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- =============================================================================
-- 16. LIMPIEZA FINAL
-- =============================================================================

-- Opcional: Eliminar tabla users antigua (después de verificar que todo funciona)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Mensaje de éxito
DO $$ 
BEGIN
    RAISE NOTICE 'Refactorización completada exitosamente!';
END $$;
