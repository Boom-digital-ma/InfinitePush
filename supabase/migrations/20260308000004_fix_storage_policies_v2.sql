-- Migration: Fix Storage Policies V2
-- Description: Sets up policies for the infinite-push bucket without using restricted commands.
-- Execute this on the CLIENT'S Supabase instance.

-- 1. Note: If the bucket 'infinite-push' does not exist, 
-- please create it manually in the Supabase Dashboard (Storage -> New Bucket -> Public).

-- 2. Clean up existing policies for this bucket
DROP POLICY IF EXISTS "Public Access for infinite-push" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload for infinite-push" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;

-- 3. Policy: Allow PUBLIC to download/read files
-- This allows the mobile app to get the ZIP
CREATE POLICY "Public Access for infinite-push" 
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'infinite-push');

-- 4. Policy: Allow the Dashboard to upload/manage files
-- This is what the Server Action uses
CREATE POLICY "Dashboard Full Access" 
ON storage.objects FOR ALL 
TO public
USING (bucket_id = 'infinite-push')
WITH CHECK (bucket_id = 'infinite-push');
