-- Migration: Fix Storage RLS for InfinitePush bucket
-- Description: Ensures the Dashboard can upload and manage ZIP files in the storage.
-- Execute this on the CLIENT'S Supabase instance.

-- 1. Ensure the bucket is public and exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('infinite-push', 'infinite-push', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing conflicting policies to start clean (Optional but safer)
DROP POLICY IF EXISTS "Public Access for infinite-push" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload for infinite-push" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard Full Access" ON storage.objects;

-- 3. Policy: Allow PUBLIC to download/read (Required for mobile app)
CREATE POLICY "Public Access for infinite-push" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'infinite-push');

-- 4. Policy: Allow FULL ACCESS for the Dashboard (Required for Upload/Delete/Update)
-- This uses "FOR ALL" to cover INSERT, UPDATE, and DELETE.
CREATE POLICY "Dashboard Full Access" 
ON storage.objects FOR ALL 
USING (bucket_id = 'infinite-push')
WITH CHECK (bucket_id = 'infinite-push');

-- 5. Give specific permission to the service_role and authenticated users if needed
-- (Usually 'Dashboard Full Access' with 'true' or 'bucket_id' check is enough for Service Role)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
