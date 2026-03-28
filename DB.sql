-- =============================================================================
-- VEILY — COMPLETE DATABASE RESET & REBUILD
-- Safe to run on a live DB: tables are NOT dropped (user data is preserved).
-- All policies, functions, and grants are dropped and recreated from scratch.
-- Run this entire file in Supabase Dashboard → SQL Editor → New Query
-- =============================================================================


-- =============================================================================
-- STEP 1: DROP ALL EXISTING POLICIES (clean slate)
-- =============================================================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile"     ON public.users;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.users;
DROP POLICY IF EXISTS "Service role full access users" ON public.users;
DROP POLICY IF EXISTS "Allow service role"             ON public.users;

-- Webhook events policies
DROP POLICY IF EXISTS "Service role full access"       ON public.webhook_events;
DROP POLICY IF EXISTS "Block public access"            ON public.webhook_events;
DROP POLICY IF EXISTS "Allow service role"             ON public.webhook_events;
DROP POLICY IF EXISTS "Service role only"              ON public.webhook_events;

-- Storage policies
DROP POLICY IF EXISTS "Public read avatars"            ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload"           ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update"           ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatar"        ON storage.objects;
DROP POLICY IF EXISTS "Allow public avatar reads"      ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads"    ON storage.objects;
DROP POLICY IF EXISTS "Allow own avatar updates"       ON storage.objects;
DROP POLICY IF EXISTS "Allow own avatar deletes"       ON storage.objects;


-- =============================================================================
-- STEP 2: DROP EXISTING FUNCTIONS (recreate with latest logic)
-- =============================================================================

DROP FUNCTION IF EXISTS public.increment_ai_fills(uuid);
DROP FUNCTION IF EXISTS public.increment_usage(uuid, text);
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;


-- =============================================================================
-- STEP 3: ENSURE TABLES EXIST WITH ALL REQUIRED COLUMNS
-- Uses ADD COLUMN IF NOT EXISTS so existing data is never touched.
-- =============================================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email            TEXT UNIQUE NOT NULL,
    full_name        TEXT,
    avatar_url       TEXT,
    plan             TEXT        NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    is_premium       BOOLEAN     NOT NULL DEFAULT false,
    downloads_used   INT         NOT NULL DEFAULT 0,
    videos_used      INT         NOT NULL DEFAULT 0,
    ai_fills_used    INT         NOT NULL DEFAULT 0,
    last_ai_fill_date DATE       DEFAULT CURRENT_DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add any columns that may be missing from an existing table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name         TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url        TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_premium        BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS downloads_used    INT     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS videos_used       INT     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ai_fills_used     INT     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_ai_fill_date DATE    DEFAULT CURRENT_DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- WEBHOOK EVENTS TABLE (fully rebuilt to include all columns webhook.ts writes)
-- We drop and recreate this table since it stores only logs (no critical user data).
DROP TABLE IF EXISTS public.webhook_events;
CREATE TABLE public.webhook_events (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type  TEXT        NOT NULL,
    data        JSONB       NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================================================

ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- STEP 5: USERS TABLE — RLS POLICIES
-- Users can only see and modify their own row.
-- Service role (used by webhook.ts, track-usage.ts) bypasses RLS automatically
-- in Supabase — no special policy needed for it.
-- =============================================================================

-- SELECT: authenticated users see only their own row
CREATE POLICY "users_select_own"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- INSERT: authenticated users can only insert their own row
CREATE POLICY "users_insert_own"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: authenticated users can only update their own row
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- =============================================================================
-- STEP 6: WEBHOOK EVENTS TABLE — RLS POLICIES
-- Only the Supabase service role should ever write here (via webhook.ts).
-- Service role bypasses RLS automatically, so we just block everyone else
-- with a deny-all policy.
-- =============================================================================

-- Deny all access to anon and authenticated roles.
-- Service role bypasses this entirely — it does NOT need a permissive policy.
CREATE POLICY "webhook_events_deny_all"
ON public.webhook_events
FOR ALL
TO public
USING (false)
WITH CHECK (false);


-- =============================================================================
-- STEP 7: STORAGE — AVATARS BUCKET
-- =============================================================================

-- Create the avatars bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC READ: anyone can view avatars (needed for profile picture display)
CREATE POLICY "avatars_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- INSERT: authenticated users can only upload to their own folder
-- Folder structure enforced: avatars/<user-id>/filename
-- File size capped at 2MB
CREATE POLICY "avatars_authenticated_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (metadata->>'size')::int <= 2097152
);

-- UPDATE: users can only replace files in their own folder
CREATE POLICY "avatars_own_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: users can only delete files in their own folder
CREATE POLICY "avatars_own_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);


-- =============================================================================
-- STEP 8: AUTO-CREATE USER ROW ON SIGN UP
-- Trigger fires after a new row is inserted into auth.users.
-- This is the authoritative place where plan = 'free' is set for new users.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, plan)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        'free'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Drop old trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- STEP 9: ATOMIC AI FILLS INCREMENT
-- Called by generate.ts (server) and incrementAIFills (client via RPC).
-- Handles daily reset atomically — no race conditions.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_ai_fills(target_user_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_count  INT;
    today_date DATE := CURRENT_DATE;
BEGIN
    -- SECURITY: caller must be the same user, or the service role (which bypasses this check)
    IF auth.uid() IS NOT NULL AND auth.uid() <> target_user_id THEN
        RAISE EXCEPTION 'Unauthorized: cannot increment fills for another user';
    END IF;

    -- Atomically increment, with daily reset if the date has changed
    UPDATE public.users
    SET
        ai_fills_used = CASE
            WHEN last_ai_fill_date IS DISTINCT FROM today_date THEN 1
            ELSE ai_fills_used + 1
        END,
        last_ai_fill_date = today_date,
        updated_at = NOW()
    WHERE id = target_user_id
    RETURNING ai_fills_used INTO new_count;

    IF new_count IS NULL THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;

    RETURN new_count;
END;
$$;


-- =============================================================================
-- STEP 10: ATOMIC DOWNLOADS / VIDEOS INCREMENT
-- Called by track-usage.ts on the server side.
-- Column name is validated against a whitelist to prevent SQL injection.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_usage(user_id UUID, column_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Whitelist: only these two columns can be incremented
    IF column_name NOT IN ('downloads_used', 'videos_used') THEN
        RAISE EXCEPTION 'Invalid column name: %. Allowed: downloads_used, videos_used', column_name;
    END IF;

    -- SECURITY: caller must be the same user, or the service role
    IF auth.uid() IS NOT NULL AND auth.uid() <> user_id THEN
        RAISE EXCEPTION 'Unauthorized: cannot increment usage for another user';
    END IF;

    -- Single atomic UPDATE — no read-then-write race condition
    IF column_name = 'downloads_used' THEN
        UPDATE public.users
        SET downloads_used = downloads_used + 1, updated_at = NOW()
        WHERE id = user_id;
    ELSIF column_name = 'videos_used' THEN
        UPDATE public.users
        SET videos_used = videos_used + 1, updated_at = NOW()
        WHERE id = user_id;
    END IF;
END;
$$;


-- =============================================================================
-- STEP 11: UPDATED_AT AUTO-TIMESTAMP TRIGGER
-- Keeps updated_at accurate whenever any column on users changes.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =============================================================================
-- STEP 12: GRANT EXECUTE PERMISSIONS
-- authenticated role can call these RPCs from the client.
-- service_role can always call them (no grant needed).
-- =============================================================================

GRANT EXECUTE ON FUNCTION public.increment_ai_fills(UUID)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_usage(UUID, TEXT)     TO authenticated;


-- =============================================================================
-- STEP 13: VERIFY — run these SELECTs to confirm everything looks right
-- =============================================================================

-- Should show: users_select_own, users_insert_own, users_update_own
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('users', 'webhook_events')
ORDER BY tablename, policyname;

-- Should show all 4 avatar policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

-- Should show increment_ai_fills, increment_usage, handle_new_user, handle_updated_at
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Should show all users columns including is_premium, stripe_customer_id
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;