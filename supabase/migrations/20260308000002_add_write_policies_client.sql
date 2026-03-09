-- Migration: Add WRITE policies for infinite_push_deployments
-- Description: Allows the InfinitePush Dashboard to insert and update deployments.
-- Execute this on the CLIENT'S Supabase instance.

-- 1. Policy: Allow inserting new releases
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'infinite_push_deployments' 
        AND policyname = 'Allow insert for dashboard'
    ) THEN
        CREATE POLICY "Allow insert for dashboard" ON public.infinite_push_deployments 
        FOR INSERT WITH CHECK (true);
    END IF;
END
$$;

-- 2. Policy: Allow updating deployments (Required for Rollbacks)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'infinite_push_deployments' 
        AND policyname = 'Allow update for dashboard'
    ) THEN
        CREATE POLICY "Allow update for dashboard" ON public.infinite_push_deployments 
        FOR UPDATE USING (true);
    END IF;
END
$$;
