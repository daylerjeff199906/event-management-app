# Migración de Base de Datos - Refactorización Completa

## Resumen de Cambios

### 1. Tabla `users` → `profiles`
- La tabla `users` fue renombrada a `profiles`
- Se mantuvieron todos los datos existentes
- Nuevos campos agregados:
  - `account_type`: 'basic' | 'premium' | 'institution'
  - `global_role`: 'user' | 'admin' | 'super_admin'
  - `onboarding_completed`: boolean
  - `onboarding_completed_at`: timestamp

### 2. Sistema de Roles
- **Roles globales** (en profiles):
  - `user`: Usuario normal
  - `admin`: Administrador
  - `super_admin`: Super administrador

- **Roles por institución** (en user_roles):
  - `member`: Miembro
  - `editor`: Editor
  - `admin`: Administrador de institución
  - `owner`: Propietario

### 3. Suscripciones y Límites de Eventos
- Nueva tabla `user_subscriptions`
- Por defecto: usuarios básicos tienen límite de **3 eventos**
- Instituciones: **sin límite**
- Verificación automática antes de crear eventos

### 4. Funciones RPC Disponibles

```sql
-- Verificar si el onboarding está completado
SELECT public.check_onboarding_completed('uuid-usuario');

-- Completar onboarding
SELECT public.complete_onboarding('uuid-usuario');

-- Verificar límite de eventos
SELECT public.check_event_limit('uuid-usuario');
-- Retorna: { allowed: boolean, limit: number, current: number, reason: string }

-- Obtener rol en institución
SELECT public.get_user_institution_role('uuid-usuario', 'uuid-institucion');

-- Obtener todas las instituciones del usuario
SELECT public.get_user_institutions('uuid-usuario');
```

## Pasos de Migración

### 1. Ejecutar la migración
```bash
# En Supabase SQL Editor
\i supabase/migrations/20260224_refactor_users_to_profiles.sql
```

### 2. Verificar datos
```sql
-- Verificar que los perfiles se crearon correctamente
SELECT * FROM profiles LIMIT 10;

-- Verificar suscripciones
SELECT * FROM user_subscriptions;

-- Verificar roles existentes
SELECT * FROM user_roles;
```

### 3. Testing de funciones RPC
```sql
-- Probar verificación de onboarding
SELECT public.check_onboarding_completed('tu-usuario-id');

-- Probar límite de eventos
SELECT public.check_event_limit('tu-usuario-id');
```

### 4. Desplegar aplicación
Después de ejecutar la migración, despliega tu aplicación.

## Notas Importantes

1. **La tabla `users` original se conserva** por seguridad. Puedes eliminarla después de verificar que todo funciona.

2. **Triggers automáticos**:
   - Al crear un nuevo usuario en auth.users, automáticamente se crea un perfil y suscripción
   - Al insertar/eliminar eventos, se actualiza el conteo automáticamente

3. **Verificación de onboarding**:
   - Ahora se hace desde el backend mediante la función RPC
   - El frontend usa `checkOnboardingCompleted()` del servicio

4. **Límite de eventos**:
   - Se verifica automáticamente antes de crear eventos
   - Retorna error si el usuario alcanzó su límite
