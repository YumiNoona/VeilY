-- ==========================================
-- VEILY: COMPLETE DATABASE SCHEMA & POLICIES
-- ==========================================

-- ==========================================
-- 1. USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free',
    downloads_used INT DEFAULT 0,
    videos_used INT DEFAULT 0,
    ai_fills_used INT DEFAULT 0,
    last_ai_fill_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. WEBHOOK EVENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. CLEAN OLD POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.webhook_events;

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;

-- ==========================================
-- 5. USERS POLICIES (STRICT)
-- ==========================================

-- SELECT
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- INSERT
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ==========================================
-- 6. WEBHOOK EVENTS POLICIES (SERVICE ONLY)
-- ==========================================

CREATE POLICY "Service role full access"
ON public.webhook_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ==========================================
-- 7. STORAGE SETUP & POLICIES (Avatars)
-- ==========================================

-- Create the storage bucket if it doesn't exist (Has to be done via UI/API usually but good for reference)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- PUBLIC READ
CREATE POLICY "Public read avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- INSERT (ownership + 2MB size limit)
CREATE POLICY "Authenticated Upload"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (metadata->>'size')::int <= 2097152
);

-- UPDATE (own files only)
CREATE POLICY "Authenticated Update"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE (own files only)
CREATE POLICY "Users delete own avatar"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==========================================
-- 8. ATOMIC + SAFE AI USAGE RPC FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION increment_ai_fills(target_user_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count int;
    today_date date := CURRENT_DATE;
BEGIN
    -- SECURITY: ensure user can only update their own row
    IF auth.uid() IS NULL OR auth.uid() <> target_user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- ATOMIC UPDATE WITH DAILY RESET
    UPDATE public.users
    SET 
        ai_fills_used = CASE
            WHEN last_ai_fill_date <> today_date THEN 1
            ELSE ai_fills_used + 1
        END,
        last_ai_fill_date = today_date
    WHERE id = target_user_id
    RETURNING ai_fills_used INTO new_count;

    RETURN new_count;
END;
$$;

-- ==========================================
-- 9. GRANT EXECUTION (REQUIRED)
-- ==========================================

GRANT EXECUTE ON FUNCTION increment_ai_fills(uuid) TO authenticated;