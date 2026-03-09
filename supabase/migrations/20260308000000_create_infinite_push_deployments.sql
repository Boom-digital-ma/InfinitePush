-- Migration: Create infinite_push_deployments table and storage policies
-- Description: Stores version history and metadata for Capacitor Live Updates + Storage Config.

CREATE TABLE IF NOT EXISTS public.infinite_push_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    version TEXT NOT NULL,         -- e.g., '1.0.1'
    build_number INT NOT NULL,     -- e.g., 5
    zip_url TEXT NOT NULL,         -- URL to the ZIP bundle in Supabase Storage
    channel TEXT DEFAULT 'production', -- 'production', 'staging', 'beta'
    status TEXT DEFAULT 'active',  -- 'active', 'rolled_back'
    is_mandatory BOOLEAN DEFAULT true, -- Force update?
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for faster version lookups
CREATE INDEX IF NOT EXISTS idx_infinite_push_version ON public.infinite_push_deployments(version);

-- Enable RLS for security (Public Read Access)
ALTER TABLE public.infinite_push_deployments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read the deployment history (Required for the mobile app to check updates)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'infinite_push_deployments' 
        AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.infinite_push_deployments 
        FOR SELECT USING (true);
    END IF;
END
$$;

-----------------------------------------------------------
-- STORAGE CONFIGURATION (Bucket: infinite-push)
-----------------------------------------------------------

-- 1. Create the bucket if it doesn't exist (Public by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('infinite-push', 'infinite-push', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policy: Allow public access to read/download files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Public Access for infinite-push'
    ) THEN
        CREATE POLICY "Public Access for infinite-push" ON storage.objects
        FOR SELECT USING (bucket_id = 'infinite-push');
    END IF;
END
$$;

-- 3. Policy: Allow Admin/Service Role to upload files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Admin Upload for infinite-push'
    ) THEN
        CREATE POLICY "Admin Upload for infinite-push" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'infinite-push');
    END IF;
END
$$;
